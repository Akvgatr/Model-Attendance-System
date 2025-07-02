import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StudentClasses() {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/users/my-classes/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        setClasses(res.data);
      } catch (err) {
        console.error(err.response?.data);
        alert('Failed to fetch joined classes');
      }
    };

    fetchClasses();
  }, [token]);

  const handleMarkAttendance = (classroomId) => {
    navigate(`/mark-attendance/${classroomId}`);
  };

  return (
    <div>
      <h2>My Joined Classes</h2>
      {classes.map((cls) => (
        <div key={cls.classroom_id} style={styles.classBox}>
          <h4>{cls.class_name} ({cls.subject})</h4>
          <p>Join Code: <strong>{cls.join_code}</strong></p>
          <button onClick={() => handleMarkAttendance(cls.classroom_id)}>
            Mark Attendance
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  classBox: {
    border: '1px solid gray',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '8px',
  }
};

export default StudentClasses;
