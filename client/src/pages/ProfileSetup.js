import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    age: '', gender: 'Male', weight: '',
    insulinToCarbRatio: '', correctionFactor: '',
    targetGlucoseMin: '', targetGlucoseMax: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (Number(formData.weight) <= 0) newErrors.weight = 'Weight must be greater than 0';
    if (Number(formData.insulinToCarbRatio) < 5) newErrors.insulinToCarbRatio = 'ICR must be at least 5';
    if (Number(formData.correctionFactor) < 5) newErrors.correctionFactor = 'CF must be at least 5';
    if (Number(formData.targetGlucoseMin) < 60) newErrors.targetGlucoseMin = 'Target Min must be at least 60';
    if (Number(formData.targetGlucoseMax) < 180) newErrors.targetGlucoseMax = 'Target Max must be at least 180';
    if (Number(formData.targetGlucoseMin) >= Number(formData.targetGlucoseMax)) newErrors.targetGlucoseMin = 'Target Min must be less than Target Max';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      return setErrors(validationErrors);
    }
    setLoading(true);
    try {
      await API.put('/auth/profile', formData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.topAccent} />
        <h2 style={styles.title}>Complete Your Profile</h2>
        <p style={styles.subtitle}>Enter your details and doctor-prescribed parameters</p>
        <form onSubmit={handleSubmit}>

          <label style={styles.label}>Age</label>
          <input style={styles.input} type="number" placeholder="Age" min="1"
            value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} required />

          <label style={styles.label}>Gender</label>
          <select style={styles.input} value={formData.gender}
            onChange={(e) => setFormData({...formData, gender: e.target.value})}>
            <option>Male</option>
            <option>Female</option>
          </select>

          <label style={styles.label}>Weight (kg)</label>
          <input style={{...styles.input, borderColor: errors.weight ? 'red' : '#E5E7EB'}}
            type="number" placeholder="Weight" min="1"
            value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} required />
          {errors.weight && <p style={styles.fieldError}>{errors.weight}</p>}

          <hr style={{margin: '16px 0', borderColor: '#F3F4F6'}} />
          <p style={styles.sectionTitle}>🩺 Doctor-Prescribed Parameters</p>

          <label style={styles.label}>Insulin-to-Carb Ratio (ICR) — min 5</label>
          <input style={{...styles.input, borderColor: errors.insulinToCarbRatio ? 'red' : '#E5E7EB'}}
            type="number" placeholder="e.g. 10" min="5"
            value={formData.insulinToCarbRatio} onChange={(e) => setFormData({...formData, insulinToCarbRatio: e.target.value})} required />
          {errors.insulinToCarbRatio && <p style={styles.fieldError}>{errors.insulinToCarbRatio}</p>}

          <label style={styles.label}>Correction Factor (CF) — min 5</label>
          <input style={{...styles.input, borderColor: errors.correctionFactor ? 'red' : '#E5E7EB'}}
            type="number" placeholder="e.g. 50" min="5"
            value={formData.correctionFactor} onChange={(e) => setFormData({...formData, correctionFactor: e.target.value})} required />
          {errors.correctionFactor && <p style={styles.fieldError}>{errors.correctionFactor}</p>}

          <label style={styles.label}>Target Glucose Min (mg/dL) — min 60</label>
          <input style={{...styles.input, borderColor: errors.targetGlucoseMin ? 'red' : '#E5E7EB'}}
            type="number" placeholder="e.g. 70" min="60"
            value={formData.targetGlucoseMin} onChange={(e) => setFormData({...formData, targetGlucoseMin: e.target.value})} required />
          {errors.targetGlucoseMin && <p style={styles.fieldError}>{errors.targetGlucoseMin}</p>}

          <label style={styles.label}>Target Glucose Max (mg/dL) — min 180</label>
          <input style={{...styles.input, borderColor: errors.targetGlucoseMax ? 'red' : '#E5E7EB'}}
            type="number" placeholder="e.g. 180" min="180"
            value={formData.targetGlucoseMax} onChange={(e) => setFormData({...formData, targetGlucoseMax: e.target.value})} required />
          {errors.targetGlucoseMax && <p style={styles.fieldError}>{errors.targetGlucoseMax}</p>}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    padding: '40px 20px',
    fontFamily: "'Segoe UI', Arial, sans-serif"
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    margin: '0 auto',
    position: 'relative',
    overflow: 'hidden'
  },
  topAccent: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #ff7f50, #1D4ED8)'
  },
  title: { color: '#ff7f50', marginBottom: '8px', fontWeight: '800' },
  subtitle: { color: '#6B7280', marginBottom: '24px', fontSize: '14px' },
  sectionTitle: { fontWeight: 'bold', color: '#374151', marginBottom: '16px' },
  label: {
    display: 'block', color: '#374151',
    marginBottom: '4px', fontWeight: '500', fontSize: '14px'
  },
  input: {
    width: '100%', padding: '10px', marginBottom: '8px',
    borderRadius: '8px', border: '1px solid #E5E7EB',
    fontSize: '15px', boxSizing: 'border-box',
    fontFamily: "'Segoe UI', Arial, sans-serif"
  },
  button: {
    width: '100%', padding: '12px', marginTop: '8px',
    background: 'linear-gradient(90deg, #ff7f50, #ff6030)',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '16px', cursor: 'pointer', fontWeight: '600'
  },
  fieldError: { color: 'red', fontSize: '12px', marginBottom: '8px', marginTop: '-4px' }
};

export default ProfileSetup;