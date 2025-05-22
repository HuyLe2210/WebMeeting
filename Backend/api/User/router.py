from flask import Blueprint
from api.User.controller import register_user

user_routes = Blueprint('user_routes', __name__)

user_routes.route('/users', methods=['POST'])(register_user)
