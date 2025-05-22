import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const ChangePassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Call API with token + new password
    console.log('Changing password with token:', token, newPassword);
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="New Password"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
