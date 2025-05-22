import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

// Hàm gọi API lấy danh sách người dùng
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi gọi API /users:', error);
    throw error;
  }
};
