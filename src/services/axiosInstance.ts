import axios from 'axios';

/** 處理 cors 的反向代理設定 */
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL, // 所有請求都會自動加上這個 baseURL 開頭
  timeout: 20000, // 請求最多等 20 秒
  // 移除預設的 Content-Type，讓 axios 自動處理如 FormData 的類型
  // headers: {
  //   'Content-Type': 'application/json',
  // },
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

// ✅ 回應攔截器：處理 token 過期
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 清除本地儲存的資料
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      
      // 重新導向到登入頁面
      // window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;