// layouts/SelectLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';

const SelectLayout = () => {
  return (
    <div style={{ padding: '3rem' }}>
      <h2>Trang Select Layout</h2>
      <Outlet />  {/* Đây là chỗ nội dung M0101 sẽ được hiển thị */}
    </div>
  );
};

export default SelectLayout;

