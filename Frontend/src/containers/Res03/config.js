import axios from 'axios';

export const API_BASE_URL = 'http://localhost:5001';


// ✅ Bật camera backend
export const startBackendCamera = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/start-backend-camera`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi bật camera backend:', error);
    throw error;
  }
};

// ✅ Tắt camera backend
export const stopBackendCamera = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/stop-backend-camera`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tắt camera backend:', error);
    throw error;
  }
};
