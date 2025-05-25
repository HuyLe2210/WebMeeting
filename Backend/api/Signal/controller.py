from flask_socketio import emit, join_room

def init_socket_events(socketio):
    @socketio.on("join")
    def handle_join(data):
        username = data.get("username")
        room = data.get("room")
        join_room(room)
        print(f"✅ {username} joined {room}")

    @socketio.on("offer")
    def handle_offer(data):
        print("📨 Server nhận offer:", data.get("sender"), "→ room:", data.get("room"))
        emit("offer", data, to=data["room"], skip_sid=True)

    @socketio.on("answer")
    def handle_answer(data):
        emit("answer", data, to=data["room"], skip_sid=True)

    @socketio.on("candidate")
    def handle_candidate(data):
        emit("candidate", data, to=data["room"], skip_sid=True)
