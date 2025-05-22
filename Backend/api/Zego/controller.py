# api/Zego/controller.py
import time
import hmac
import hashlib
import base64
import json
from flask import request, jsonify

APP_ID = 253308787
SERVER_SECRET = b"490296479352f42ea789f339bbc7c2d5"

def generate_zego_token():
    try:
        data = request.get_json()
        room_id = data.get("roomID")
        user_id = data.get("userID")
        user_name = data.get("userName")

        if not all([room_id, user_id, user_name]):
            return jsonify({"error": "Thiếu tham số roomID, userID hoặc userName"}), 400

        # Giống với generateKitTokenForTest trong HTML:
        kit_token = (
            f"{APP_ID}-{SERVER_SECRET}-{room_id}-{user_id}-{user_name}"
        )

        # Lưu ý: Đây KHÔNG phải cách bảo mật để dùng trong sản phẩm. Dùng cho testing mô phỏng frontend.
        return jsonify({"token": kit_token}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500