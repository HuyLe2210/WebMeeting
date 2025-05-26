from flask import Flask, jsonify
from config.config import Config, db
from api.User.model import User
from flask_cors import CORS 
from api.User.router import user_routes
from api.Zego.router import zego_routes
from api.Recognic.router import recognic_routes
from flask_socketio import SocketIO
from api.Signal.controller import init_socket_events
from recognition import recognition_bp

app = Flask(__name__)
app.config.from_object(Config)
socketio = SocketIO(app, cors_allowed_origins="*")

# Khởi tạo SQLAlchemy
db.init_app(app)
CORS(app, origins=["http://localhost:4001"])


@app.route('/')
def home():
    return {"message": "Welcome to ExamApp Backend!"}

@app.route('/users')
def get_users():
    users = User.query.all()
    return jsonify([
        {"id": user.id, "name": user.userName, "email": user.email}
        for user in users
    ])
app.register_blueprint(user_routes)
app.register_blueprint(zego_routes)
app.register_blueprint(recognition_bp)
app.register_blueprint(recognic_routes)

init_socket_events(socketio)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    socketio.run(app, host="0.0.0.0", port=5001)