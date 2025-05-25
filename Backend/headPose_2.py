import mediapipe as mp
import cv2
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import pickle
import time

# Load model
model = pickle.load(open('./model.pkl', 'rb'))

# Danh sách các cột đặc trưng
cols = []
for pos in ['nose_', 'forehead_', 'left_eye_', 'mouth_left_', 'chin_', 'right_eye_', 'mouth_right_']:
    for dim in ('x', 'y'):
        cols.append(pos + dim)

# Hàm chuẩn hóa đặc trưng
def normalize(poses_df):
    normalized_df = poses_df.copy()
    
    for dim in ['x', 'y']:
        for feature in ['forehead_' + dim, 'nose_' + dim, 'mouth_left_' + dim, 'mouth_right_' + dim,
                        'left_eye_' + dim, 'chin_' + dim, 'right_eye_' + dim]:
            normalized_df[feature] = poses_df[feature] - poses_df['nose_' + dim]
        
        diff = normalized_df['mouth_right_' + dim] - normalized_df['left_eye_' + dim]
        for feature in ['forehead_' + dim, 'nose_' + dim, 'mouth_left_' + dim, 'mouth_right_' + dim,
                        'left_eye_' + dim, 'chin_' + dim, 'right_eye_' + dim]:
            normalized_df[feature] = normalized_df[feature] / diff
    
    return normalized_df

# Hàm vẽ trục đầu (head pose axes)
def draw_axes(img, pitch, yaw, roll, tx, ty, size=50):
    yaw = -yaw
    rotation_matrix = cv2.Rodrigues(np.array([pitch, yaw, roll]))[0].astype(np.float64)
    axes_points = np.array([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0]
    ], dtype=np.float64)
    axes_points = rotation_matrix @ axes_points
    axes_points = (axes_points[:2, :] * size).astype(int)
    axes_points[0, :] = axes_points[0, :] + int(tx)
    axes_points[1, :] = axes_points[1, :] + int(ty)

    new_img = img.copy()
    cv2.line(new_img, tuple(axes_points[:, 3].ravel()), tuple(axes_points[:, 0].ravel()), (255, 0, 0), 3)    
    cv2.line(new_img, tuple(axes_points[:, 3].ravel()), tuple(axes_points[:, 1].ravel()), (0, 255, 0), 3)    
    cv2.line(new_img, tuple(axes_points[:, 3].ravel()), tuple(axes_points[:, 2].ravel()), (0, 0, 255), 3)
    return new_img

# Khởi tạo Mediapipe và camera
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5)

cap = cv2.VideoCapture(0)
not_forward_start_time = None
WARNING_THRESHOLD = 10  # seconds

while cap.isOpened():
    ret, img = cap.read()
    if not ret:
        break

    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.flip(img, 1)
    img_h, img_w, _ = img.shape
    text = ''

    result = face_mesh.process(img)
    face_features_list = []

    if result.multi_face_landmarks is None:
        cv2.putText(img, 'No face detected', (25, 75), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
    else:
        if len(result.multi_face_landmarks) > 1:
            cv2.putText(img, 'Multiple faces detected', (25, 75), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        else:
            for face_landmarks in result.multi_face_landmarks:
                face_features = []
                for idx, lm in enumerate(face_landmarks.landmark):
                    if idx in [1, 10, 33, 61, 199, 263, 291]:
                        face_features.append(lm.x)
                        face_features.append(lm.y)
                face_features_list = face_features

    if face_features_list:
        face_features_df = pd.DataFrame([face_features_list], columns=cols)
        face_features_normalized = normalize(face_features_df)
        pitch_pred, yaw_pred, roll_pred = model.predict(face_features_normalized).ravel()

        nose_x = face_features_df['nose_x'].values[0] * img_w
        nose_y = face_features_df['nose_y'].values[0] * img_h

        img = draw_axes(img, pitch_pred, yaw_pred, roll_pred, nose_x, nose_y)

        # Xác định hướng nhìn
        if pitch_pred > 0.3:
            text = 'Top'
            if yaw_pred > 0.3:
                text = 'Top Left'
            elif yaw_pred < -0.3:
                text = 'Top Right'
        elif pitch_pred < -0.3:
            text = 'Bottom'
            if yaw_pred > 0.3:
                text = 'Bottom Left'
            elif yaw_pred < -0.3:
                text = 'Bottom Right'
        elif yaw_pred > 0.3:
            text = 'Left'
        elif yaw_pred < -0.3:
            text = 'Right'
        else:
            text = 'Forward'

        # Cảnh báo nếu không nhìn thẳng quá 10 giây
        if text != 'Forward':
            if not_forward_start_time is None:
                not_forward_start_time = time.time()
            elif time.time() - not_forward_start_time >= WARNING_THRESHOLD:
                cv2.putText(img, 'Possible Cheating', (25, 120), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        else:
            not_forward_start_time = None

        # Vẽ hướng nhìn
        cv2.putText(img, text, (25, 75), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    cv2.imshow('Head Pose Estimation', img)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
