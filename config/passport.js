import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import dotenv from 'dotenv'
import { connectDB, pool } from './database.js'

dotenv.config()

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:8008/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND provider = ?', [
                    profile.emails[0].value,
                    'google',
                ])
                if (rows.length > 0) {
                    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [rows[0].id])
                    return done(null, rows[0])
                } else {
                    const [result] = await pool.query(
                        `INSERT INTO users (name, surname, email, provider, avatar_url, is_active, last_login, created_at, updated_at)
                         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
                        [
                            profile.name.givenName || profile.displayName.split(' ')[0], 
                            profile.name.familyName || profile.displayName.split(' ')[1] || '', 
                            profile.emails[0].value,
                            'google', 
                            profile.photos[0]?.value || '', 
                            true, 
                        ]
                    )
                    const newUser = {
                        id: result.insertId,
                        name: profile.name.givenName || profile.displayName.split(' ')[0],
                        surname: profile.name.familyName || profile.displayName.split(' ')[1] || '',
                        email: profile.emails[0].value,
                        provider: 'google',
                        avatar_url: profile.photos[0]?.value || '',
                        is_active: true,
                    }
                    return done(null, newUser)
                }
            } catch (error) {
                console.error('Error saving user:', error)
                return done(error, null)
            }
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id])
        if (rows.length > 0) {
            done(null, rows[0]) 
        } else {
            done(new Error('User not found'), null)
        }
    } catch (error) {
        done(error, null)
    }
})

export default passport