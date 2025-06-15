import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      '@': '/src',  // 確保這裡指向了 src 目錄
    },
  },
  server: {
    port: 5173, //前端啟動的 port (需要有被後端加入白名單)
    strictPort: true, // 如果端口被占用，則不自動切換到其他端口
    proxy: {
      '/api': {
        target: 'http://localhost:3000', //後端啟動的 port
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.API_URL)
  }
})