import React, { useState, useRef } from "react";
import {
  Typography, Paper, Box, AppBar, Toolbar, Drawer, List,
  ListItem, ListItemText, Grid, TextField, Button, Alert,
  MenuItem, Select, InputLabel, FormControl, Stack
} from "@mui/material";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { registerUser, registerFace } from "./config";

const drawerWidth = 240;
const videoConstraints = { width: 400, facingMode: "user" };

const RegisterUser = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", gender: "", address: "", image: "", password: ""
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const captureImage = () => {
    const screenshot = webcamRef.current.getScreenshot();
    if (screenshot) {
      setFormData((prev) => ({ ...prev, image: screenshot }));
      setImagePreview(screenshot);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const res = await registerUser(formData);
    registerFace(formData.image);
    if (res.error || res.message === "Error creating user") {
      setError(res.message || "❌ Lỗi tạo người dùng");
    } else {
      setMessage("✅ Tạo người dùng thành công!");
      setFormData({
        name: "", email: "", phone: "", gender: "", address: "", image: "", password: ""
      });
      setImagePreview(null);
      navigate("/meeting/join");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Header */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" onClick={() => navigate("/")} sx={{ cursor: 'pointer' }}>
            Quản lý nhân viên
          </Typography>
        </Toolbar>
      </AppBar>

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
          <ListItem sx={{ color: 'red' }} button onClick={() => navigate("/registeruser")}>
            <ListItemText primary="Đăng ký" />
          </ListItem>
          <ListItem button onClick={() => navigate("/backend/camera")}> 
            <ListItemText primary="Mở camera backend" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, padding: 3, mt: 8 }}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h5" gutterBottom>
            Đăng ký người dùng mới
          </Typography>

          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* Grid container đúng */}
          <Grid container spacing={4}>
            {/* Cột trái: form */}
            <Grid item xs={12} md={6}>
              <form onSubmit={handleSubmit}>
                <TextField fullWidth label="Tên" name="name" value={formData.name} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Mật khẩu" name="password" type="password" value={formData.password} onChange={handleChange} margin="normal" required />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="gender-label">Giới tính</InputLabel>
                  <Select labelId="gender-label" name="gender" value={formData.gender} onChange={handleChange} label="Giới tính">
                    <MenuItem value="0">Nam</MenuItem>
                    <MenuItem value="1">Nữ</MenuItem>
                  </Select>
                </FormControl>
                <TextField fullWidth label="Địa chỉ" name="address" value={formData.address} onChange={handleChange} margin="normal" required />
                <Box sx={{ textAlign: "right", mt: 3 }}>
                  <Button variant="contained" color="primary" type="submit">Gửi</Button>
                </Box>
              </form>
            </Grid>

            {/* Cột phải: webcam và ảnh */}
            <Grid item xs={12} md={6}>
              <Stack spacing={2} alignItems="center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Ảnh đại diện" style={{ width: "100%", maxHeight: 300, objectFit: "contain" }} />
                ) : (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    style={{ width: "100%", maxHeight: 300 }}
                  />
                )}

                <Button variant="outlined" onClick={captureImage}>
                  Chụp ảnh từ webcam
                </Button>

                <Button variant="contained" component="label">
                  Tải ảnh lên
                  <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </Button>

                {imagePreview && (
                  <Button variant="text" color="secondary" onClick={() => {
                    setImagePreview(null);
                    setFormData((prev) => ({ ...prev, image: "" }));
                  }}>
                    Chụp lại
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default RegisterUser;
