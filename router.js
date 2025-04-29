import express from "express"
import authRouter from "./authentication/auth.routes.js"

const router = express.Router()

router.use("/auth", authRouter)

export default router
