// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function MarkAttendance() {
//   const [classroom, setClassroom] = useState(localStorage.getItem('classroom_id') || '');
//   const [location, setLocation] = useState('');
//   const [faceId, setFaceId] = useState('');
//   const [voiceNoteUrl, setVoiceNoteUrl] = useState('');
//   const [sessionInfo, setSessionInfo] = useState(null);
//   const [alreadyMarked, setAlreadyMarked] = useState(false);
//   const [statusMessage, setStatusMessage] = useState('');

//   const token = localStorage.getItem('token');

//   // Fetch active session on component load
//   useEffect(() => {
//     if (!classroom || !token) return;

//     axios
//       .get(`http://127.0.0.1:8000/api/users/active-session/${classroom}/`, {
//         headers: { Authorization: `Token ${token}` },
//       })
//       .then((res) => {
//         if (res.data.session_id) {
//           setSessionInfo(res.data);
//           setStatusMessage('Active attendance session available.');
//         } else {
//           setStatusMessage('No active attendance session currently.');
//         }
//       })
//       .catch((err) => {
//         console.error('Error fetching session:', err.response?.data);
//         setStatusMessage('Error checking attendance session.');
//       });
//   }, [classroom, token]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!token) {
//       alert('You are not logged in!');
//       return;
//     }

//     if (!classroom) {
//       alert('Classroom ID not found. Please join a class first.');
//       return;
//     }

//     if (!sessionInfo) {
//       alert('No active attendance session right now.');
//       return;
//     }

//     try {
//       const response = await axios.post(
//         'http://127.0.0.1:8000/api/users/mark-attendance/',
//         {
//           classroom,
//           location: location || null,
//           face_id: faceId || null,
//           voice_note_url: voiceNoteUrl || null,
//         },
//         {
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         }
//       );

//       alert(response.data.message);
//       setAlreadyMarked(true);
//     } catch (err) {
//       console.error('Error response:', err.response?.data);
//       if (err.response?.data?.error === 'Attendance already marked') {
//         setAlreadyMarked(true);
//         alert('You have already marked attendance.');
//       } else {
//         alert('Failed to mark attendance: ' + JSON.stringify(err.response?.data));
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Mark Attendance</h2>

//       <div style={{ marginBottom: '10px', color: sessionInfo ? 'green' : 'red' }}>
//         {statusMessage}
//         {sessionInfo && (
//           <div>
//             Active From: {new Date(sessionInfo.start_time).toLocaleString()} <br />
//             Until: {new Date(sessionInfo.end_time).toLocaleString()}
//           </div>
//         )}
//       </div>

//       <input
//         type="text"
//         placeholder="Classroom ID (UUID)"
//         value={classroom}
//         onChange={(e) => setClassroom(e.target.value)}
//         required
//       />

//       <input
//         type="text"
//         placeholder="Location (optional)"
//         value={location}
//         onChange={(e) => setLocation(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Face ID (optional)"
//         value={faceId}
//         onChange={(e) => setFaceId(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Voice Note URL (optional)"
//         value={voiceNoteUrl}
//         onChange={(e) => setVoiceNoteUrl(e.target.value)}
//       />
//       <button type="submit" disabled={!sessionInfo || alreadyMarked}>
//         {alreadyMarked ? 'Already Marked' : 'Submit Attendance'}
//       </button>
//     </form>
//   );
// }

// export default MarkAttendance;
