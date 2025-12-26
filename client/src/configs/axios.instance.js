import axios from "axios";

const instance = axios.create({
  withCredentials: true,
});

// ============================================
// CSRF TOKEN INTERCEPTOR
// ============================================
// Tự động thêm CSRF token vào mọi POST/PUT/PATCH/DELETE request
instance.interceptors.request.use(
  async (config) => {
    // Chỉ thêm CSRF token cho state-changing methods
    const methodsNeedCsrf = ['post', 'put', 'patch', 'delete'];
    if (methodsNeedCsrf.includes(config.method?.toLowerCase())) {
      // Lấy token từ sessionStorage
      let csrfToken = sessionStorage.getItem('csrf-token');
      
      // Nếu chưa có token, fetch từ server
      if (!csrfToken) {
        try {
          // Lấy base URL từ config hoặc từ request URL
          const baseURL = config.baseURL || new URL(config.url, window.location.origin).origin;
          
          const { data } = await axios.get(
            `${baseURL}/api/pub/csrf-token`,
            { withCredentials: true }
          );
          csrfToken = data.csrfToken;
          sessionStorage.setItem('csrf-token', csrfToken);
        } catch (error) {
          console.error('Failed to fetch CSRF token:', error);
          // Nếu không lấy được token, vẫn cho request đi (sẽ bị reject ở server)
        }
      }
      
      // Thêm token vào header
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Nếu bị reject vì CSRF token invalid, xóa token và retry
    if (
      error.response?.status === 400 &&
      error.response?.data?.errors?.[0]?.code === 'CSRF_INVALID'
    ) {
      // Xóa token cũ
      sessionStorage.removeItem('csrf-token');
      
      // Retry request (sẽ fetch token mới ở request interceptor)
      const originalRequest = error.config;
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        return instance(originalRequest);
      }
    }
    
    // Global error handling if needed
    return Promise.reject(error);
  }
);

export default instance;
