import express from 'express'
import dotenv from 'dotenv'
import router from './router.js'
import session from 'express-session'
import passport from './config/passport.js'
import { connectDB } from './config/database.js'

dotenv.config()

const server = express()
const port = process.env.PORT || 8008

server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.use(
    session({
        secret: process.env.SESSION_SECRET || '',
        resave: false,
        saveUninitialized: true,
    })
)

server.use(passport.initialize())
server.use(passport.session())

server.use('/', router)

const startServer = async () => {
    try {
        await connectDB()
        server.listen(port, () => {
            console.log(`Server started on port ${port}`)
        })
    } catch (error) {
        console.error(`Failed to start the server, error: ${error.message}`)
        process.exit(1)
    }
}

startServer()