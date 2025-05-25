// containers/M0101/index.js
import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';

const M0101 = () => {

  const handleChangePageClick = (target) => {
    if (target === 'register') {
      window.location.href = '/registeruser';
    } else if (target === 'exam') {
      window.location.href = '/meeting/join';
    } else if (target === 'user') {
      window.location.href = '/admin/account/list';
    } else if (target === 'camera') {
      window.location.href = '/meeting/page';
    } else if (target === 'examp') {
      window.location.href = '/meeting/test';
    }
  };
  return (
    <Grid
      container
      justifyContent={'center'}
      alignItems="center"
      direction="column"
      sx={{ minHeight: '100vh', padding: 2 }}
    >
      <Typography variant="h4" fontWeight="bold">
        Phần mềm đánh giá năng lực trực tuyến
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Chào mừng bạn đến với hệ thống đánh giá năng lực. Vui lòng chọn một chức năng bên dưới để tiếp tục.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Module: Đăng ký */}
        <Grid item xs={12} md={6} sx={{maxWidth: '300px', mt: 2 }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
            onClick={() => {handleChangePageClick('register') }}
          >
            <Typography variant="h6" gutterBottom>
              Đăng ký
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Thực hiện đăng ký thông tin cá nhân trước khi tham gia kỳ thi.
            </Typography>
          </Paper>
        </Grid>

        {/* Module: Dự thi */}
        <Grid item xs={12} md={6} sx={{maxWidth: '300px', mt: 2 }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
            onClick={() => {handleChangePageClick('exam') }}
          >
            <Typography variant="h6" gutterBottom>
              Dự thi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bắt đầu làm bài thi đánh giá năng lực trực tuyến.
            </Typography>
          </Paper>
        </Grid>

        {/* Module: Người dùng */}
        <Grid item xs={12} md={6} sx={{maxWidth: '300px', mt: 2 }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
            onClick={() => {handleChangePageClick('user') }}
          >
            <Typography variant="h6" gutterBottom>
              Ngươi dùng
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quản lý thông tin người dùng.
            </Typography>
          </Paper>
        </Grid>

        {/* Module: Người dùng */}
        <Grid item xs={12} md={6} sx={{maxWidth: '300px', mt: 2 }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
            onClick={() => {handleChangePageClick('camera') }}
          >
            <Typography variant="h6" gutterBottom>
              Quản lý dự thi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quản lý camera các thí sinh dự thi.
            </Typography>
          </Paper>
        </Grid>

        {/* Module: Người dùng */}
        <Grid item xs={12} md={6} sx={{maxWidth: '300px', mt: 2 }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
            onClick={() => {handleChangePageClick('examp') }}
          >
            <Typography variant="h6" gutterBottom>
              Dự thi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tham gia làm bài thi trực tuyến.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default M0101;
