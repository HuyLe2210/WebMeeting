import cv2
import numpy as np
import pandas as pd
import pickle
import time
from flask import Blueprint, jsonify

import mediapipe as mp

# Blueprint
head_estimation_bp = Blueprint('headPoseEstimation', __name__)

# Load model
model = pickle.load(open('./model.pkl', 'rb'))

# Cấu hình MediaPipe FaceMesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=True,
    max_num_faces=5,
    min_detection_confidence=0.5
)

# Đặc trưng cần dùng
cols = []
for pos in ['nose_', 'forehead_', 'left_eye_', 'mouth_left_', 'chin_', 'right_eye_', 'mouth_right_']:
    for dim in ('x', 'y'):
        cols.append(pos + dim)

# Hàm trích xuất đặc trưng từ ảnh
def extract_features(img, face_mesh):
    NOSE = 1
    FOREHEAD = 10
    LEFT_EYE = 33
    MOUTH_LEFT = 61
    CHIN = 199
    RIGHT_EYE = 263
    MOUTH_RIGHT = 291

    result = face_mesh.process(img)
    num_faces = 0
    face_features = []

    if result.multi_face_landmarks:
        num_faces = len(result.multi_face_landmarks)
        if num_faces == 1:
            for face_landmarks in result.multi_face_landmarks:
                for idx, lm in enumerate(face_landmarks.landmark):
                    if idx in [FOREHEAD, NOSE, MOUTH_LEFT, MOUTH_RIGHT, CHIN, LEFT_EYE, RIGHT_EYE]:
                        face_features.append(lm.x)
                        face_features.append(lm.y)

    return face_features, num_faces

# Chuẩn hóa đặc trưng
def normalize(poses_df):
    normalized_df = poses_df.copy()
    for dim in ['x', 'y']:
        for feature in ['forehead_'+dim, 'nose_'+dim, 'mouth_left_'+dim, 'mouth_right_'+dim,
                        'left_eye_'+dim, 'chin_'+dim, 'right_eye_'+dim]:
            normalized_df[feature] = poses_df[feature] - poses_df['nose_'+dim]

        diff = normalized_df['mouth_right_'+dim] - normalized_df['left_eye_'+dim]
        for feature in ['forehead_'+dim, 'nose_'+dim, 'mouth_left_'+dim, 'mouth_right_'+dim,
                        'left_eye_'+dim, 'chin_'+dim, 'right_eye_'+dim]:
            normalized_df[feature] = normalized_df[feature] / diff
    return normalized_df

# Mở webcam một lần toàn cục
cap = cv2.VideoCapture(0)
not_forward_start_time = None
WARNING_THRESHOLD = 3  # giây

# API trả kết quả head pose
@head_estimation_bp.route('/head_pose_result')
def head_pose_result():
    global not_forward_start_time

    ret, img = cap.read()
    if not ret:
        return jsonify({'error': 'Cannot read from camera'}), 500

    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img_h, img_w, _ = img.shape
    result_text = ''
    warning = False

    face_features, num_faces = extract_features(rgb_img, face_mesh)

    if num_faces == 0:
        result_text = 'No face detected'
        not_forward_start_time = None
    elif num_faces > 1:
        result_text = 'Multiple faces detected'
        not_forward_start_time = None
    elif len(face_features):
        face_features_df = pd.DataFrame([face_features], columns=cols)
        face_features_normalized = normalize(face_features_df)
        pitch_pred, yaw_pred, roll_pred = model.predict(face_features_normalized).ravel()

        # Xác định hướng nhìn
        if pitch_pred > 0.3:
            result_text = 'Top'
            if yaw_pred > 0.3:
                result_text = 'Top Left'
            elif yaw_pred < -0.3:
                result_text = 'Top Right'
        elif pitch_pred < -0.3:
            result_text = 'Bottom'
            if yaw_pred > 0.3:
                result_text = 'Bottom Left'
            elif yaw_pred < -0.3:
                result_text = 'Bottom Right'
        elif yaw_pred > 0.3:
            result_text = 'Left'
        elif yaw_pred < -0.3:
            result_text = 'Right'
        else:
            result_text = 'Forward'

        # Cảnh báo nếu không nhìn thẳng liên tục
        if result_text != 'Forward':
            if not_forward_start_time is None:
                not_forward_start_time = time.time()
            elif time.time() - not_forward_start_time >= WARNING_THRESHOLD:
                warning = True
        else:
            not_forward_start_time = None

    return jsonify({
        'direction': result_text,
        'cheating': warning,
        'num_faces': num_faces
    })