// meeting/config.js
import axios from "axios";

const BACKEND_URL = "http://localhost:5001";

export const getZegoToken = async (roomID, userID, userName) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/api/generate_zego_token`, {
      roomID,
      userID,
      userName,
    });
    return res.data.token;
  } catch (error) {
    console.error("❌ Lỗi khi gọi API token:", error);
    return null;
  }
};
