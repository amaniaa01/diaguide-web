import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Notifications = () => {
  const [readings, setReadings] = useState([]);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { checkNotifications(); }, []);

  const checkNotifications = async () => {
    try {
      const res = await API.get('/glucose');
      setReadings(res.data);
      if (res.data.length === 0) {
        return setNotification({ type: 'warning', message: '⚠️ You have not logged any glucose readings yet! Please log your first reading.' });
      }
      const lastReading = res.data[0];
      const hoursDiff = (new Date() - new Date(lastReading.createdAt)) / (1000 * 60 * 60);
      if (hoursDiff > 8) {
        setNotification({ type: 'warning', message: `⚠️ You have not logged your glucose in ${Math.round(hoursDiff)} hours! Please log a reading now.` });
      } else {
        setNotification({ type: 'success', message: `✅ Great job! Your last reading was ${Math.round(hoursDiff)} hours ago.` });
      }
    } catch (err) { console.error(err); }
  };

  const reminders = [
    { time: 'Morning', icon: '🌅', message: 'Log your fasting glucose when you wake up' },
    { time: 'Before Meals', icon: '🍽️', message: 'Check glucose before every meal' },
    { time: 'After Meals', icon: '⏱️', message: 'Log glucose 2 hours after eating' },
    { time: 'Before Exercise', icon: '🏃', message: 'Always check glucose before exercising' },
    { time: 'Bedtime', icon: '🌙', message: 'Log your bedtime glucose reading' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>DiaGuide</h1>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Dashboard</button>
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>🔔 Notifications & Reminders</h2>

        {notification && (
          <div style={{
            ...styles.notifCard,
            backgroundColor: notification.type === 'warning' ? '#FFFBEB' : '#F0FDF4',
            borderLeft: `4px solid ${notification.type === 'warning' ? '#ff7f50' : '#4ADE80'}`
          }}>
            <p style={styles.notifText}>{notification.message}</p>
            {notification.type === 'warning' && (
              <button style={styles.logBtn} onClick={() => navigate('/glucose')}>Log Reading Now</button>
            )}
          </div>
        )}

        <h3 style={styles.sectionTitle}>Daily Reminder Schedule</h3>
        <div style={styles.remindersGrid}>
          {reminders.map((r, i) => (
            <div key={i} style={styles.reminderCard}>
              <span style={styles.reminderIcon}>{r.icon}</span>
              <div>
                <p style={styles.reminderTime}>{r.time}</p>
                <p style={styles.reminderMsg}>{r.message}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 style={styles.sectionTitle}>Recent Activity</h3>
        <div style={styles.activityCard}>
          {readings.length === 0 ? (
            <p style={styles.empty}>No readings logged yet.</p>
          ) : (
            readings.slice(0, 5).map((r) => (
              <div key={r._id} style={styles.activityRow}>
                <span style={styles.activityValue}>{r.value} mg/dL</span>
                <span style={styles.activityContext}>{r.context}</span>
                <span style={styles.activityDate}>{new Date(r.createdAt).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>

        <div style={styles.disclaimer}>
          ⚕️ These are general reminders only. Follow your doctor's specific instructions for glucose monitoring.
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
  title: { color: '#ff7f50', marginBottom: '24px', fontWeight: '700' },
  notifCard: { padding: '20px', borderRadius: '12px', marginBottom: '32px' },
  notifText: { color: '#374151', fontSize: '16px', margin: '0 0 12px' },
  logBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(90deg, #ff7f50, #ff6030)',
    color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
  },
  sectionTitle: { color: '#ff7f50', marginBottom: '16px', fontWeight: '700' },
  remindersGrid: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' },
  reminderCard: {
    backgroundColor: 'white', padding: '16px', borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px'
  },
  reminderIcon: { fontSize: '32px' },
  reminderTime: { fontWeight: 'bold', color: '#ff7f50', margin: 0 },
  reminderMsg: { color: '#6B7280', margin: 0, fontSize: '14px' },
  activityCard: {
    backgroundColor: 'white', padding: '24px', borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px'
  },
  activityRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '12px 0', borderBottom: '1px solid #F3F4F6'
  },
  activityValue: { fontWeight: 'bold', color: '#111827' },
  activityContext: { color: '#6B7280' },
  activityDate: { color: '#9CA3AF', fontSize: '14px' },
  empty: { color: '#6B7280' },
  disclaimer: {
    backgroundColor: '#FFF5F0', padding: '16px', borderRadius: '8px',
    color: '#ff7f50', fontSize: '14px', border: '1px solid #FFD4C2'
  }
};

export default Notifications;