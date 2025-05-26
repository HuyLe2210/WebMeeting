from flask import request, jsonify
from . import recognition_bp
import os
import cv2
import pickle
from scipy.spatial.distance import cosine
from insightface.app import FaceAnalysis
import sqlite3
from datetime import datetime


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

def save_recognition_log(student_name, result):
    conn = sqlite3.connect('examapp.db')  # Đường dẫn đến CSDL
    c = conn.cursor()
    c.execute('''
        INSERT INTO recognition_logs (student_name, result, timestamp)
        VALUES (?, ?, ?)
    ''', (student_name, result, datetime.now()))
    conn.commit()
    conn.close()



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
    if 'images' not in request.files or 'student_name' not in request.form:
        return jsonify({'error': 'Missing image or student_name'}), 400

    student_name = request.form['student_name']
    files = request.files.getlist('images')

    for file in files:
        filename = file.filename
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(save_path)

        recognized_names = recognize_faces_from_image(save_path)
        recognized_name = recognized_names[0] if recognized_names else "Unknown"

        result_status = "pass" if recognized_name == student_name else "false"
        save_recognition_log(student_name, result_status)

        return jsonify({
            'student_name': student_name,
            'result': result_status
        })

    return jsonify({'error': 'No valid image'}), 400


