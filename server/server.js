// devdocs-backend/server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { aiRouter } from './routes/aiRouter.js'
import { authMiddleware } from './middlewares/authMiddleware.js'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5000

// const allowedOrigins = [
//     'https://dev-docs-w7mp.vercel.app/',
//     process.env.FRONTEND_URL,
// ].filter(Boolean)

// app.use(cors({
//     origin : (origin,callback)=>{
//         if(!origin || allowedOrigins.includes(origin)) return callback(null,true);
//         callback(new Error("Not allowed by CORS"));
//     },
//     credentials:true
// }))

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json())


// all /ai routes require a valid Supabase JWT
app.use('/ai', authMiddleware, aiRouter)

app.get('/health', (_, res) => res.json({ ok: true }))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))