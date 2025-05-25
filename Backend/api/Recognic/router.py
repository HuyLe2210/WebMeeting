from flask import Blueprint
from .controller import upload_image_controller

recognic_routes = Blueprint('recognic_routes', __name__)

recognic_routes.route("/api/upload-image", methods=["POST"])(upload_image_controller)
