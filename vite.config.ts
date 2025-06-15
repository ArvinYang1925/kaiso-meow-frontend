import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 載入環境變數
  const env = loadEnv(mode, process.cwd(), '')
  console.log('Current mode:', mode)
  console.log('API URL:', env.VITE_API_BASE_URL)

  return {
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
          target: env.VITE_API_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
          ws: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to:', req.method, req.url, 'Target:', env.VITE_API_BASE_URL || 'http://localhost:3000');
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response:', proxyRes.statusCode, req.url);
            });
          },
        }
      }
    },
    define: {
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_BASE_URL)
    }
  }
})

