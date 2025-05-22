from flask import request, jsonify
from werkzeug.security import generate_password_hash
from config.config import db
from api.User.model import User

def register_user():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Không có dữ liệu"}), 400

    userName = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")
    image = data.get("image")
    gender = data.get("gender")
    address = data.get("address")

    if not all([userName, email, phone, password, gender]):
        return jsonify({"error": "Thiếu thông tin"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email đã tồn tại"}), 400
    if User.query.filter_by(phone=phone).first():
        return jsonify({"error": "Số điện thoại đã tồn tại"}), 400

    hashed_password = generate_password_hash(password)
    user = User(userName=userName, email=email, phone=phone, password=hashed_password, image=image, address=address, gender=gender)

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Đăng ký thành công",
        "user": {
            "id": user.id,
            "userName": user.userName,
            "email": user.email,
            "image": user.image,
            "gender": user.gender,
            "address": user.address
        }
    }), 201
