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
    plugins: [externalizeDepsPlugin()]
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
    build: {
      outDir: 'out/renderer'
    },
    server: {
      port: 5173 // Aqui você define a porta
    },
    plugins: [react()],
  }
})
