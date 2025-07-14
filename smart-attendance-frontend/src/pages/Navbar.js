import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (!token) return null;

  const displayRole = role?.charAt(0).toUpperCase() + role?.slice(1);

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const linkVariants = {
    hover: {
      scale: 1.05,
      color: '#ffffff',
      textShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0 5px 15px rgba(239, 68, 68, 0.4)',
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const roleIconVariants = {
    animate: {
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.nav
      style={styles.navbar}
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        style={styles.userInfo}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <motion.span
          style={styles.waveEmoji}
          animate={{ rotate: [0, 20, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          👋
        </motion.span>
        <span style={styles.username}>{username}</span>
        <span style={styles.separator}>•</span>
        <motion.span
          style={styles.roleContainer}
          variants={roleIconVariants}
          animate="animate"
        >
          <span style={styles.roleIcon}>
            {role === 'teacher' ? '👨‍🏫' : '👨‍🎓'}
          </span>
          <span style={styles.role}>{displayRole}</span>
        </motion.span>
      </motion.div>

      <div style={styles.links}>
        {role === 'student' && (
          <>
            <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
              <Link to="/student-dashboard" style={styles.link}>
                <span style={styles.linkIcon}>🏠</span>
                Dashboard
              </Link>
            </motion.div>
            <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
              <Link to="/student-classes" style={styles.link}>
                <span style={styles.linkIcon}>📚</span>
                My Classes
              </Link>
            </motion.div>
          </>
        )}

        {role === 'teacher' && (
          <>
            <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
              <Link to="/teacher-dashboard" style={styles.link}>
                <span style={styles.linkIcon}>🏠</span>
                Dashboard
              </Link>
            </motion.div>
            <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
              <Link to="/teacher-classes" style={styles.link}>
                <span style={styles.linkIcon}>📚</span>
                My Classes
              </Link>
            </motion.div>
            <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
              <Link to="/running-sessions" style={styles.link}>
                <span style={styles.linkIcon}>🏃‍♂️</span>
                Running Sessions
              </Link>
            </motion.div>
          </>
        )}

        <motion.button
          onClick={handleLogout}
          style={styles.logout}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <span style={styles.logoutIcon}>🚪</span>
          Logout
        </motion.button>
      </div>

      {/* Decorative elements */}
      <motion.div
        style={styles.decorativeGlow}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.nav>
  );
}

const styles = {
  navbar: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    color: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: 'relative',
    zIndex: 1000,
  },

  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    fontSize: '1rem',
    fontWeight: '500',
  },

  waveEmoji: {
    fontSize: '1.5rem',
    display: 'inline-block',
    transformOrigin: '70% 70%',
  },

  username: {
    fontWeight: '700',
    fontSize: '1.1rem',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  },

  separator: {
    fontSize: '1.2rem',
    opacity: 0.6,
    fontWeight: '300',
  },

  roleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.3rem 0.8rem',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },

  roleIcon: {
    fontSize: '1.2rem',
    display: 'inline-block',
  },

  role: {
    fontSize: '0.9rem',
    fontWeight: '600',
    fontStyle: 'italic',
  },

  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },

  link: {
    color: 'rgba(255, 255, 255, 0.9)',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    border: '1px solid transparent',
  },

  linkIcon: {
    fontSize: '1.1rem',
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
  },

  logout: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 10px rgba(239, 68, 68, 0.2)',
    fontFamily: 'inherit',
  },

  logoutIcon: {
    fontSize: '1.1rem',
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
  },

  decorativeGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: -1,
  },
};

export default Navbar;