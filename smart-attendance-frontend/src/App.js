import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './pages/Navbar';

import Register from './pages/Register';
import Login from './pages/Login';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import MarkAttendance from './pages/MarkAttendance';
import JoinClassroom from './pages/JoinClassroom';
import StudentClasses from './pages/StudentClasses';
import TeacherClasses from './pages/TeacherClasses';
import StartSession from './pages/StartSession';
import MarkAttendanceByClass from './pages/MarkAttendanceByClass';
import ViewAttendanceSessions from './pages/ViewAttendanceSessions';
import AttendanceList from './pages/AttendanceList';
import StudentSessions from './pages/StudentSessions';
import RunningSessions from './pages/RunningSessions';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/join" element={<JoinClassroom />} />
        <Route path="/student-classes" element={<StudentClasses />} />
        <Route path="/teacher-classes" element={<TeacherClasses />} />
        <Route path="/start-session/:classroomId" element={<StartSession />} />
        <Route path="/mark-attendance/:classroomId" element={<MarkAttendance />} />
        <Route path="/mark-attendance-by-class/:classroomId" element={<MarkAttendanceByClass />} />
        <Route path="/view-sessions/:classroomId" element={<ViewAttendanceSessions />} />
        <Route path="/attendance-list/:sessionId" element={<AttendanceList />} />
        <Route path="/running-sessions" element={<RunningSessions />} />

      </Routes>
    </Router>
  );
}

export default App;
