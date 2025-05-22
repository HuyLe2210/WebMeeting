// layouts/AuthLayout.js
import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div style={{ padding: '4rem', maxWidth: 400, margin: 'auto' }}>
      <h2 style={{ textAlign: 'center' }}>Authentication</h2>
      <div style={{ border: '1px solid #ccc', padding: '2rem', borderRadius: 8 }}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
