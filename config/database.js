import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

const connectDB = async () => {
    try {
        await pool.getConnection()
        console.log(`Connected to the database`)
    } catch (error) {
        console.error(`Failed to connect to the database, error: ${error.message}`)
        throw error
    }
}

export { pool, connectDB }  