import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { requestNotificationPermission, showGlucoseReminder } from '../firebase';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/login', formData);
      login(res.data.user, res.data.token);
      setTimeout(async () => {
        await requestNotificationPermission();
        setTimeout(async () => {
          await showGlucoseReminder();
        }, 3000);
      }, 2000);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.topAccent} />
        <h1 style={styles.title}>DiaGuide</h1>
        <p style={styles.subtitle}>Welcome back</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.link}>
          Don't have an account? <Link to="/register" style={styles.linkColor}>Register</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    overflow: 'hidden',
    overflowY: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
    fontFamily: "'Segoe UI', Arial, sans-serif"
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    position: 'relative',
    overflow: 'hidden'
  },
  topAccent: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #ff7f50, #1D4ED8)'
  },
  title: {
    textAlign: 'center',
    color: '#ff7f50',
    fontSize: '32px',
    marginBottom: '8px',
    fontFamily: "'Segoe UI', Arial, sans-serif",
    fontWeight: '800'
  },
  subtitle: {
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: '24px',
    fontFamily: "'Segoe UI', Arial, sans-serif"
  },
  label: {
    display: 'block',
    color: '#374151',
    marginBottom: '4px',
    fontWeight: '500',
    fontSize: '14px',
    fontFamily: "'Segoe UI', Arial, sans-serif"
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '16px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    fontSize: '15px',
    boxSizing: 'border-box',
    fontFamily: "'Segoe UI', Arial, sans-serif",
    outline: 'none'
  },
  button: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(90deg, #ff7f50, #ff6030)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontFamily: "'Segoe UI', Arial, sans-serif",
    fontWeight: '600'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '16px',
    fontSize: '14px'
  },
  link: {
    textAlign: 'center',
    marginTop: '16px',
    color: '#6B7280',
    fontFamily: "'Segoe UI', Arial, sans-serif"
  },
  linkColor: { color: '#ff7f50', fontWeight: '600' }
};

export default Login;