from flask import Blueprint

recognition_bp = Blueprint('recognition', __name__)

from . import routes  # Import các route khi khởi tạo
