import axios from "axios";

import { getStoredToken } from "../lib/storage";
import useAuthStore from "../store/authStore";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ??
    "http://localhost:5000/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
