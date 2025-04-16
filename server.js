import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/database.js'

dotenv.config()

const server = express()
const port = process.env.PORT || 8008

server.use(express.json())
server.use(express.urlencoded({ extended: true }))

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