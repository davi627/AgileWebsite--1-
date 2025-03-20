import dotenv from 'dotenv'
import fs from 'fs'

const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env'

const envConfig = dotenv.config({ path: envPath })

if (envConfig.error) {
  throw envConfig.error
}

if (envConfig.parsed) {
  const parsed = envConfig.parsed as Record<string, string>

  for (const key in parsed) {
    if (!key.startsWith('REACT_APP_')) {
      parsed[`REACT_APP_${key}`] = parsed[key]
      delete parsed[key]
    }
  }

  fs.writeFileSync(
    '.env',
    Object.keys(parsed)
      .map((key) => `${key}=${parsed[key]}`)
      .join('\n')
  )
}
