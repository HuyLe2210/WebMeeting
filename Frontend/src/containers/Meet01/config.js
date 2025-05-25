import axios from 'axios';
import { io } from "socket.io-client";

export const socket = io("http://localhost:5001");
const API_BASE_URL = 'http://localhost:5001';

// Gửi ảnh về server
export const uploadImage = async ({ username, image }) => {
  try {
    const response = await axios.post(
      "http://localhost:5001/api/upload-image",
      { username, image },
      {
        headers: {
          "Content-Type": "application/json", // ✅ THÊM DÒNG NÀY
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi upload ảnh:", error);
    throw error;
  }
};
