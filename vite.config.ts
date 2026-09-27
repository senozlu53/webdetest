import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Her stil kendi HTML giriş noktasına ve kendi Tailwind temasına sahiptir.
// base: './' → derlenen `dist/` klasörü herhangi bir alt dizinden (örn. GitHub Pages) servis edilebilir.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        katalog: resolve(import.meta.dirname, 'index.html'),
        'stil-001': resolve(import.meta.dirname, 'stil/001/index.html'),
        'stil-002': resolve(import.meta.dirname, 'stil/002/index.html'),
        'stil-003': resolve(import.meta.dirname, 'stil/003/index.html'),
        'stil-004': resolve(import.meta.dirname, 'stil/004/index.html'),
        'stil-005': resolve(import.meta.dirname, 'stil/005/index.html'),
        'stil-006': resolve(import.meta.dirname, 'stil/006/index.html'),
        'stil-007': resolve(import.meta.dirname, 'stil/007/index.html'),
        'stil-008': resolve(import.meta.dirname, 'stil/008/index.html'),
        'stil-009': resolve(import.meta.dirname, 'stil/009/index.html'),
        'stil-010': resolve(import.meta.dirname, 'stil/010/index.html'),
      },
    },
  },
})
