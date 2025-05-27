import React, { useEffect, useRef, useState } from "react";
import { socket, uploadImage, getAllQuestions, createExamAnswer } from "./config";
import { useSearchParams } from "react-router-dom";
import {
  Button, Typography, Card, CardContent, FormControl,
  FormLabel, RadioGroup, FormControlLabel, Radio, Box, Grid
} from "@mui/material";

export default function UserPage() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("name") || "guest";
  const localVideoRef = useRef(null);
  const pcRef = useRef(null);
  const intervalRef = useRef(null);

  const [hasCalled, setHasCalled] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

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

    intervalRef.current = setInterval(() => {
      captureAndSendFrame();
    }, 50000);
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
      await uploadImage({ username, image: imageData });
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

    const fetched = await getAllQuestions();
    setQuestions(fetched.slice(0, 10)); // chỉ lấy 10 câu
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < 10) {
      alert("Bạn chưa trả lời đủ 10 câu hỏi!");
      return;
    }

    const payload = {
      userName: username,
      userId: Date.now(), // có thể dùng ID thực tế
      ...Object.fromEntries(
        Object.values(questions).map((q, i) => [`q${i + 1}`, answers[q.id]])
      )
    };

    try {
      await createExamAnswer(payload);
      alert("📝 Gửi bài thi thành công!");
    } catch (err) {
      alert("❌ Gửi bài thi thất bại!");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>User: {username}</Typography>
      <video ref={localVideoRef} autoPlay muted style={{ width: "300px", border: "1px solid black" }} />

      {!hasCalled && (
        <Button variant="contained" onClick={startCall} sx={{ mt: 2 }}>
          Bắt đầu gọi
        </Button>
      )}

      {hasCalled && questions.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">📝 Bài thi trắc nghiệm</Typography>
          <Grid container spacing={2}>
            {questions.map((q, index) => (
              <Grid item xs={12} key={q.id}>
                <Card variant="outlined">
                  <CardContent>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">{index + 1}. {q.content}</FormLabel>
                      <RadioGroup
                        value={answers[q.id] || ""}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      >
                        {["A", "B", "C", "D"].map((opt) => (
                          <FormControlLabel
                            key={opt}
                            value={opt}
                            control={<Radio />}
                            label={`${opt}. ${q.options[opt]}`}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            sx={{ mt: 3 }}
          >
            Nộp bài
          </Button>
        </Box>
      )}
    </Box>
  );
}
