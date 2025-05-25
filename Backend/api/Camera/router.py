from flask import Blueprint
from .controller import start_camera_controller, stop_camera_controller

camera_routes = Blueprint('camera_routes', __name__)


camera_routes.route("/api/start-backend-camera", methods=["POST"])(start_camera_controller)
camera_routes.route("/api/stop-backend-camera", methods=["POST"])(stop_camera_controller)
