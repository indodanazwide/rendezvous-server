import express from 'express'
import dotenv from 'dotenv'
import { googleCallback, login, signup } from './auth.controller.js'
import passport from '../config/passport.js'

dotenv.config()

const authRouter = express.Router()

authRouter.post('/signup', signup)
authRouter.post('/login', login)

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    console.log('Google authentication successful')
    console.log('User profile:', req.user)
    res.redirect('/')
})

export default authRouter
