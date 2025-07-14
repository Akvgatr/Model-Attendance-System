import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function StudentClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://127.0.0.1:8000/api/users/my-classes/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        setClasses(res.data);
        setError(null);
      } catch (err) {
        console.error(err.response?.data);
        setError('Failed to fetch joined classes');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [token]);

  const handleMarkAttendance = (classroomId) => {
    navigate(`/mark-attendance/${classroomId}`);
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
            Loading your classes...
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
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorTitle}>Oops! Something went wrong</h3>
          <p style={styles.errorMessage}>{error}</p>
          <motion.button
            style={styles.retryButton}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => window.location.reload()}
          >
            Try Again
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
        <h1 style={styles.title}>My Joined Classes</h1>
        <p style={styles.subtitle}>
          View your enrolled classes and mark attendance
        </p>
      </motion.div>

      <AnimatePresence>
        {classes.length === 0 ? (
          <motion.div
            style={styles.emptyState}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <div style={styles.emptyIcon}>🎒</div>
            <h3 style={styles.emptyTitle}>No Classes Yet</h3>
            <p style={styles.emptyMessage}>
              You haven't joined any classes yet. Ask your teacher for a join code to get started!
            </p>
          </motion.div>
        ) : (
          <motion.div style={styles.classGrid}>
            {classes.map((cls, index) => (
              <motion.div
                key={cls.classroom_id}
                style={styles.classCard}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.3 }
                }}
                layout
              >
                <div style={styles.cardHeader}>
                  <div style={styles.subjectBadge}>
                    {cls.subject}
                  </div>
                  <div style={styles.cardNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                
                <div style={styles.cardContent}>
                  <h3 style={styles.className}>{cls.class_name}</h3>
                  
                  <div style={styles.joinCodeContainer}>
                    <span style={styles.joinCodeLabel}>Join Code</span>
                    <motion.div
                      style={styles.joinCode}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {cls.join_code}
                    </motion.div>
                  </div>
                </div>

                <motion.button
                  style={styles.markAttendanceButton}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleMarkAttendance(cls.classroom_id)}
                >
                  <span style={styles.buttonIcon}>✅</span>
                  Mark Attendance
                </motion.button>
              </motion.div>
            ))}
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
  
  title: {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: '0 0 1rem 0',
    letterSpacing: '-0.02em',
  },
  
  subtitle: {
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
    margin: 0,
  },
  
  classGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  
  classCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  
  subjectBadge: {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '25px',
    fontSize: '0.85rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  cardNumber: {
    fontSize: '2rem',
    fontWeight: '800',
    color: 'rgba(0, 0, 0, 0.1)',
  },
  
  cardContent: {
    marginBottom: '2rem',
  },
  
  className: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 1.5rem 0',
    lineHeight: '1.3',
  },
  
  joinCodeContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  
  joinCodeLabel: {
    fontSize: '0.9rem',
    color: '#718096',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  joinCode: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '700',
    letterSpacing: '2px',
    textAlign: 'center',
    cursor: 'pointer',
    userSelect: 'all',
  },
  
  markAttendanceButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
    transition: 'all 0.3s ease',
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
    maxWidth: '500px',
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
    margin: 0,
    lineHeight: '1.6',
  },
};

export default StudentClasses;