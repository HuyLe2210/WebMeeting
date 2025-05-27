import { io } from "socket.io-client";
import axios from 'axios';

export const socket = io("http://localhost:5001");

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

// Hàm gọi API lấy danh sách người dùng
export const getRecognizeLogFalse = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recognition-logs/failed`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi gọi API /users:', error);
    throw error;
  }
};

