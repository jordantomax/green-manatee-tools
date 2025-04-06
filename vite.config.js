import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
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
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      }
    },
  }
})