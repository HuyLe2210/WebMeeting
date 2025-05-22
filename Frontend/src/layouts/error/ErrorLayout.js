// layouts/ErrorLayout.js
import React from 'react';

const ErrorLayout = ({ children }) => {
  return (
    <div style={{ padding: '5rem', textAlign: 'center' }}>
      <h1>Oops! Something went wrong.</h1>
      {children}
    </div>
  );
};

export default ErrorLayout;
