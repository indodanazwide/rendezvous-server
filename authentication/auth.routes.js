import express from "express"
import passport from '../config/passport.js'
import { register, login, forgotPassword } from "./auth.controller.js"

const authRouter = express.Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/forgot-password", forgotPassword)
authRouter.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }))
authRouter.get("/google/callback", passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/')
})
authRouter.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Error logging out", error: err.message })
        }
        res.status(200).json({ message: "User logged out successfully" })
    })
})

export default authRouter
