import React, { useRef, useEffect, useState } from "react";
import {
  Typography, Paper, Box, Toolbar, Drawer, List,
  ListItem, ListItemText, Grid, Button, Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import socket from "./config"; // tách socket riêng như config.js

const drawerWidth = 240;

const Res02WebRTC = () => {
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const [streaming, setStreaming] = useState(false);

  const startStreaming = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.onicecandidate = e => {
      if (e.candidate) socket.emit('ice-candidate', e.candidate);
    };

    pc.ontrack = e => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };

    socket.on('offer', async (offer) => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', answer);
    });

    socket.on('answer', async (answer) => {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', async (candidate) => {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("ICE candidate error", e);
      }
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('offer', offer);

    peerRef.current = pc;
    setStreaming(true);
  };

  const stopStreaming = () => {
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
  
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }
  
    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      remoteVideoRef.current.srcObject = null;
    }
  
    setStreaming(false);
  };

  useEffect(() => () => stopStreaming(), []);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Drawer variant="permanent" anchor="left" sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}>
        <Toolbar />
        <List>
          <ListItem button onClick={() => navigate("/registeruser/camera")}>
            <ListItemText primary="Camera" />
          </ListItem>
          <ListItem sx={{ color: 'red' }} button onClick={() => navigate("/registeruser")}>
            <ListItemText primary="Đăng ký" />
          </ListItem>
          <ListItem button onClick={() => navigate("/backend/camera")}> 
            <ListItemText primary="Mở camera backend" />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            WebRTC Video Call (Peer-to-Peer)
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: "relative" }}>
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{ width: "100%", borderRadius: 12, border: "2px solid #4caf50" }}
                />
                <Typography variant="caption" sx={{ position: "absolute", bottom: 8, left: 8, backgroundColor: "rgba(0,0,0,0.6)", color: "#fff", px: 1, borderRadius: 1 }}>
                  Bạn (Local)
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ position: "relative" }}>
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  style={{ width: "100%", borderRadius: 12, border: "2px solid #2196f3" }}
                />
                <Typography variant="caption" sx={{ position: "absolute", bottom: 8, left: 8, backgroundColor: "rgba(0,0,0,0.6)", color: "#fff", px: 1, borderRadius: 1 }}>
                  Đối phương
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary" onClick={startStreaming} disabled={streaming}>
                  Bắt đầu kết nối
                </Button>
                <Button variant="outlined" color="error" onClick={stopStreaming} disabled={!streaming}>
                  Dừng
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default Res02WebRTC;