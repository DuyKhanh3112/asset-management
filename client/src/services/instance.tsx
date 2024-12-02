import axios from "axios";

// Tạo một instance của axios với cấu hình cơ bản
const instance = axios.create({
  // Địa chỉ cơ sở cho tất cả các yêu cầu API, lấy từ biến môi trường
  baseURL: process.env.REACT_APP_SERVER_URI,
  // Cho phép gửi cookie cùng với các yêu cầu, cần thiết cho các API yêu cầu xác thực
  withCredentials: true,
});

// Thiết lập một interceptor để xử lý phản hồi từ server
instance.interceptors.response.use(
  (response) => response, // Trả về phản hồi trực tiếp nếu yêu cầu thành công
  (error) => {
    // Kiểm tra nếu trạng thái lỗi là 401 Unauthorized
    if (error.response?.status === 401) {
      // Xóa vsc_u trong localstore nhận được 401 Unauthorized
      localStorage.removeItem('asset_u')
      window.location.href = '/login'
    }

    return Promise.reject(error); // Trả về lỗi nếu có
  }
);

export default instance;