// src/pages/AttendanceList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function AttendanceList() {
  const { sessionId } = useParams();
  const [attendances, setAttendances] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/users/teacher/session/list/${sessionId}/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setAttendances(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        alert('Failed to load attendance list.');
      }
    };

    fetchAttendance();
  }, [sessionId, token]);

  return (
    <div>
      <h2>Attendance List</h2>
      {attendances.length === 0 ? (
        <p>No students have marked attendance yet.</p>
      ) : (
        <ul>
          {attendances.map((entry, index) => (
            <li key={index}>
              <strong>{entry.student}</strong> marked at {new Date(entry.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AttendanceList;
