import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: './' → derlenen `dist/` klasörü herhangi bir alt dizinden (örn. GitHub Pages) servis edilebilir.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
