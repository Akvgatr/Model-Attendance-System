import React, { useState } from 'react';
import axios from 'axios';

function TeacherDashboard() {
  const [form, setForm] = useState({ class_name: '', subject: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/users/create/', form, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setMessage(`✅ Class created! Join Code: ${res.data.join_code}`);
      setForm({ class_name: '', subject: '' });
    } catch (err) {
      console.error(err.response?.data);
      setMessage('❌ Error creating class');
    }
  };

  return (
    <div>
      <h2>📚 Teacher Dashboard</h2>
      <form onSubmit={handleCreateClass}>
        <input
          name="class_name"
          placeholder="Class Name"
          value={form.class_name}
          onChange={handleChange}
          required
        />
        <input
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          required
        />
        <button type="submit">Create Class</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default TeacherDashboard;
