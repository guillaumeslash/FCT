import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/FCT/',
  assetsInclude: ['**/*.json', '**/*.mp3', '**/*.jpg']
})
