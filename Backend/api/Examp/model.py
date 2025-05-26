# api/ExamAnswer/model.py
from config.config import db
from datetime import datetime

class ExamAnswer(db.Model):
    __tablename__ = "exam_answers"

    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(100), nullable=False)
    userId = db.Column(db.Integer, nullable=False)

    # 10 câu hỏi với đáp án kiểu String (A/B/C/D)
    q1 = db.Column(db.String(1), nullable=False)
    q2 = db.Column(db.String(1), nullable=False)
    q3 = db.Column(db.String(1), nullable=False)
    q4 = db.Column(db.String(1), nullable=False)
    q5 = db.Column(db.String(1), nullable=False)
    q6 = db.Column(db.String(1), nullable=False)
    q7 = db.Column(db.String(1), nullable=False)
    q8 = db.Column(db.String(1), nullable=False)
    q9 = db.Column(db.String(1), nullable=False)
    q10 = db.Column(db.String(1), nullable=False)

    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<ExamAnswer {self.userName} - {self.userId}>"
