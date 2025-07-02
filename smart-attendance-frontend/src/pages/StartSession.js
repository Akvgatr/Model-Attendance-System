import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function StartSession() {
  const { classroomId } = useParams();
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Validate times
    if (new Date(startTime) >= new Date(endTime)) {
      setMessage('End time must be after start time');
      setMessageType('error');
      setIsLoading(false);
      return;
    }

    // Convert local datetime to full ISO string with timezone offset
    const toISOStringWithOffset = (localDateTimeStr) => {
      const date = new Date(localDateTimeStr);
      return date.toISOString(); // Converts to UTC
    };

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/users/teacher/session/start/',
        {
          classroom_id: classroomId,
          start_time: toISOStringWithOffset(startTime),
          end_time: toISOStringWithOffset(endTime),
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setMessage('Attendance session created successfully!');
      setMessageType('success');
      
      // Navigate back after success
      setTimeout(() => {
        navigate('/teacher-classes');
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.detail || 'Error creating attendance session');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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
      transition: { duration: 0.5 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(99, 102, 241, 0.4)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      style={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div style={styles.backgroundDecoration} />
      
      <motion.div
        style={styles.formContainer}
        variants={itemVariants}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div style={styles.header} variants={itemVariants}>
          <div style={styles.iconContainer}>
            <span style={styles.icon}>⏰</span>
          </div>
          <h1 style={styles.title}>Create Attendance Session</h1>
          <p style={styles.subtitle}>
            Set up a new attendance session for your classroom
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          style={styles.form}
          variants={itemVariants}
        >
          <motion.div style={styles.inputGroup} variants={itemVariants}>
            <label style={styles.label}>
              <span style={styles.labelText}>Start Time</span>
              <span style={styles.labelIcon}>🚀</span>
            </label>
            <motion.input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              style={styles.input}
              variants={inputVariants}
              whileFocus="focus"
              disabled={isLoading}
            />
          </motion.div>

          <motion.div style={styles.inputGroup} variants={itemVariants}>
            <label style={styles.label}>
              <span style={styles.labelText}>End Time</span>
              <span style={styles.labelIcon}>🏁</span>
            </label>
            <motion.input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              style={styles.input}
              variants={inputVariants}
              whileFocus="focus"
              disabled={isLoading}
            />
          </motion.div>

          <motion.button
            type="submit"
            style={{
              ...styles.submitButton,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            variants={buttonVariants}
            whileHover={!isLoading ? "hover" : {}}
            whileTap={!isLoading ? "tap" : {}}
            disabled={isLoading}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  style={styles.loadingContent}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    style={styles.spinner}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Creating Session...
                </motion.div>
              ) : (
                <motion.div
                  key="submit"
                  style={styles.buttonContent}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span style={styles.buttonIcon}>✨</span>
                  Create Session
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.form>

        <AnimatePresence>
          {message && (
            <motion.div
              style={{
                ...styles.messageContainer,
                ...(messageType === 'success' ? styles.successMessage : styles.errorMessage)
              }}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <span style={styles.messageIcon}>
                {messageType === 'success' ? '✅' : '❌'}
              </span>
              <span style={styles.messageText}>{message}</span>
              {messageType === 'success' && (
                <motion.div
                  style={styles.successAnimation}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  🎉
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          style={styles.backButton}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/teacher-classes')}
        >
          <span style={styles.backIcon}>←</span>
          Back to Classes
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  backgroundDecoration: {
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },

  formContainer: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '3rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px',
    position: 'relative',
    zIndex: 1,
  },

  header: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },

  iconContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    borderRadius: '50%',
    marginBottom: '1.5rem',
    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
  },

  icon: {
    fontSize: '2.5rem',
  },

  title: {
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: '800',
    color: '#2d3748',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.02em',
  },

  subtitle: {
    fontSize: '1.1rem',
    color: '#718096',
    fontWeight: '400',
    margin: 0,
    lineHeight: '1.5',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#4a5568',
  },

  labelText: {
    flex: 1,
  },

  labelIcon: {
    fontSize: '1.2rem',
  },

  input: {
    width: '100%',
    padding: '1rem 1.25rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    background: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box',
  },

  submitButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    padding: '1.25rem 2rem',
    borderRadius: '15px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60px',
    marginTop: '1rem',
  },

  loadingContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },

  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
  },

  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  buttonIcon: {
    fontSize: '1.3rem',
  },

  messageContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.25rem',
    borderRadius: '12px',
    marginTop: '1.5rem',
    position: 'relative',
    overflow: 'hidden',
  },

  successMessage: {
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    color: 'white',
  },

  errorMessage: {
    background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
    color: 'white',
  },

  messageIcon: {
    fontSize: '1.5rem',
  },

  messageText: {
    fontSize: '1rem',
    fontWeight: '500',
    flex: 1,
  },

  successAnimation: {
    fontSize: '1.5rem',
    position: 'absolute',
    right: '1rem',
  },

  backButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '2rem',
    padding: '0.75rem 1.5rem',
    background: 'rgba(99, 102, 241, 0.1)',
    color: '#6366f1',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  backIcon: {
    fontSize: '1.2rem',
  },

  // Responsive styles
  '@media (max-width: 768px)': {
    container: {
      padding: '1rem',
    },
    formContainer: {
      padding: '2rem',
      margin: '1rem',
    },
  },
};

export default StartSession;