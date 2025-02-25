import axios from 'axios'

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Địa chỉ API public
  timeout: 10000, // Thời gian chờ (ms)
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

// Thêm interceptor nếu cần (tùy chọn)
axiosPublic.interceptors.response.use(
  (response) => response.data, // Xử lý khi thành công
  (error) => {
    console.error('Public API error:', error)
    return Promise.reject(error) // Trả về lỗi
    if (error.response) {
      // Lỗi từ server, có mã status
      console.error(`API error: ${error.response.status}`, error.response.data);
    } else if (error.request) {
      // Lỗi do không nhận được phản hồi
      console.error("No response received:", error.request);
    } else {
      // Lỗi trong quá trình cấu hình request
      console.error("Error in request setup:", error.message);
    }
    return Promise.reject(error); // Trả về lỗi
  }
)



export default axiosPublic