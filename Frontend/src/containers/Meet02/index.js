import React, { useEffect, useRef, useState } from "react";
import { socket, getUsers } from "./config";
import { Box, Card, CardContent, Typography } from "@mui/material";

export default function MeetingPage() {
  const username = "admin";
  const [userList, setUserList] = useState([]);
  const videoRefs = useRef({});
  const pcRefs = useRef({});
  const localStreamRef = useRef(null);
  const pendingCandidates = useRef({});

  useEffect(() => {
    getUsers().then(users => {
      const refs = {};
      users.forEach(user => {
        refs[user.name] = React.createRef();
      });
      videoRefs.current = refs;
      setUserList(users);
      users.forEach(user => {
        socket.emit("join", { username, room: `room_${user.name}` });
      });
    });
  }, []);

  useEffect(() => {
    socket.on("offer", async (data) => {
      const user = data.sender;
      const room = data.room;

      console.log("📨 [ADMIN] nhận offer từ", user, "trong room", room);

      if (!pcRefs.current[user]) {
        await createPeerConnection(user);
      }

      const pc = pcRefs.current[user];

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));

        // Xử lý các ICE pending
        if (pendingCandidates.current[user]) {
          for (const candidate of pendingCandidates.current[user]) {
            await pc.addIceCandidate(candidate);
          }
          delete pendingCandidates.current[user]; // clear queue
        }
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { target: user, answer, room });
        console.log("✅ [ADMIN] Đã gửi answer cho", user);
      } catch (err) {
        console.error("❌ [ADMIN] Lỗi khi setRemoteDescription:", err);
      }
    });

    socket.on("candidate", (data) => {
      const user = data.target === "admin" ? data.sender : data.target;
      const candidate = new RTCIceCandidate(data.candidate);
      const pc = pcRefs.current[user];

      if (pc) {
        if (pc.remoteDescription?.type) {
          pc.addIceCandidate(candidate);
        } else {
          console.warn("🕒 ADMIN lưu tạm ICE vì chưa có remoteDescription", user);
          if (!pendingCandidates.current[user]) {
            pendingCandidates.current[user] = [];
          }
          pendingCandidates.current[user].push(candidate);
        }
      } else {
        console.warn("❗ ADMIN chưa có pc cho", user);
      }

      if (pc && pc.remoteDescription?.type) {
        pc.addIceCandidate(candidate);
      } else {
        console.warn("❗ ADMIN bỏ qua ICE vì chưa có remoteDescription", user);
      }
    });

    return () => {
      socket.off("offer");
      socket.off("candidate");
    };
  }, []);

  const createPeerConnection = async (user) => {
    const pc = new RTCPeerConnection();
    pcRefs.current[user] = pc;

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("candidate", {
          target: user,
          candidate: e.candidate,
          room: `room_${user}`
        });
      }
    };

    pc.ontrack = (e) => {
      console.log("✅ ADMIN nhận stream từ", user);
      const videoElement = videoRefs.current[user]?.current;
      if (videoElement) {
        videoElement.srcObject = e.streams[0];
        console.log("📺 Gán stream vào video của", user);
      } else {
        console.warn("❗ Không tìm thấy videoRef cho", user);
      }
    };

    if (!localStreamRef.current) {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log("🎥 Admin stream ready");
    }

    localStreamRef.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current);
    });
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, padding: 2 }}>
      {userList.map(user => (
        <Card key={user.name} sx={{ width: 300 }}>
          <CardContent>
            <video
              ref={videoRefs.current[user.name]}
              autoPlay
              playsInline
              style={{ width: "100%", borderRadius: 4, border: "1px solid #ccc" }}
            />
            <Typography variant="subtitle1" align="center">
              {user.name}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
