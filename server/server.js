import express from "express"
import cors from "cors"
import { configDotenv } from "dotenv"
import authMiddleware from "./middlewares/authMiddleware.js"
import aiRouter from "./routes/aiRouter.js"

configDotenv()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({origin : process.env.FRONTEND_URL}))
app.use(express.json)

app.use("/health",(_,res)=> res.json({ok : true}))
app.use("/ai", authMiddleware,)


app.listen(PORT , ()=> console.log(`Server is running on ${PORT}`))