from flask_socketio import emit, SocketIO
import cv2
import threading
from flask import jsonify

is_recording = False

def start_opencv_camera():
    global is_recording
    cap = cv2.VideoCapture(0)
    print("📷 Đang mở camera...")

    while is_recording and cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        cv2.imshow("🎥 Backend Camera", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()
    is_recording = False


def start_camera_controller():
    global is_recording
    if not is_recording:
        is_recording = True
        threading.Thread(target=start_opencv_camera).start()
        return jsonify({"status": "Started backend camera"}), 200
    else:
        return jsonify({"status": "Already running"}), 400

def stop_camera_controller():
    global is_recording
    is_recording = False
    return jsonify({"status": "Stopping camera"}), 200
