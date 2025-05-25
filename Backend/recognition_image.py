import cv2
import pickle
from scipy.spatial.distance import cosine
from insightface.app import FaceAnalysis

# Khởi tạo mô hình nhận diện khuôn mặt
app = FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=0, det_size=(640, 640))  # nếu không có GPU thì dùng ctx_id=-1

# Load dữ liệu khuôn mặt đã lưu
with open("dataset1/faces.pkl", "rb") as f:
    faces_db = pickle.load(f)
with open("dataset1/names.pkl", "rb") as f:
    names_db = pickle.load(f)

def recognize_faces(image_path):
    frame = cv2.imread(image_path)
    if frame is None:
        raise ValueError(f"Không thể đọc ảnh: {image_path}")
    
    faces = app.get(frame)
    results = []

    for face in faces:
        embedding = face.embedding
        min_dist = float('inf')
        best_match = "Unknown"

        for idx, stored_embedding in enumerate(faces_db):
            dist = cosine(embedding, stored_embedding)
            if dist < min_dist:
                min_dist = dist
                best_match = names_db[idx]
        
        if min_dist > 0.5:
            best_match = "Unknown"
        
        results.append(best_match)

    return results  # trả về danh sách tên (có thể có nhiều khuôn mặt)

# ==== Ví dụ sử dụng ====
image_path = "Huy.jpg"
recognized_names = recognize_faces(image_path)

# Ghi log hoặc lưu CSDL
for name in recognized_names:
    print(f"Kết quả nhận diện: {name}")
