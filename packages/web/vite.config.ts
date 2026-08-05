/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

const API_PROXY_TARGET = 'http://localhost:5000'

// Mirrors IIS web.config: proxy API paths to Node on port 5000
const apiProxy = {
  target: API_PROXY_TARGET,
  changeOrigin: true
}

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      '^/(api|stats|solns|log|blog|comments|email|uploads|Uploads|validate-security-key|update-security-key)':
        apiProxy
    }
  },
  preview: {
    proxy: {
      '^/(api|stats|solns|log|blog|comments|email|uploads|Uploads|validate-security-key|update-security-key)':
        apiProxy
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: '.vitest/setup',
    include: ['**/test.{ts,tsx}']
  }
})
