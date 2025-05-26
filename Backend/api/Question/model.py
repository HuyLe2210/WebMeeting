# api/Question/model.py
from config.config import db
from datetime import datetime

class Question(db.Model):
    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    optionA = db.Column(db.String(255), nullable=False)
    optionB = db.Column(db.String(255), nullable=False)
    optionC = db.Column(db.String(255), nullable=False)
    optionD = db.Column(db.String(255), nullable=False)
    correctAnswer = db.Column(db.String(1), nullable=False)  # A, B, C hoặc D

    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Question {self.id}: {self.content}>"
