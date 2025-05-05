import axios, { AxiosError } from "axios";

interface APIErrorResponse {
  message: string;
  status: string;
}

/** 處理 cors 的反向代理設定 */
const baseURL = import.meta.env.DEV 
  ? 'http://localhost:3000'  // 開發環境直接使用後端 URL
  : import.meta.env.VITE_API_URL || 'https://kaiso-meow-backend.onrender.com/';

const axiosInstance = axios.create({
  baseURL, // 所有請求都會自動加上這個 baseURL 開頭
  timeout: 20000, // 請求最多等 20 秒
  headers: {
    'Content-Type': 'application/json', // 預設的標頭（所有請求）
  },
});

// ✅ 請求攔截器：自動加入 token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 或從 auth store 拿也可以
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ 回應攔截器：統一錯誤處理
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<APIErrorResponse>) => {
    if (error.response) {
      const { status, data } = error.response;

      // 你可以根據錯誤碼自訂訊息處理邏輯
      switch (status) {
        case 401:
          console.warn('未授權，請重新登入');
          break;
        case 403:
          console.warn('權限不足');
          break;
        case 404:
          console.warn('找不到資源');
          break;
        case 500:
          console.error('伺服器錯誤，請稍後再試');
          break;
        default:
          console.error(data?.message || '發生未知錯誤');
      }
    } else if (error.request) {
      console.error('無回應，可能是網路問題');
    } else {
      console.error('錯誤：', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;