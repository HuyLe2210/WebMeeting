// meeting/JoinMeeting.js
import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const JoinMeeting = () => {
  const [roomID, setRoomID] = useState("");
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (roomID.trim() && userID.trim() && userName.trim()) {
      // Điều hướng đến phòng họp với các tham số
      navigate(`/meeting/room?roomID=${roomID}&userID=${userID}&userName=${encodeURIComponent(userName)}`);
    } else {
      alert("Vui lòng nhập đầy đủ thông tin!");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper sx={{ padding: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>
          Tham gia phòng họp
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Room ID"
            value={roomID}
            onChange={(e) => setRoomID(e.target.value)}
            required
          />
          <TextField
            label="User ID"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            required
          />
          <TextField
            label="Tên người dùng"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <Button fullWidth variant="contained" onClick={handleJoin}>
            Vào họp
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default JoinMeeting;
