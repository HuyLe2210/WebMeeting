from flask import request, jsonify
import base64, os
from datetime import datetime

def upload_image_controller():
    try:
        data = request.get_json()
        username = data.get('username', 'unknown')
        image_data = data.get('image')

        if not image_data or "," not in image_data:
            return jsonify({"error": "Invalid image format"}), 400

        print(f"📷 Nhận ảnh từ {username}")
        header, encoded = image_data.split(",", 1)
        image_bytes = base64.b64decode(encoded)

        folder = "images"
        os.makedirs(folder, exist_ok=True)
        filename = f"{username}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        filepath = os.path.join(folder, filename)

        with open(filepath, "wb") as f:
            f.write(image_bytes)

        return jsonify({"message": "Image saved", "filename": filename}), 200

    except Exception as e:
        print("❌ Lỗi xử lý ảnh:", str(e))
        return jsonify({"error": "Failed to process image"}), 500
