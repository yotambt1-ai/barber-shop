import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // זה השורה שמאפשרת להשתמש ב-@ כדי להגיע לתיקיית src
      "@": path.resolve(__dirname, "./src"),
    },
  },
})