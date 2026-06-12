import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const DoseCalculator = () => {
  const [formData, setFormData] = useState({ foodName: '', quantity: '', currentGlucose: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await API.post('/dose/calculate', formData);
      setResult(res.data);
    } catch (err) {
      setError('Calculation failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>DiaGuide</h1>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Dashboard</button>
      </div>

      <div style={styles.content}>
        <div style={styles.row}>
          <div style={styles.card}>
            <h2 style={styles.title}>💉 Insulin Dose Calculator</h2>
            <form onSubmit={handleSubmit}>
              <label style={styles.label}>Food Name</label>
              <input style={styles.input} type="text" placeholder="e.g. rice, bread, apple"
                value={formData.foodName}
                onChange={(e) => setFormData({...formData, foodName: e.target.value})} required />
              <label style={styles.label}>Quantity (grams)</label>
              <input style={styles.input} type="number" placeholder="e.g. 150"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})} required />
              <label style={styles.label}>Current Blood Glucose (mg/dL)</label>
              <input style={styles.input} type="number" placeholder="e.g. 140"
                value={formData.currentGlucose}
                onChange={(e) => setFormData({...formData, currentGlucose: e.target.value})} required />
              <button style={styles.button} type="submit" disabled={loading}>
                {loading ? 'Calculating...' : 'Calculate Dose'}
              </button>
            </form>
            {error && <p style={styles.error}>{error}</p>}
          </div>

          {result && (
            <div style={styles.resultCard}>
              <h2 style={styles.title}>📊 Calculation Result</h2>
              {result.warning && <div style={styles.warning}>⚠️ {result.warning}</div>}
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>Food</span>
                <span style={styles.resultValue}>{result.foodName} ({result.quantity}g)</span>
              </div>
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>Carbs per 100g</span>
                <span style={styles.resultValue}>{result.carbsPer100g}g</span>
              </div>
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>Total Carbs</span>
                <span style={styles.resultValue}>{result.totalCarbs}g</span>
              </div>
              <hr style={{margin: '16px 0', borderColor: '#F3F4F6'}} />
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>Meal Insulin</span>
                <span style={styles.resultValue}>{result.mealInsulin} units</span>
              </div>
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>Correction Dose</span>
                <span style={styles.resultValue}>{result.correctionDose} units</span>
              </div>
              <div style={styles.totalBox}>
                <span style={styles.totalLabel}>Total Dose</span>
                <span style={styles.totalValue}>{result.totalDose} units</span>
              </div>
              <div style={styles.disclaimer}>⚕️ {result.disclaimer}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: "'Segoe UI', Arial, sans-serif" },
  header: {
    background: 'linear-gradient(90deg, #1E3A5F, #2d5a8e)',
    padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  logo: { color: '#ff7f50', fontSize: '24px', margin: 0, fontWeight: '800' },
  backBtn: {
    padding: '8px 16px', backgroundColor: 'transparent',
    color: '#ff7f50', border: '1px solid #ff7f50', borderRadius: '8px', cursor: 'pointer'
  },
  content: { padding: '32px' },
  row: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
  card: {
    backgroundColor: 'white', padding: '24px', borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', width: '320px'
  },
  resultCard: {
    backgroundColor: 'white', padding: '24px', borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flex: 1
  },
  title: { color: '#ff7f50', marginBottom: '20px', fontWeight: '700' },
  label: { display: 'block', color: '#374151', marginBottom: '4px', fontWeight: '500', fontSize: '14px' },
  input: {
    width: '100%', padding: '10px', marginBottom: '16px', borderRadius: '8px',
    border: '1px solid #E5E7EB', fontSize: '15px', boxSizing: 'border-box',
    fontFamily: "'Segoe UI', Arial, sans-serif"
  },
  button: {
    width: '100%', padding: '12px',
    background: 'linear-gradient(90deg, #ff7f50, #ff6030)',
    color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: '600'
  },
  error: { color: 'red', marginTop: '12px', fontSize: '14px' },
  warning: {
    backgroundColor: '#FFFBEB', border: '1px solid #FDE68A',
    borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#B45309', fontSize: '14px'
  },
  resultRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '8px 0', borderBottom: '1px solid #F3F4F6'
  },
  resultLabel: { color: '#6B7280' },
  resultValue: { fontWeight: '500', color: '#111827' },
  totalBox: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: 'linear-gradient(90deg, #ff7f50, #ff6030)',
    padding: '16px', borderRadius: '8px', margin: '16px 0'
  },
  totalLabel: { color: 'white', fontSize: '16px', fontWeight: '600' },
  totalValue: { color: 'white', fontSize: '28px', fontWeight: 'bold' },
  disclaimer: {
    backgroundColor: '#FFF5F0', padding: '12px', borderRadius: '8px',
    color: '#ff7f50', fontSize: '13px', border: '1px solid #FFD4C2'
  }
};

export default DoseCalculator;