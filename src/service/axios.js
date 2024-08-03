import axios from "axios"
import { userStore } from "@/stores/userStore";
const VUE_BASE_URL = import.meta.env.VITE_APP_BASE_URL
const VUE_BASE_URL_PROD  = import.meta.env.VITE_APP_BASE_URL_PROD
const api = axios.create({
  baseURL: import.meta.env.NODE_ENV ?  VUE_BASE_URL_PROD : VUE_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const store = userStore();
    if (store.isLogin) {
      config.headers = {
        ...config.headers, // Preserve existing headers
        'Authorization': `Bearer ${store.token}`,
      };
    }
    return config;
  },
      (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!error.response) {
      console.log("Please check your internet connection.");
    }
    throw error;
  }
)

export default api;