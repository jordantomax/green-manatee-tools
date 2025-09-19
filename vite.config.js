import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    build: {
      outDir: 'build',
      rollupOptions: {
        external: (id) => {
          // Exclude test files from build
          return id.includes('__tests__') || 
                 id.includes('.test.') || 
                 id.includes('.spec.')
        }
      }
    },
    define: {
        'process.env': {},
    },
    plugins: [react()],
    server: {
      port: 4000
    },
    resolve: {
      alias: {
        '@': '/src',
        '@tests': '/tests',
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs'
      },
    },
  }
})