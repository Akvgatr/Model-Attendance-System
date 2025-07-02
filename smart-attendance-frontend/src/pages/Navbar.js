import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');     // 'student' or 'teacher'
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (!token) return null; // Don't show navbar if not logged in

  // Capitalize role for display
  const displayRole = role?.charAt(0).toUpperCase() + role?.slice(1);

  return (
    <nav style={styles.navbar}>
      <div style={styles.userInfo}>
        👋 <strong>{username}</strong> — <em>{displayRole}</em>
      </div>

      <div style={styles.links}>
        {role === 'student' && (
          <>
            <Link to="/student-dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/join" style={styles.link}>Join Class</Link>
            <Link to="/student-classes" style={styles.link}>My Classes</Link>
          </>
        )}

        {role === 'teacher' && (
          <>
            <Link to="/teacher-dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/teacher-classes" style={styles.link}>My Classes</Link>
            <Link to="/running-sessions" style={styles.link}>Running Sessions</Link>
          </>
        )}

        <button onClick={handleLogout} style={styles.logout}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#333',
    color: 'white',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    fontSize: '16px',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  logout: {
    marginLeft: '10px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Navbar;
