from flask import request, jsonify
from . import recognition_bp
import os
import cv2
import pickle
from scipy.spatial.distance import cosine
from insightface.app import FaceAnalysis

UPLOAD_FOLDER = 'images'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Khởi tạo InsightFace
face_app = FaceAnalysis(name='buffalo_l')
face_app.prepare(ctx_id=0)

# Load dữ liệu khuôn mặt đã lưu
with open("dataset/faces.pkl", "rb") as f:
    faces_db = pickle.load(f)
with open("dataset/names.pkl", "rb") as f:
    names_db = pickle.load(f)

def recognize_faces_from_image(image_path):
    frame = cv2.imread(image_path)
    if frame is None:
        return []

    faces = face_app.get(frame)
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

    return results

@recognition_bp.route('/recognize', methods=['POST'])
def recognize():
    results = []

    if 'images' not in request.files:
        return jsonify({'error': 'No images provided'}), 400

    files = request.files.getlist('images')

    for file in files:
        filename = file.filename
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(save_path)

        recognized_names = recognize_faces_from_image(save_path)

        for name in recognized_names:
            results.append({
                'image': filename,
                'name': name
            })

    return jsonify(results)
