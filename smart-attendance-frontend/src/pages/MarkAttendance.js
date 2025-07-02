import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function MarkAttendance() {
  const { classroomId } = useParams(); // ✅ Extract classroomId from route
  const [alreadyMarked, setAlreadyMarked] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [location, setLocation] = useState('');
  const [faceId, setFaceId] = useState('');
  const [voiceNoteUrl, setVoiceNoteUrl] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!classroomId || !token) {
      setStatusMessage('Classroom ID or token is missing.');
      return;
    }

    setStatusMessage('You may mark attendance if session is valid.');
  }, [classroomId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/users/mark-attendance/', // ✅ fixed URL
        {
          classroom: classroomId,                      // ✅ correctly passed in body
          location: location || null,
          face_id: faceId || null,
          voice_note_url: voiceNoteUrl || null,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      alert(res.data.message || 'Attendance marked!');
      setAlreadyMarked(true);
    } catch (err) {
      console.error(err.response?.data);
      if (err.response?.data?.error === 'Attendance already marked') {
        setAlreadyMarked(true);
        alert('You have already marked attendance.');
      } else {
        alert('Failed to mark attendance: ' + JSON.stringify(err.response?.data));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Mark Attendance</h2>

      <div style={{ marginBottom: '10px', color: 'green' }}>
        {statusMessage}
      </div>

      <input
        type="text"
        placeholder="Location (optional)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        type="text"
        placeholder="Face ID (optional)"
        value={faceId}
        onChange={(e) => setFaceId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Voice Note URL (optional)"
        value={voiceNoteUrl}
        onChange={(e) => setVoiceNoteUrl(e.target.value)}
      />
      <button type="submit" disabled={alreadyMarked}>
        {alreadyMarked ? 'Already Marked' : 'Submit Attendance'}
      </button>
    </form>
  );
}

export default MarkAttendance;
