# api/Question/controller.py
from flask import jsonify
from api.Question.model import Question

def get_all_questions():
    questions = Question.query.all()
    result = []
    for q in questions:
        result.append({
            "id": q.id,
            "content": q.content,
            "options": {
                "A": q.optionA,
                "B": q.optionB,
                "C": q.optionC,
                "D": q.optionD
            },
            "correctAnswer": q.correctAnswer  # Có thể ẩn nếu chỉ cho học sinh thi
        })
    return jsonify(result), 200
