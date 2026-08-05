import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import bodyParser from 'body-parser'
import fs from 'fs'

import { UserRouter } from './Routes/Authentication.js'
import { statisticsRouter } from './Routes/Statistic.js'
import { solutionsRouter } from './Routes/Solution.js'
import { logoRouter } from './Routes/Logo.js'
import { BlogsRouter } from './Routes/Blogs.js'
import { CommentRouter } from './Routes/Comment.js'
import { emailRouter } from './Routes/Email.js'
import { solutionCategoriesRouter } from './Routes/SolutionsCategory.js'
import { SecurityKey } from './Models/SercurityKey.js'
import './Models/Blogs.js'
import { getConfig, updateConfig, getAllConfig } from './configManager.js'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set('trust proxy', 1)

const clientUrl = getConfig('CLIENT_URL')
const allowedOrigins = [
  ...new Set(
    [
      'https://www.agilebiz.co.ke',
      'https://agilebiz.co.ke',
      'https://webtest-api.agilebiz.co.ke',
      'http://localhost:5173',
      'http://localhost:5000',
      clientUrl
    ].filter(Boolean)
  )
]

const applyCorsHeaders = (req, res) => {
  const origin = req.headers.origin
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.setHeader('Vary', 'Origin')
  }
}

// CORS must be first — before body parsers and routes
app.use((req, res, next) => {
  applyCorsHeaders(req, res)
  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }
  next()
})

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204
  })
)

app.use(express.json())
app.use(bodyParser.json())

const webBuildPath = fs.existsSync(path.join(__dirname, '../web/build'))
  ? path.join(__dirname, '../web/build')
  : path.join(__dirname, '../web/dist')

app.use(express.static(webBuildPath))
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')))

app.get('/health', async (req, res) => {
  try {
    const connected = mongoose.connection.readyState === 1
    let collections = []

    if (connected && mongoose.connection.db) {
      const names = await mongoose.connection.db.listCollections().toArray()
      collections = await Promise.all(
        names.map(async ({ name }) => ({
          name,
          count: await mongoose.connection.db.collection(name).countDocuments()
        }))
      )
    }

    res.json({
      status: 'ok',
      mongo: connected ? 'connected' : 'disconnected',
      database: mongoose.connection.name || null,
      collections
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

const initializeSecurityKey = async () => {
  const existingKey = await SecurityKey.findOne()
  if (!existingKey) {
    await SecurityKey.create({ key: '1234' })
    console.log('Default security key set.')
  }
}

app.post('/validate-security-key', async (req, res) => {
  try {
    const storedKey = await SecurityKey.findOne()
    if (!storedKey) return res.status(500).json({ error: 'Security key not found' })

    res.json({ isValid: req.body.key === storedKey.key })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/update-security-key', async (req, res) => {
  try {
    const updatedKey = await SecurityKey.findOneAndUpdate(
      {},
      { key: req.body.newKey },
      { new: true, upsert: true }
    )
    res.json({ success: true, updatedKey })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update security key' })
  }
})

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

  if (!key || value === undefined) {
    return res.status(400).json({ error: 'Key and value required' })
  }

  try {
    const success = updateConfig(key, value)

    if (success) {
      res.json({ success: true })

      if (key === 'MONGO_URI') {
        mongoose
          .disconnect()
          .then(() => mongoose.connect(value))
          .then(() => console.log('MongoDB reconnected'))
          .catch((err) => console.error('Mongo reconnect error:', err))
      }
    } else {
      res.status(500).json({ error: 'Update failed' })
    }
  } catch (error) {
    console.error('Error updating config:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

app.use('/api', UserRouter)
app.use('/stats', statisticsRouter)
app.use('/solns', solutionsRouter)
app.use('/log', logoRouter)
app.use('/blog', BlogsRouter)
app.use('/comments', CommentRouter)
app.use('/email', emailRouter)
app.use('/api/solution-categories', solutionCategoriesRouter)

app.get('*', (req, res) => {
  res.sendFile(path.join(webBuildPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err)
      res.status(500).send('Server error')
    }
  })
})

app.use((err, req, res, next) => {
  applyCorsHeaders(req, res)
  console.error('Unexpected error:', err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

const getMongoUri = () => {
  const uri = getConfig('MONGO_URI')
  const dbName = getConfig('DB_NAME') || 'AgileWebsite'
  if (!uri) return uri

  // Inject database name when URI ends at host (e.g. ...27017/?authSource=admin)
  const hasDatabase = /mongodb(\+srv)?:\/\/[^/]+\/[^/?]+/.test(uri)
  if (hasDatabase) return uri

  return uri.replace(
    /^(mongodb(?:\+srv)?:\/\/[^/]+)\/?(\?.*)?$/,
    (_, base, query = '') => `${base}/${dbName}${query}`
  )
}

const mongoUri = getMongoUri()

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log(`MongoDB connected to database: ${mongoose.connection.name}`)
    initializeSecurityKey()
  })
  .catch((err) => console.error('Mongo error:', err))

const port = getConfig('PORT') || 5000

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
  console.log(`Serving frontend from: ${webBuildPath}`)
  console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`)
  console.log(`MongoDB URI database: ${mongoose.connection.name || getConfig('DB_NAME') || 'AgileWebsite'}`)
  console.log(`Client URL: ${getConfig('CLIENT_URL') || 'Not configured'}`)
})

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})
