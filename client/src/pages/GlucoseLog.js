import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const GlucoseLog = () => {
  const [readings, setReadings] = useState([]);
  const [formData, setFormData] = useState({ value: '', context: 'Before Meal', notes: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchReadings(); }, []);

  const fetchReadings = async () => {
    try {
      const res = await API.get('/glucose');
      setReadings(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/glucose', formData);
      setSuccess('Reading logged successfully! ✅');
      setFormData({ value: '', context: 'Before Meal', notes: '' });
      fetchReadings();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/glucose/${id}`);
      fetchReadings();
    } catch (err) { console.error(err); }
  };

  const getValueColor = (value) => {
    if (value < 70) return '#FBBF24';
    if (value > 180) return '#F87171';
    return '#4ADE80';
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
            <h2 style={styles.title}>🩸 Log Blood Glucose</h2>
            {success && <p style={styles.success}>{success}</p>}
            <form onSubmit={handleSubmit}> 
              <label style={styles.label}>Glucose Value (mg/dL)</label>
              <input style={styles.input} type="number" placeholder="e.g. 120"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})} required />
              <label style={styles.label}>Context</label>
              <select style={styles.input} value={formData.context}
                onChange={(e) => setFormData({...formData, context: e.target.value})}>
                <option>Before Meal</option>
                <option>After Meal</option>
                <option>Fasting</option>
                <option>Exercise</option>
              </select>
              <label style={styles.label}>Notes (optional)</label>
              <input style={styles.input} type="text" placeholder="Any notes..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})} />
              <button style={styles.button} type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Log Reading'}
              </button>
            </form>
          </div>

          <div style={styles.historyCard}>
            <h2 style={styles.title}>Reading History</h2>
            {readings.length === 0 ? (
              <p style={styles.empty}>No readings yet. Log your first reading!</p>
            ) : (
              readings.map((r) => (
                <div key={r._id} style={styles.readingRow}>
                  <div style={{...styles.valueBadge, backgroundColor: getValueColor(r.value)}}>
                    {r.value} mg/dL
                  </div>
                  <div style={styles.readingInfo}>
                    <p style={styles.readingContext}>{r.context}</p>
                    <p style={styles.readingDate}>{new Date(r.createdAt).toLocaleString()}</p>
                    {r.notes && <p style={styles.readingNotes}>{r.notes}</p>}
                  </div>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(r._id)}>✕</button>
                </div>
              ))
            )}
          </div>
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
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', width: '300px'
  },
  historyCard: {
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
  success: {
    color: '#16A34A', backgroundColor: '#F0FDF4',
    padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px'
  },
  readingRow: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px 0', borderBottom: '1px solid #F3F4F6'
  },
  valueBadge: {
    padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold',
    fontSize: '14px', color: 'white', minWidth: '90px', textAlign: 'center'
  },
  readingInfo: { flex: 1 },
  readingContext: { margin: 0, fontWeight: '500', color: '#374151' },
  readingDate: { margin: 0, fontSize: '12px', color: '#9CA3AF' },
  readingNotes: { margin: 0, fontSize: '13px', color: '#6B7280' },
  deleteBtn: { background: 'none', border: 'none', color: '#F87171', cursor: 'pointer', fontSize: '16px' },
  empty: { color: '#6B7280' }
};

export default GlucoseLog;