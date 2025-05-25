import os
import cv2
import pickle
import numpy as np
import time
from insightface.app import FaceAnalysis
from scipy.spatial.distance import cosine

# Khởi tạo ứng dụng ArcFace
app = FaceAnalysis(name='buffalo_l')
app.prepare(ctx_id=0, det_size=(640, 640))  # GPU nếu có

# Đường dẫn lưu dữ liệu
DATASET_PATH = 'dataset/'
FACES_FILE = os.path.join(DATASET_PATH, 'faces.pkl')
NAMES_FILE = os.path.join(DATASET_PATH, 'names.pkl')
os.makedirs(DATASET_PATH, exist_ok=True)

# Lấy tên người dùng
name = input('Enter your name --> ')

# Tải dữ liệu hiện có nếu có
if os.path.exists(FACES_FILE) and os.path.exists(NAMES_FILE):
    with open(FACES_FILE, 'rb') as f:
        faces_db = pickle.load(f)
    with open(NAMES_FILE, 'rb') as f:
        names_db = pickle.load(f)
else:
    faces_db = np.empty((0, 512), dtype=np.float32)
    names_db = []

# Mở camera
camera = cv2.VideoCapture(0)
face_data = []
collected = 0
duplicate_found = False
similarity_threshold = 0.5  # Ngưỡng xác định giống khuôn mặt

print("Đưa mặt vào camera. Thu thập 10 ảnh (mỗi 2 giây)...")

last_capture_time = 0  # Thời gian lần cuối thu thập

while collected < 10:
    ret, frame = camera.read()
    if not ret:
        print('Lỗi: Không thể lấy khung hình!')
        break

    current_time = time.time()
    faces = app.get(frame)
    
    if len(faces) == 0:
        cv2.putText(frame, "No face found!", (20, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
    elif len(faces) > 1:
        cv2.putText(frame, "More than one face", (20, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
    else:
        face = faces[0]
        embedding = face.embedding

        # Kiểm tra trùng khuôn mặt
        if len(faces_db) > 0:
            distances = [cosine(embedding, existing) for existing in faces_db]
            if min(distances) < similarity_threshold:
                duplicate_found = True
                cv2.putText(frame, "Existed!", (20, 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)

        # Chỉ thu thập nếu đủ 2 giây kể từ lần trước
        if not duplicate_found and (current_time - last_capture_time >= 2.0):
            face_data.append(embedding)
            collected += 1
            last_capture_time = current_time
            cv2.putText(frame, f"Đã chụp: {collected}/10", (20, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

        # Vẽ khung
        bbox = list(map(int, face.bbox))
        cv2.rectangle(frame, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (255, 0, 0), 2)

    cv2.imshow('Capturing Faces', frame)
    if cv2.waitKey(1) == 27:  # ESC để thoát
        break

camera.release()
cv2.destroyAllWindows()

# Lưu dữ liệu nếu hợp lệ
if duplicate_found:
    print("❌ Khuôn mặt đã tồn tại. Không lưu dữ liệu.")
elif collected < 10:
    print("❌ Không đủ dữ liệu khuôn mặt. Đăng ký thất bại.")
else:
    face_data = np.array(face_data)
    faces_db = np.vstack([faces_db, face_data])
    names_db.extend([name] * 10)

    with open(FACES_FILE, 'wb') as f:
        pickle.dump(faces_db, f)
    with open(NAMES_FILE, 'wb') as f:
        pickle.dump(names_db, f)
    print("✅ Đăng ký khuôn mặt thành công!")
