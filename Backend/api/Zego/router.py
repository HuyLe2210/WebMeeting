from flask import Blueprint
from .controller import generate_zego_token

zego_routes = Blueprint('zego_routes', __name__)

zego_routes.route('/api/generate_zego_token', methods=['POST'])(generate_zego_token)
