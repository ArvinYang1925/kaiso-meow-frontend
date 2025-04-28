import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
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
  /** 處理 cors 的反向代理設定 */
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://express-ts-todolist.onrender.com/', // 替換成你的 API URL
  //       changeOrigin: true,  // 用來改變原始的請求頭部
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
})

