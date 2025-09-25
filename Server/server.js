import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

const PORT = process.env.PORT || 4000
const app = express()

const allowedOrigins = ['http://localhost:5173']
app.use(express.json())
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  //methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  //allowedHeaders: ["Content-Type", "Authorization", "token"], // include any custom header you send
}));
await connectDB()

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)
app.get('/', (req, res) => res.send('API working'))

app.listen(PORT, () => console.log('Server running on port ' + PORT))