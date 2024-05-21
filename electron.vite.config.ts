import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  
  main: {
    resolve: {
      alias: {
        '@/lib': resolve('src/main/lib'),
        '@shared': resolve('src/shared')
      }
    },
    define: {
      'process.env': {}
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    define: {
      'process.env': {}
    },
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
        '@/util': resolve('src/shared'),
      }
    },
    define: {
      'process.env': {}
    },
    plugins: [react()]
  },
  
})
