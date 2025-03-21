import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { UserRouter } from './Routes/Authentication.js';
import dotenv from 'dotenv';
import { statisticsRouter } from './Routes/Statistic.js';
import { solutionsRouter } from './Routes/Solution.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { logoRouter } from './Routes/Logo.js';
import { BlogsRouter } from './Routes/Blogs.js';
import { CommentRouter } from './Routes/Comment.js';
import { emailRouter } from './Routes/Email.js';

dotenv.config();

const app = express();

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Routes
app.use('/api', UserRouter);
app.use('/stats', statisticsRouter);
app.use('/solns', solutionsRouter);
app.use('/log', logoRouter);
app.use('/blog', BlogsRouter);
app.use('/comments', CommentRouter);
app.use('/email', emailRouter)

// Connect to the database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Mongo connection error:', err));

// Start the server
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);