import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const configPath = path.join(__dirname, 'config.json')

let config = {}

// Initialize config
try {
  const data = fs.readFileSync(configPath, 'utf8')
  config = JSON.parse(data)
} catch (err) {
  console.error('Error reading config file:', err)
  process.exit(1)
}

// Function to get a config value
export function getConfig(key) {
  return config[key]
}

// Function to update a config value
export function updateConfig(key, value) {
  config[key] = value

  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    return true
  } catch (err) {
    console.error('Error updating config file:', err)
    return false
  }
}

// Function to get all config (for admin purposes)
export function getAllConfig() {
  return { ...config }
}
