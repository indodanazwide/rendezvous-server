import express from "express"
import session from "express-session"
import cors from "cors"
import dotenv from "dotenv"
import router from "./router.js"

dotenv.config()

const server = express()
const port = process.env.PORT || 8008

server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

server.use(cors({ origin: "*"}))

server.use("/", router)

const startServer = async () => {
    try {
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    } catch (error) {
        console.error("Error starting server:", error)
        process.exit(1)        
    }
}

startServer()