import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    cssCodeSplit: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id) return null;
          if (id.includes('node_modules')) {
            // extract package name from path e.g. node_modules/packageNames/... or node_modules/@scope/packageName/...
            const match = id.match(/node_modules[\\/](.*?)([\\/]|$)/);
            if (match && match[1]) {
              let pkg = match[1];
              // For scoped packages, include scope and name
              if (pkg.startsWith('@')) {
                const parts = pkg.split(/[\\/]/);
                pkg = parts.slice(0, 2).join('/');
              } else {
                pkg = pkg.split(/[\\/]/)[0];
              }
              // return a chunk name safe for filenames
              return 'vendor-' + pkg.replace('/', '-')
            }
            return 'vendor'
          }
        }
      }
    }
  }
})
