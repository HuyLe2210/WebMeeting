# api/ExamAnswer/controller.py
from flask import request, jsonify
from config.config import db
from .model import ExamAnswer

# Create
def create_exam_answer():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        answer = ExamAnswer(
            userName=data.get("userName"),
            userId=data.get("userId"),
            q1=data.get("q1"), q2=data.get("q2"), q3=data.get("q3"), q4=data.get("q4"), q5=data.get("q5"),
            q6=data.get("q6"), q7=data.get("q7"), q8=data.get("q8"), q9=data.get("q9"), q10=data.get("q10")
        )
        db.session.add(answer)
        db.session.commit()
        return jsonify({"message": "Created successfully", "id": answer.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Read all
def get_all_exam_answers():
    answers = ExamAnswer.query.all()
    result = []
    for a in answers:
        result.append({
            "id": a.id,
            "userName": a.userName,
            "userId": a.userId,
            "answers": [a.q1, a.q2, a.q3, a.q4, a.q5, a.q6, a.q7, a.q8, a.q9, a.q10],
            "createdAt": a.createdAt,
        })
    return jsonify(result), 200

# Read one
def get_exam_answer_by_id(id):
    a = ExamAnswer.query.get(id)
    if not a:
        return jsonify({"error": "Not found"}), 404
    return jsonify({
        "id": a.id,
        "userName": a.userName,
        "userId": a.userId,
        "answers": [a.q1, a.q2, a.q3, a.q4, a.q5, a.q6, a.q7, a.q8, a.q9, a.q10],
        "createdAt": a.createdAt,
    }), 200

# Update
def update_exam_answer(id):
    data = request.get_json()
    a = ExamAnswer.query.get(id)
    if not a:
        return jsonify({"error": "Not found"}), 404

    try:
        a.userName = data.get("userName", a.userName)
        a.userId = data.get("userId", a.userId)
        for i in range(1, 11):
            setattr(a, f'q{i}', data.get(f'q{i}', getattr(a, f'q{i}')))
        db.session.commit()
        return jsonify({"message": "Updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete
def delete_exam_answer(id):
    a = ExamAnswer.query.get(id)
    if not a:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(a)
    db.session.commit()
    return jsonify({"message": "Deleted successfully"}), 200
