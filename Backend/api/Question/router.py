# api/Question/routes.py
from flask import Blueprint
from api.Question.controller import get_all_questions

question_routes = Blueprint("question_routes", __name__)

question_routes.route("/questions", methods=["GET"])(get_all_questions)
