// src/pages/StudentSessions.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function StudentSessions() {
  const { classroomId } = useParams();
  const [sessions, setSessions] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/active-session/${classroomId}/`, {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        setSessions(res.data.sessions || []); // Adjust depending on backend response
      } catch (err) {
        console.error(err);
        alert('Failed to fetch sessions');
      }
    };
    fetchSessions();
  }, [classroomId, token]);

  const handleMarkAttendance = (sessionId) => {
    navigate(`/mark-attendance/${sessionId}`);
  };

  return (
    <div>
      <h2>Available Sessions</h2>
      {sessions.length === 0 ? (
        <p>No active sessions available</p>
      ) : (
        sessions.map((session) => (
          <div key={session.id} style={styles.sessionBox}>
            <p>
              From: {new Date(session.start_time).toLocaleString()} <br />
              Until: {new Date(session.end_time).toLocaleString()}
            </p>
            <button onClick={() => handleMarkAttendance(session.id)}>Mark Attendance</button>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  sessionBox: {
    border: '1px solid gray',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '8px'
  }
};

export default StudentSessions;
