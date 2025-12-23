import axios from "axios";

const instance = axios.create({
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Global error handling if needed, but removed TOKEN001 redirect
    return Promise.reject(error);
  }
);

export default instance;
