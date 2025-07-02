// src/pages/JoinClassroom.js
import React, { useState } from 'react';
import axios from 'axios';

function JoinClassroom() {
  const [joinCode, setJoinCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/users/join/',
        { join_code: joinCode },
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      );
      alert(`Joined: ${res.data.class_name} (ID: ${res.data.classroom_id})`);
      localStorage.setItem('classroom_id', res.data.classroom_id);
    } catch (err) {
      console.error(err.response?.data);
      alert('Failed to join class: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Join a Classroom</h2>
      <input
        type="text"
        placeholder="Enter Join Code"
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
        required
      />
      <button type="submit">Join</button>
    </form>
  );
}

export default JoinClassroom;
