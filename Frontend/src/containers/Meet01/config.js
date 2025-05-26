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

// Gửi bài làm gồm 10 câu trả lời
export const createExamAnswer = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/exam-answers`, payload, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi gửi bài thi:", error);
    throw error;
  }
};

// Lấy toàn bộ danh sách câu hỏi từ server
export const getAllQuestions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/questions`);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách câu hỏi:", error);
    throw error;
  }
};
