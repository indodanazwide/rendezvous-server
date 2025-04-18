import bcrypt from 'bcrypt'
import { generateToken, storeToken } from '../utils/session.js'
import { pool } from '../config/database.js'

export const signup = async (req, res) => {
    const { name, surname, username, email, phone, password, role, provider, avatar_url } = req.body

    try {
        const [existingUser] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        )

        if (existingUser.length > 0) {
            return res.status(409).json({
                message: 'Email already exists.',
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const [result] = await pool.query(`INSERT INTO users (id, name, surname, username, email, phone, password, role, provider, avatar_url) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [name, surname, username, email, phone || null, hashedPassword, role || 'customer', provider || 'local', avatar_url || null])

        if (result.affectedRows === 0) {
            return res.status(500).json({
                message: 'Failed to create user.',
            })
        }

        return res.status(201).json({
            message: 'User registered successfully.',
            userId: result.insertId,
        })
    } catch (error) {
        console.error('Error during signup:', error)

        return res.status(500).json({
            message: 'Internal server error.',
        })
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body

    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email])
        if (rows.length === 0) {
            return res.status(401).json({
                message: 'Invalid email or password.',
            })
        }

        const user = rows[0]
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password.',
            })
        }

        const token = generateToken()
        await storeToken(user.id, token)

        res.status(200).json({
            message: 'Login successful',
            token,
        })
    } catch (error) {
        console.error('Error during login:', error)

        return res.status(500).json({
            message: 'Internal server error.',
        })
    }
}

export const googleCallback = (req, res) => {
    console.log('Google authentication successful')
    console.log('User profile:', req.user)
    res.redirect('/')
}