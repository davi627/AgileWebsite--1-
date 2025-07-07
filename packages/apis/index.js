import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { UserRouter } from './Routes/Authentication.js'
import { statisticsRouter } from './Routes/Statistic.js'
import { solutionsRouter } from './Routes/Solution.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { logoRouter } from './Routes/Logo.js'
import { BlogsRouter } from './Routes/Blogs.js'
import { CommentRouter } from './Routes/Comment.js'
import { emailRouter } from './Routes/Email.js'
import bodyParser from 'body-parser'
import { getConfig, updateConfig, getAllConfig } from './configManager.js'
import { solutionCategoriesRouter } from './Routes/SolutionsCategory.js'

const app = express()

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Trust proxy headers from IIS
app.set('trust proxy', 1)

// Serve static files from React's "web/build" folder
app.use(express.static(path.join(__dirname, '../web/build')))
// Serve uploaded files from public/uploads
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')))

app.use(express.json())
app.use(bodyParser.json())

// CORS configuration with fallback
const clientUrl = getConfig('CLIENT_URL')
app.use(
  cors({
    origin: clientUrl ? [clientUrl] : '*',
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)





// Configuration management routes
app.get('/api/config', (req, res) => {
  try {
    res.json(getAllConfig())
  } catch (error) {
    console.error('Error fetching config:', error)
    res.status(500).json({ error: 'Failed to fetch config' })
  }
})

app.post('/api/config', (req, res) => {
  const { key, value } = req.body
  try {
    if (!key || value === undefined) {
      return res.status(400).json({ error: 'Both key and value are required' })
    }

    const success = updateConfig(key, value)
    if (success) {
      res.json({ success: true, message: 'Config updated successfully' })

      if (key === 'PORT') {
        console.log(
          `PORT changed to ${value}. Please restart the server for changes to take effect.`
        )
      }

      if (key === 'MONGO_URI') {
        mongoose
          .disconnect()
          .then(() => mongoose.connect(value))
          .then(() => console.log('Reconnected to MongoDB with new URI'))
          .catch((err) => {
            console.error('Error reconnecting to MongoDB:', err)
            res.status(500).json({ error: 'Failed to reconnect to MongoDB' })
          })
      }
    } else {
      res.status(500).json({ error: 'Failed to update config' })
    }
  } catch (error) {
    console.error('Error updating config:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Application routes
app.use('/api', UserRouter)
app.use('/stats', statisticsRouter)
app.use('/solns', solutionsRouter)
app.use('/log', logoRouter)
app.use('/blog', BlogsRouter)
app.use('/comments', CommentRouter)
app.use('/email', emailRouter)
app.use('/api/solution-categories', solutionCategoriesRouter)

// All other requests go to React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../web/build', 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err)
      res.status(500).send('Server error')
    }
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

// Connect to the database
mongoose
  .connect(getConfig('MONGO_URI'))
  .then(() => {
    console.log('Connected to MongoDB')
   
  })
  .catch((err) => console.error('Mongo connection error:', err))

// Start the server
const port = getConfig('PORT') || 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log(`Client URL: ${getConfig('CLIENT_URL') || 'Not configured'}`)
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})