import React, { useState } from 'react';

const ChangeFirstPassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Call API
    console.log('Changing password:', { oldPassword, newPassword });
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Old Password"
          type="password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
        />
        <input
          placeholder="New Password"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangeFirstPassword;
