# api/ExamAnswer/routes.py
from flask import Blueprint
from .controller import (
    create_exam_answer,
    get_all_exam_answers,
    get_exam_answer_by_id,
    update_exam_answer,
    delete_exam_answer
)

exam_answer_routes = Blueprint("exam_answer_routes", __name__)

exam_answer_routes.route("/exam-answers", methods=["POST"])(create_exam_answer)
exam_answer_routes.route("/exam-answers", methods=["GET"])(get_all_exam_answers)
exam_answer_routes.route("/exam-answers/<int:id>", methods=["GET"])(get_exam_answer_by_id)
exam_answer_routes.route("/exam-answers/<int:id>", methods=["PUT"])(update_exam_answer)
exam_answer_routes.route("/exam-answers/<int:id>", methods=["DELETE"])(delete_exam_answer)
