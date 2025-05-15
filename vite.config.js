import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // server: {
  //   host: '2001:0:2851:782c:8d2:3b9d:3f57:fe83',
  //   port: 5173, // yoki siz xohlagan port
  // }
})
