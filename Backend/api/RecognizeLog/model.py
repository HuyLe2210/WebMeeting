# models/recognition_logs.py
from config.config import db
from datetime import datetime

class RecognitionLog(db.Model):
    __tablename__ = "recognition_logs"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_name = db.Column(db.String(255), nullable=False)
    image_name = db.Column(db.String(255), nullable=False)
    recognized_name = db.Column(db.String(255), nullable=False)
    result = db.Column(db.Enum('pass', 'false'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<RecognitionLog {self.student_name} - {self.result}>"
