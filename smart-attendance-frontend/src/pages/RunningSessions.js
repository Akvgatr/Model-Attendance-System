import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function RunningSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          'http://127.0.0.1:8000/api/users/teacher/session/active/',
          {
            headers: {
              Authorization: `Token ${token}`
            }
          }
        );
        setSessions(res.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch running sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const handleViewAttendance = (sessionId) => {
    navigate(`/attendance-list/${sessionId}`);
  };

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  const getSessionStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (now < start) return 'upcoming';
    if (now > end) return 'expired';
    return 'active';
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

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <motion.div
          style={styles.loadingContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            style={styles.spinner}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            style={styles.loadingText}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading active sessions...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <motion.div
          style={styles.errorContainer}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div style={styles.errorIcon}>📡</div>
          <h3 style={styles.errorTitle}>Connection Error</h3>
          <p style={styles.errorMessage}>{error}</p>
          <motion.button
            style={styles.retryButton}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      style={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        style={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div style={styles.titleContainer}>
          <span style={styles.titleIcon}>📡</span>
          <h1 style={styles.title}>Running Sessions</h1>
        </div>
        <p style={styles.subtitle}>
          Monitor and manage your active attendance sessions
        </p>
        <motion.div
          style={styles.refreshIndicator}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Auto-refreshing every 30 seconds
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {sessions.length === 0 ? (
          <motion.div
            style={styles.emptyState}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <div style={styles.emptyIcon}>🎯</div>
            <h3 style={styles.emptyTitle}>No Active Sessions</h3>
            <p style={styles.emptyMessage}>
              There are no running attendance sessions at the moment. 
              Create a new session to get started!
            </p>
            <motion.button
              style={styles.createButton}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate('/teacher-classes')}
            >
              <span style={styles.buttonIcon}>✨</span>
              Create New Session
            </motion.button>
          </motion.div>
        ) : (
          <motion.div style={styles.sessionsGrid}>
            {sessions.map((session, index) => {
              const status = getSessionStatus(session.start_time, session.end_time);
              const timeRemaining = getTimeRemaining(session.end_time);
              
              return (
                <motion.div
                  key={session.session_id}
                  style={{
                    ...styles.sessionCard,
                    ...styles[`${status}Card`]
                  }}
                  variants={cardVariants}
                  whileHover={{
                    y: -8,
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                    transition: { duration: 0.3 }
                  }}
                  layout
                >
                  <div style={styles.cardHeader}>
                    <div style={{
                      ...styles.statusBadge,
                      ...styles[`${status}Badge`]
                    }}>
                      <span style={styles.statusDot} />
                      {status.toUpperCase()}
                    </div>
                    <div style={styles.sessionNumber}>
                      #{String(index + 1).padStart(2, '0')}
                    </div>
                  </div>

                  <div style={styles.cardContent}>
                    <h3 style={styles.sessionTitle}>
                      {session.class_name}
                    </h3>
                    <div style={styles.subjectTag}>
                      {session.subject}
                    </div>

                    <div style={styles.sessionDetails}>
                      <div style={styles.detailItem}>
                        <span style={styles.detailIcon}>🆔</span>
                        <div>
                          <span style={styles.detailLabel}>Session ID</span>
                          <span style={styles.detailValue}>{session.session_id}</span>
                        </div>
                      </div>

                      <div style={styles.detailItem}>
                        <span style={styles.detailIcon}>🕐</span>
                        <div>
                          <span style={styles.detailLabel}>Started</span>
                          <span style={styles.detailValue}>
                            {new Date(session.start_time).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div style={styles.detailItem}>
                        <span style={styles.detailIcon}>🕕</span>
                        <div>
                          <span style={styles.detailLabel}>Ends</span>
                          <span style={styles.detailValue}>
                            {new Date(session.end_time).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {status === 'active' && (
                        <motion.div
                          style={styles.timeRemaining}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          ⏰ {timeRemaining}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <motion.button
                    style={styles.attendanceButton}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleViewAttendance(session.session_id)}
                  >
                    <span style={styles.buttonIcon}>👥</span>
                    View Attendance List
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },

  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },

  titleIcon: {
    fontSize: '3rem',
  },

  title: {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
    letterSpacing: '-0.02em',
  },

  subtitle: {
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
    margin: '0 0 1rem 0',
  },

  refreshIndicator: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },

  sessionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },

  sessionCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },

  activeCard: {
    borderLeft: '4px solid #48bb78',
  },

  upcomingCard: {
    borderLeft: '4px solid #ed8936',
  },

  expiredCard: {
    borderLeft: '4px solid #e53e3e',
    opacity: 0.7,
  },

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },

  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '25px',
    fontSize: '0.8rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  activeBadge: {
    background: 'linear-gradient(135deg, #48bb78, #38a169)',
    color: 'white',
  },

  upcomingBadge: {
    background: 'linear-gradient(135deg, #ed8936, #dd6b20)',
    color: 'white',
  },

  expiredBadge: {
    background: 'linear-gradient(135deg, #e53e3e, #c53030)',
    color: 'white',
  },

  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },

  sessionNumber: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'rgba(0, 0, 0, 0.1)',
  },

  cardContent: {
    marginBottom: '2rem',
  },

  sessionTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 1rem 0',
    lineHeight: '1.3',
  },

  subjectTag: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '15px',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
  },

  sessionDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },

  detailItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
  },

  detailIcon: {
    fontSize: '1.2rem',
    marginTop: '0.1rem',
  },

  detailLabel: {
    display: 'block',
    fontSize: '0.85rem',
    color: '#718096',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '0.25rem',
  },

  detailValue: {
    display: 'block',
    fontSize: '1rem',
    color: '#2d3748',
    fontWeight: '600',
  },

  timeRemaining: {
    background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
    color: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: '0.5rem',
  },

  attendanceButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    padding: '1rem 1.5rem',
    borderRadius: '15px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },

  buttonIcon: {
    fontSize: '1.2rem',
  },

  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },

  spinner: {
    width: '60px',
    height: '60px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    marginBottom: '1rem',
  },

  loadingText: {
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: '500',
  },

  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '3rem',
    maxWidth: '500px',
    margin: '0 auto',
  },

  errorIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },

  errorTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#e53e3e',
    margin: '0 0 1rem 0',
  },

  errorMessage: {
    fontSize: '1rem',
    color: '#718096',
    margin: '0 0 2rem 0',
  },

  retryButton: {
    background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },

  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '3rem',
    maxWidth: '600px',
    margin: '0 auto',
  },

  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },

  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 1rem 0',
  },

  emptyMessage: {
    fontSize: '1rem',
    color: '#718096',
    margin: '0 0 2rem 0',
    lineHeight: '1.6',
  },

  createButton: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '15px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  // Responsive styles
  '@media (max-width: 768px)': {
    container: {
      padding: '1rem',
    },
    sessionsGrid: {
      gridTemplateColumns: '1fr',
      gap: '1.5rem',
    },
    sessionCard: {
      padding: '1.5rem',
    },
  },
};

export default RunningSessions;