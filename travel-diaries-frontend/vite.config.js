import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [ tailwindcss(),react()],
  server : {
    allowedHosts: ["5b79-2409-40c1-3024-3ce0-d032-2528-4cc9-333c.ngrok-free.app"],
  }
})


