import React, { useEffect, useRef, useState } from "react";
import { socket, uploadImage  } from "./config";
import { useSearchParams } from "react-router-dom";

export default function UserPage() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("name") || "guest";
  const localVideoRef = useRef(null);
  const pcRef = useRef(null);
  const [hasCalled, setHasCalled] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const room = `room_${username}`;
    if (socket && socket.connected) {
      socket.emit("join", { username, room });
    } else {
      socket.on("connect", () => {
        socket.emit("join", { username, room });
      });
    }

    socket.on("answer", async (data) => {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    socket.on("candidate", (data) => {
      const candidate = new RTCIceCandidate(data.candidate);
      const pc = pcRef.current;
      if (pc?.remoteDescription?.type) {
        pc.addIceCandidate(candidate);
      }
    });

    return () => {
      socket.off("answer");
      socket.off("candidate");
      socket.off("connect");
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const createPeerConnection = async () => {
    pcRef.current = new RTCPeerConnection();

    pcRef.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("candidate", {
          target: "admin",
          candidate: e.candidate,
          room: `room_${username}`
        });
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    stream.getTracks().forEach((track) => pcRef.current.addTrack(track, stream));
    localVideoRef.current.srcObject = stream;

    // Thêm dòng sau:
    intervalRef.current = setInterval(() => {
      captureAndSendFrame();
    }, 10000);
  };

  const captureAndSendFrame = async () => {
    const video = localVideoRef.current;
    if (!video) return;
  
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg");
  
    try {
      await uploadImage({ username, image: imageData }); // ✅ dùng hàm đã chuẩn hóa
    } catch (error) {
      console.error("❌ Lỗi gửi ảnh về server:", error);
    }
  };
  

  const startCall = async () => {
    await createPeerConnection();
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    socket.emit("offer", { target: "admin", offer, sender: username, room: `room_${username}` });
    setHasCalled(true);
  };

  return (
    <div>
      <h2>User: {username}</h2>
      <video ref={localVideoRef} autoPlay muted style={{ width: "300px", border: "1px solid black" }} />
      {!hasCalled && (
        <button onClick={startCall}>Bắt đầu gọi</button>
      )}
    </div>
  );
}
