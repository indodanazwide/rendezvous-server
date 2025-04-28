import express from "express"
import dotenv from "dotenv"

dotenv.config()

const server = express()
const port = process.env.PORT || 8000

server.listen(port, () => { console.log(`Server is running on port ${port}`)})