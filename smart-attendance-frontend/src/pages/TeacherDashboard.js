import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function TeacherDashboard() {
  const [form, setForm] = useState({ class_name: '', subject: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (message) setMessage(''); // Clear message when user starts typing
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/users/create/', form, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setMessage(`✅ Class created! Join Code: ${res.data.join_code}`);
      setForm({ class_name: '', subject: '' });
    } catch (err) {
      console.error(err.response?.data);
      setMessage('❌ Error creating class');
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

  const isSuccess = message.includes('✅');

  return (
    <motion.div
      style={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        style={styles.dashboardCard}
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
              📚
            </motion.div>
          </div>
          <h2 style={styles.title}>Teacher Dashboard</h2>
          <p style={styles.subtitle}>Create and manage your classes</p>
        </motion.div>

        <motion.form
          onSubmit={handleCreateClass}
          style={styles.form}
          variants={itemVariants}
        >
          <motion.div style={styles.inputGroup} variants={itemVariants}>
            <label style={styles.label}>Class Name</label>
            <motion.input
              name="class_name"
              placeholder="Enter class name"
              value={form.class_name}
              onChange={handleChange}
              required
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
            <label style={styles.label}>Subject</label>
            <motion.input
              name="subject"
              placeholder="Enter subject"
              value={form.subject}
              onChange={handleChange}
              required
              style={styles.input}
              whileFocus={{
                scale: 1.02,
                boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
                borderColor: "#6366f1"
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>

          {message && (
            <motion.div
              style={{
                ...styles.messageContainer,
                backgroundColor: isSuccess ? 'rgba(72, 187, 120, 0.1)' : 'rgba(229, 62, 62, 0.1)',
                borderColor: isSuccess ? 'rgba(72, 187, 120, 0.2)' : 'rgba(229, 62, 62, 0.2)',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span style={styles.messageIcon}>
                {isSuccess ? '🎉' : '⚠️'}
              </span>
              <span style={{
                ...styles.messageText,
                color: isSuccess ? '#38a169' : '#e53e3e'
              }}>
                {message}
              </span>
            </motion.div>
          )}

          <motion.button
            type="submit"
            style={{
              ...styles.createButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            variants={buttonVariants}
            whileHover={!loading ? "hover" : {}}
            whileTap={!loading ? "tap" : {}}
            disabled={loading}
          >
            {loading ? (
              <motion.div
                style={styles.spinner}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <>
                <span style={styles.buttonIcon}>🚀</span>
                Create Class
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
          <p style={styles.footerText}>
            Students will use the join code to enroll in your class
          </p>
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

  dashboardCard: {
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

  messageContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    border: '1px solid',
    borderRadius: '8px',
  },

  messageIcon: {
    fontSize: '1.2rem',
  },

  messageText: {
    fontSize: '0.9rem',
    fontWeight: '500',
  },

  createButton: {
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

export default TeacherDashboard;