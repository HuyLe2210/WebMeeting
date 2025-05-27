# controller/recognition_logs.py (bổ sung)
from flask import jsonify
from .model import RecognitionLog
from config.config import db

def get_failed_recognitions():
    logs = RecognitionLog.query.filter_by(result='false').order_by(RecognitionLog.timestamp.desc()).all()

    result = [
        {
            "id": log.id,
            "student_name": log.student_name,
            "image_name": log.image_name,
            "recognized_name": log.recognized_name,
            "result": log.result,
            "timestamp": log.timestamp.isoformat()
        }
        for log in logs
    ]

    return jsonify(result), 200
