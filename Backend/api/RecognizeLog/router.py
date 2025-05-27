# router/recognition_logs.py
from flask import Blueprint
from .controller import get_failed_recognitions

recognition_routes = Blueprint('recognition_routes', __name__)
recognition_routes.route('/recognition-logs/failed', methods=['GET'])(get_failed_recognitions)
