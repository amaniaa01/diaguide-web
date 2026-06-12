import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return setPasswordStrength('');
    if (password.length < 6) return setPasswordStrength('weak');
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    const strong = hasUpper && hasNumber && hasSpecial && password.length >= 8;
    const medium = (hasUpper || hasNumber) && password.length >= 6;
    if (strong) return setPasswordStrength('strong');
    if (medium) return setPasswordStrength('medium');
    return setPasswordStrength('weak');
  };

  const handlePasswordChange = (e) => {
    setFormData({...formData, password: e.target.value});
    checkPasswordStrength(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordStrength === 'weak') {
      return setError('Password is too weak. Please use at least 8 characters with uppercase, numbers and special characters.');
    }
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/register', formData);
      login(res.data.user, res.data.token);
      navigate('/profile-setup');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const getStrengthColor = () => {
    if (passwordStrength === 'strong') return '#16A34A';
    if (passwordStrength === 'medium') return '#D97706';
    if (passwordStrength === 'weak') return '#DC2626';
    return 'transparent';
  };

  const getStrengthWidth = () => {
    if (passwordStrength === 'strong') return '100%';
    if (passwordStrength === 'medium') return '60%';
    if (passwordStrength === 'weak') return '30%';
    return '0%';
  };

  const getStrengthText = () => {
    if (passwordStrength === 'strong') return '✅ Strong password';
    if (passwordStrength === 'medium') return '⚠️ Medium — add numbers or special characters';
    if (passwordStrength === 'weak') return '❌ Weak — please use a stronger password';
    return '';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.topAccent} />
        <h1 style={styles.title}>DiaGuide</h1>
        <p style={styles.subtitle}>Create your account</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
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
            onChange={handlePasswordChange}
            required
          />
          {/* Password strength bar */}
          {passwordStrength && (
            <div style={styles.strengthContainer}>
              <div style={styles.strengthBar}>
                <div style={{
                  ...styles.strengthFill,
                  width: getStrengthWidth(),
                  backgroundColor: getStrengthColor()
                }} />
              </div>
              <p style={{...styles.strengthText, color: getStrengthColor()}}>
                {getStrengthText()}
              </p>
            </div>
          )}
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={styles.link}>
          Already have an account? <Link to="/login" style={styles.linkColor}>Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    overflow: 'hidden',
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
    fontWeight: '600',
    marginTop: '8px'
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
  linkColor: { color: '#ff7f50', fontWeight: '600' },
  strengthContainer: { marginTop: '-8px', marginBottom: '16px' },
  strengthBar: {
    width: '100%', height: '6px',
    backgroundColor: '#E5E7EB',
    borderRadius: '3px', overflow: 'hidden'
  },
  strengthFill: {
    height: '100%', borderRadius: '3px',
    transition: 'width 0.3s, background-color 0.3s'
  },
  strengthText: { fontSize: '12px', marginTop: '4px' }
};

export default Register;