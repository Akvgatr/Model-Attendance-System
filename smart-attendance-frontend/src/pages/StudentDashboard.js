import React, { useState } from 'react';
import axios from 'axios';

function StudentDashboard() {
  const [joinCode, setJoinCode] = useState('');
  const [classroomId, setClassroomId] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const handleJoinClass = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/users/join/',
        { join_code: joinCode },
        { headers: { Authorization: `Token ${token}` } }
      );
      setMessage('Joined class successfully!');
      setJoinCode('');
    } catch (err) {
      setMessage('Failed to join class.');
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/users/mark-attendance/',
        { classroom: classroomId },
        { headers: { Authorization: `Token ${token}` } }
      );
      setMessage('Attendance marked successfully!');
      setClassroomId('');
    } catch (err) {
      setMessage('Failed to mark attendance.');
    }
  };

  return (
    <div>
      <h2>Student Dashboard</h2>

      <form onSubmit={handleJoinClass}>
        <input
          placeholder="Enter Join Code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          required
        />
        <button type="submit">Join Class</button>
      </form>

      <form onSubmit={handleMarkAttendance} style={{ marginTop: '20px' }}>
        <input
          placeholder="Enter Classroom ID"
          value={classroomId}
          onChange={(e) => setClassroomId(e.target.value)}
          required
        />
        <button type="submit">Mark Attendance</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default StudentDashboard;
