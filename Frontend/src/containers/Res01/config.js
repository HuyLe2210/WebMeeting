import axios from 'axios';

// URL backend Flask đang chạy
export const API_BASE_URL = 'http://localhost:5001';

// Lấy danh sách người dùng
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi gọi API /users:', error);
    throw error;
  }
};

// Đăng ký người dùng mới
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đăng ký người dùng:', error);
    throw error;
  }
};

// Đăng ký người dùng mới
export const registerFace = async (imageBase64, name) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/register`, {
      image: imageBase64,
      name: name
    });
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi khi gọi registerFace:", err.response?.data || err.message);
    return { error: true, message: err.response?.data?.error || "Lỗi không xác định" };
  }
};
