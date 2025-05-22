// layouts/DashboardLayout.js
import React from 'react';

const DashboardLayout = ({ children }) => {
  return (
    <div>
      <header style={{ background: '#003366', color: '#fff', padding: '1rem' }}>
        <h2>Dashboard</h2>
      </header>
      <main style={{ padding: '2rem' }}>{children}</main>
    </div>
  );
};

export default DashboardLayout;
