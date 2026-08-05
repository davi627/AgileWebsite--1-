import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const configPath = path.join(__dirname, 'config.json')

dotenv.config({ path: path.join(__dirname, '../../.env') })
dotenv.config({ path: path.join(__dirname, '.env') })

const CONFIG_ENV_KEYS = [
  'MONGO_URI',
  'DB_NAME',
  'JWT_SECRET',
  'PORT',
  'CLIENT_URL',
  'API_PUBLIC_URL',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM',
  'AZURE_STORAGE_CONNECTION_STRING'
]

let config = {}

try {
  if (fs.existsSync(configPath)) {
    const data = fs.readFileSync(configPath, 'utf8')
    config = JSON.parse(data)
  } else {
    console.warn('config.json not found — using environment variables only')
  }
} catch (err) {
  console.error('Error reading config file:', err)
  process.exit(1)
}

function hasEnvConfig() {
  return CONFIG_ENV_KEYS.some(
    (key) => process.env[key] !== undefined && process.env[key] !== ''
  )
}

if (!fs.existsSync(configPath) && !hasEnvConfig()) {
  console.error(
    'No config.json and no environment variables found. Set MONGO_URI at minimum.'
  )
  process.exit(1)
}

function parseConfigValue(key, value) {
  if (value === undefined || value === '') {
    return undefined
  }

  if (key === 'PORT' || key === 'SMTP_PORT') {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? value : parsed
  }

  return value
}

export function getConfig(key) {
  if (process.env[key] !== undefined && process.env[key] !== '') {
    return parseConfigValue(key, process.env[key])
  }

  return config[key]
}

export function updateConfig(key, value) {
  config[key] = value

  if (process.env[key] !== undefined) {
    return true
  }

  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    return true
  } catch (err) {
    console.error('Error updating config file:', err)
    return false
  }
}

export function getAllConfig() {
  const merged = { ...config }

  for (const key of CONFIG_ENV_KEYS) {
    if (process.env[key] !== undefined && process.env[key] !== '') {
      merged[key] = parseConfigValue(key, process.env[key])
    }
  }

  return merged
}
