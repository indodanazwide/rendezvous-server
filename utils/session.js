import crypto from 'crypto'
import redis from '../config/redis.js'

const TOKEN_EXPIRY = 3600 
const GRACE_PERIOD = 600 

export const generateToken = () => {
    return crypto.randomBytes(32).toString('hex')
}

export const storeToken = async (userId, token) => {
    const key = `session:${token}`
    await redis.set(key, userId, 'EX', TOKEN_EXPIRY)
}

export const verifyToken = async (token) => {
    const key = `session:${token}`
    const userId = await redis.get(key)

    if (!userId) return null

    const ttl = await redis.ttl(key)
    if (ttl < GRACE_PERIOD) {
        await redis.expire(key, TOKEN_EXPIRY)
    }

    return userId
}

export const revokeToken = async (token) => {
    const key = `session:${token}`
    await redis.del(key)
}
