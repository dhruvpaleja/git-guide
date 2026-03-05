import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@contracts": path.resolve(__dirname, "./server/src/shared/contracts"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'react-hook-form',
            'date-fns',
          ],
          'animation': [
            'framer-motion',
            'gsap',
            '@gsap/react',
            'animejs',
            'aos',
            'lottie-react',
          ],
          'three-core': [
            'three',
            '@react-three/fiber',
            '@react-three/drei',
          ],
          'ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-tabs',
            '@radix-ui/react-accordion',
          ],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 4173,
  },
});
