// devdocs-backend/server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { aiRouter } from './routes/aiRouter.js'
import { authMiddleware } from './middlewares/authMiddleware.js'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

// all /ai routes require a valid Supabase JWT
app.use('/ai', authMiddleware, aiRouter)

app.get('/health', (_, res) => res.json({ ok: true }))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))