import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://express-ts-todolist.onrender.com/api/', // 所有請求都會自動加上這個 baseURL 開頭
    timeout: 20000, // 請求最多等 20 秒
    headers: {
      'Content-Type': 'application/json', // 預設的標頭（所有請求）
    },
  });

  export default axiosInstance;