import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { UserRouter } from './Routes/Authentication.js'
import dotenv from 'dotenv'
import { statisticsRouter } from './Routes/Statistic.js'
import { solutionsRouter } from './Routes/Solution.js'
import path from 'path';
import { logoRouter } from './Routes/Logo.js'
import { BlogsRouter } from './Routes/Blogs.js'
dotenv.config()

const app = express()

// Middleware


app.use(express.json())
app.use('/logos', express.static(path.join(process.cwd(), 'uploads'))); 
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials:true,
    optionsSuccessStatus:200,
    allowedHeaders: ['Content-Type', 'Authorization']
}))
//routes 
app.use('/api',UserRouter)
app.use('/stats',statisticsRouter)
app.use('/solns',solutionsRouter)
app.use('/log',logoRouter)
app.use('/blog', BlogsRouter)




//connecting to the database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error("mongo connection error:",err))
    
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))

