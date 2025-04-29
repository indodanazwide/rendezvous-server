import passport from 'passport'
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { firebaseApp } from "./firebase.js"
import dotenv from "dotenv"

dotenv.config()

const firestore = getFirestore(firebaseApp)

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:8008/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const userDocRef = doc(firestore, 'users', profile.id)
                const userDoc = await getDoc(userDocRef)

                if (!userDoc.exists()) {
                    // Create a new user in Firestore
                    const userData = {
                        name: profile.name.givenName || 'Unknown',
                        surname: profile.name.familyName || 'Unknown',
                        email: profile.emails[0].value,
                        role: 'external_user', // Default role for Google OAuth users
                        isActive: true,
                        provider: 'google',
                        avatarUrl: profile.photos[0]?.value || null,
                        lastLogin: serverTimestamp(),
                        createdAt: serverTimestamp(),
                        studentNumber: null,
                        phone: null,
                        isVerified: true,
                        additionalInfo: {},
                    }

                    await setDoc(userDocRef, userData)
                    console.log('New user created:', userData)
                    return done(null, userData)
                } else {
                    // Update last login timestamp for existing user
                    await setDoc(
                        userDocRef,
                        { lastLogin: serverTimestamp() },
                        { merge: true }
                    )
                    console.log('Existing user logged in:', userDoc.data())
                    return done(null, userDoc.data())
                }
            } catch (error) {
                console.error('Error saving user:', error)
                return done(error, null)
            }
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user.email)
})

passport.deserializeUser(async (id, done) => {
    try {
        const userDocRef = doc(firestore, 'users', email)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
            done(null, userDoc.data())
        } else {
            done(new Error('User not found'), null)
        }
    } catch (error) {
        done(error, null)
    }
})

export default passport