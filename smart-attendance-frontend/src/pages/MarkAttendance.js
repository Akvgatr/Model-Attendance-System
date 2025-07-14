import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

function MarkAttendance() {
  const { classroomId } = useParams();
  const [alreadyMarked, setAlreadyMarked] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [location, setLocation] = useState('');
  const [faceId, setFaceId] = useState('');
  const [voiceNoteUrl, setVoiceNoteUrl] = useState('');
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/users/mark-attendance/',
        {
          classroom: classroomId,
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
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div
      style={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        style={styles.attendanceCard}
        variants={itemVariants}
        whileHover={{
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
          transition: { duration: 0.3 }
        }}
      >
        <motion.div
          style={styles.header}
          variants={itemVariants}
        >
          <div style={styles.logoContainer}>
            <motion.div
              style={styles.logo}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              📝
            </motion.div>
          </div>
          <h2 style={styles.title}>Mark Attendance</h2>
          <p style={styles.subtitle}>Submit your attendance for this session</p>
        </motion.div>

        {statusMessage && (
          <motion.div
            style={styles.statusContainer}
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span style={styles.statusIcon}>ℹ️</span>
            <span style={styles.statusText}>{statusMessage}</span>
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          style={styles.form}
          variants={itemVariants}
        >
          <motion.div style={styles.inputGroup} variants={itemVariants}>
            <label style={styles.label}>Location</label>
            <motion.input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your current location"
              style={styles.input}
              whileFocus={{
                scale: 1.02,
                boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
                borderColor: "#6366f1"
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>

          <motion.div style={styles.inputGroup} variants={itemVariants}>
            <label style={styles.label}>Face ID</label>
            <motion.input
              type="text"
              value={faceId}
              onChange={(e) => setFaceId(e.target.value)}
              placeholder="Enter face ID (optional)"
              style={styles.input}
              whileFocus={{
                scale: 1.02,
                boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
                borderColor: "#6366f1"
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>

          <motion.div style={styles.inputGroup} variants={itemVariants}>
            <label style={styles.label}>Voice Note URL</label>
            <motion.input
              type="text"
              value={voiceNoteUrl}
              onChange={(e) => setVoiceNoteUrl(e.target.value)}
              placeholder="Enter voice note URL (optional)"
              style={styles.input}
              whileFocus={{
                scale: 1.02,
                boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
                borderColor: "#6366f1"
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>

          <motion.button
            type="submit"
            style={{
              ...styles.submitButton,
              opacity: (loading || alreadyMarked) ? 0.7 : 1,
              cursor: (loading || alreadyMarked) ? 'not-allowed' : 'pointer'
            }}
            variants={buttonVariants}
            whileHover={(!loading && !alreadyMarked) ? "hover" : {}}
            whileTap={(!loading && !alreadyMarked) ? "tap" : {}}
            disabled={loading || alreadyMarked}
          >
            {loading ? (
              <motion.div
                style={styles.spinner}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <>
                <span style={styles.buttonIcon}>
                  {alreadyMarked ? '✅' : '📋'}
                </span>
                {alreadyMarked ? 'Already Marked' : 'Submit Attendance'}
              </>
            )}
          </motion.button>
        </motion.form>

        <motion.div
          style={styles.footer}
          variants={itemVariants}
        >
          <motion.div
            style={styles.decorativeLine}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <p style={styles.footerText}>Classroom ID: {classroomId}</p>
        </motion.div>
      </motion.div>

      {/* Floating background elements */}
      <motion.div
        style={{...styles.floatingElement, top: '10%', left: '10%'}}
        animate={{
          y: [-10, 10, -10],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        style={{...styles.floatingElement, top: '20%', right: '15%'}}
        animate={{
          y: [10, -10, 10],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        style={{...styles.floatingElement, bottom: '15%', left: '20%'}}
        animate={{
          y: [-5, 15, -5],
          rotate: [0, 3, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        style={{...styles.floatingElement, bottom: '10%', right: '25%'}}
        animate={{
          y: [5, -10, 5],
          rotate: [0, -3, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },

  attendanceCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '3rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '420px',
    position: 'relative',
    zIndex: 1,
  },

  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },

  logoContainer: {
    marginBottom: '1.5rem',
  },

  logo: {
    fontSize: '3rem',
    display: 'inline-block',
  },

  title: {
    fontSize: '2rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.02em',
  },

  subtitle: {
    fontSize: '1rem',
    color: '#718096',
    fontWeight: '500',
    margin: 0,
  },

  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  },

  statusIcon: {
    fontSize: '1.2rem',
  },

  statusText: {
    color: '#3b82f6',
    fontSize: '0.9rem',
    fontWeight: '500',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },

  label: {
    fontSize: '0.9rem',
    color: '#4a5568',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  input: {
    padding: '1rem 1.25rem',
    border: '2px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    fontSize: '1rem',
    backgroundColor: 'white',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
  },

  submitButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    minHeight: '52px',
  },

  buttonIcon: {
    fontSize: '1.2rem',
  },

  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
  },

  footer: {
    marginTop: '2rem',
    textAlign: 'center',
  },

  decorativeLine: {
    height: '2px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    margin: '0 auto 1rem auto',
    borderRadius: '1px',
  },

  footerText: {
    fontSize: '0.9rem',
    color: '#718096',
    margin: 0,
    fontWeight: '500',
  },

  floatingElement: {
    position: 'absolute',
    width: '60px',
    height: '60px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    zIndex: 0,
  },
};

export default MarkAttendance;