import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Project site: https://aol-work.github.io/robotics-model-overview/
  base: '/robotics-model-overview/',
  plugins: [react()],
})
