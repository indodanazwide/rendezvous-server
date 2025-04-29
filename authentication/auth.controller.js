import { registerUser, loginUser, sendPasswordReset } from "../authentication/firebase.auth.js"

export const register = async (req, res) => {
    const { name, surname, email, password, role, studentNumber, phone } = req.body

    try {
        const user = await registerUser({
            name,
            surname,
            email,
            password,
            role,
            studentNumber,
            phone,
        })
        res.status(201).json({ message: "User registered successfully", user })
    } catch (error) {
        res.status(400).json({ message: "Error registering user", error: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await loginUser(email, password)
        res.status(200).json({ message: "User logged in successfully", user })
    } catch (error) {
        res.status(401).json({ message: "Error logging in user", error: error.message })
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body

    try {
        await sendPasswordReset(email)
        res.status(200).json({ message: "Password reset email sent successfully" })
    } catch (error) {
        res.status(400).json({ message: "Error sending password reset email", error: error.message })
    }
}
