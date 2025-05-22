// containers/user/AddUser.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const AddUserPage = () => {
  const { id } = useParams(); // nếu là /edit/:id
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isEdit) {
      // TODO: Gọi API lấy dữ liệu user theo id
      setName('Nguyễn Văn A');
      setEmail('a@example.com');
    }
  }, [isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { name, email };

    if (isEdit) {
      // TODO: Gọi API cập nhật
      console.log('Cập nhật user:', id, userData);
    } else {
      // TODO: Gọi API tạo mới
      console.log('Tạo user mới:', userData);
    }
  };

  return (
    <div>
      <h2>{isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Họ tên:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button style={{ marginTop: 16 }} type="submit">
          {isEdit ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </form>
    </div>
  );
};

export default AddUserPage;
