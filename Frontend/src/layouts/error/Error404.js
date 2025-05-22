// layouts/ErrorPages/Error404.js
import React from 'react';
import { Link } from 'react-router-dom';

const Error404 = () => {
  return (
    <div style={{ textAlign: 'center', padding: '5rem' }}>
      <h1 style={{ fontSize: '4rem', color: '#cc0000' }}>404</h1>
      <h2>Không tìm thấy trang</h2>
      <p>Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      <Link to="/" style={{ marginTop: '1rem', display: 'inline-block' }}>
        ← Quay về trang chủ
      </Link>
    </div>
  );
};

export default Error404;
