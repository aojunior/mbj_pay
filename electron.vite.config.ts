import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    envPrefix: 'MAIN_VITE_',
    resolve: {
      alias: {
        '@/lib': resolve('src/main/lib'),
        '@shared': resolve('src/shared')
      }
    },
    plugins: []
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    assetsInclude: 'src/renderer/assets/**',
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@shared': resolve('src/shared'),
        '@/hooks': resolve('src/hooks'),
        '@/assets': resolve('src/assets'),
        '@/contexts': resolve('src/contexts'),
        '@/components': resolve('src/components'),
        '@/util': resolve('src/shared')
      }
    },
    plugins: [react()],
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: 'out/main/index.js',
          preload: 'out/preload/index.js'
        }
      }
    },
    server: {
      port: 5173 // Aqui você define a porta
    }
  }
})
