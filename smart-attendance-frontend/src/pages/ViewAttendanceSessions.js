import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ViewAttendanceSessions() {
  const { classroomId } = useParams();
  const [sessions, setSessions] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/users/sessions/${classroomId}/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setSessions(res.data);  // Expecting an array directly
      } catch (err) {
        console.error(err);
        alert('Failed to fetch attendance sessions');
      }
    };

    fetchSessions();
  }, [classroomId, token]);

  const handleViewStudents = (sessionId) => {
    navigate(`/attendance-list/${sessionId}`);
  };

  return (
    <div>
      <h2>Attendance Sessions</h2>
      {Array.isArray(sessions) && sessions.length > 0 ? (
        sessions.map((session) => (
          <div key={session.id} style={styles.sessionBox}>
            <p>
              <strong>Date:</strong> {new Date(session.start_time).toLocaleString()} - {new Date(session.end_time).toLocaleString()}
            </p>
            <button onClick={() => handleViewStudents(session.id)}>View Attendance List</button>
          </div>
        ))
      ) : (
        <p>No sessions found for this class.</p>
      )}
    </div>
  );
}

const styles = {
  sessionBox: {
    border: '1px solid #ccc',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '8px'
  }
};

export default ViewAttendanceSessions;
