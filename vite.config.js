import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    build: {
      outDir: 'build',
    },
    define: {
        'process.env': {},
    },
    plugins: [react()],
    server: {
      port: env.VITE_PORT || 4000
    },
    resolve: {
      alias: {
        '@': '/src',
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs'
      },
    },
  }
})