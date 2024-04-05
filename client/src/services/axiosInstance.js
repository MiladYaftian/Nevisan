import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("readifyUserKey");
    console.log("Token from local storage:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Request config with token:", config);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
