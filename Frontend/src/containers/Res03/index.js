import React, { useRef, useState } from "react";
import {
  Typography, Paper, Box, Toolbar, Drawer, List,
  ListItem, ListItemText, Grid, Button, Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { startBackendCamera, stopBackendCamera } from "./config";

const drawerWidth = 240;

const Res03 = () => {
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [streaming, setStreaming] = useState(false);

  const handleStartBackend = async () => {
    const res = await startBackendCamera();
    console.log(res);
  };

  const handleStopBackend = async () => {
    const res = await stopBackendCamera();
    console.log(res);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem button onClick={() => navigate("/registeruser/camera")}> 
            <ListItemText primary="Danh sách nhân viên" />
          </ListItem>
          <ListItem button onClick={() => navigate("/registeruser")}> 
            <ListItemText primary="Đăng ký" />
          </ListItem>
          <ListItem button onClick={() => navigate("/backend/camera")}> 
            <ListItemText primary="Mở camera backend" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Giao diện Tuỳ chỉnh WebRTC
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
                <Typography variant="caption" sx={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  px: 1,
                  borderRadius: 1,
                }}>
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
                <Typography variant="caption" sx={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  px: 1,
                  borderRadius: 1,
                }}>
                  Đối phương
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={handleStartBackend}>
                  Bắt đầu kết nối
                </Button>
                <Button variant="outlined" color="error" disabled={!streaming}>
                  Dừng
                </Button>
                <Button variant="outlined" onClick={handleStopBackend}>
                  Tắt camera backend
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default Res03;