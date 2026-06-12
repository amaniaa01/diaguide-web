import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [readings, setReadings] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchReadings();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/glucose/stats');
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchReadings = async () => {
    try {
      const res = await API.get('/glucose');
      setReadings(res.data.slice(0, 5));
    } catch (err) { console.error(err); }
  };

  const chartData = stats ? [
    { name: 'Within Range', value: stats.within },
    { name: 'Above Range', value: stats.above },
    { name: 'Below Range', value: stats.below }
  ] : [];

  const COLORS = ['#4ADE80', '#F87171', '#FBBF24'];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>DiaGuide</h1>
        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <div style={styles.nav}>
          <button style={styles.navBtn} onClick={() => navigate('/glucose')}>Log Glucose</button>
          <button style={styles.navBtn} onClick={() => navigate('/dose')}>Dose Calculator</button>
          <button style={styles.navBtn} onClick={() => navigate('/notifications')}>Notifications</button>
          <button style={styles.navBtn} onClick={() => navigate('/ai-guidance')}>AI Guidance</button>
          <button style={styles.navBtnOutline} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {menuOpen && (
        <div style={styles.mobileMenu}>
          <button style={styles.mobileBtn} onClick={() => { navigate('/glucose'); setMenuOpen(false); }}>🩸 Log Glucose</button>
          <button style={styles.mobileBtn} onClick={() => { navigate('/dose'); setMenuOpen(false); }}>💉 Dose Calculator</button>
          <button style={styles.mobileBtn} onClick={() => { navigate('/notifications'); setMenuOpen(false); }}>🔔 Notifications</button>
          <button style={styles.mobileBtn} onClick={() => { navigate('/ai-guidance'); setMenuOpen(false); }}>🤖 AI Guidance</button>
          <button style={{...styles.mobileBtn, background: 'rgba(255,255,255,0.1)'}} onClick={handleLogout}>🚪 Logout</button>
        </div>
      )}

      <div style={styles.content}>
        <h2 style={styles.welcome}>Welcome, {user?.name} 👋</h2>

        <div style={styles.cardRow}>
          <div style={{...styles.statCard, borderLeft: '4px solid #4ADE80'}}>
            <p style={styles.statLabel}>Within Range</p>
            <p style={styles.statValue}>{stats?.within || 0}%</p>
          </div>
          <div style={{...styles.statCard, borderLeft: '4px solid #F87171'}}>
            <p style={styles.statLabel}>Above Range</p>
            <p style={styles.statValue}>{stats?.above || 0}%</p>
          </div>
          <div style={{...styles.statCard, borderLeft: '4px solid #FBBF24'}}>
            <p style={styles.statLabel}>Below Range</p>
            <p style={styles.statValue}>{stats?.below || 0}%</p>
          </div>
          <div style={{...styles.statCard, borderLeft: '4px solid #ff7f50'}}>
            <p style={styles.statLabel}>Total Readings</p>
            <p style={styles.statValue}>{stats?.total || 0}</p>
          </div>
        </div>

        <div style={styles.row}>
          {stats?.total > 0 && (
            <div style={styles.chartCard}>
              <h3 style={styles.cardTitle}>Glucose Range Overview</h3>
              <PieChart width={300} height={340}>
                <Pie data={chartData} cx={150} cy={130} innerRadius={60}
                  outerRadius={100} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend verticalAlign="bottom" height={60} wrapperStyle={{paddingTop: '20px'}} />
              </PieChart>
            </div>
          )}

          <div style={styles.tableCard}>
            <h3 style={styles.cardTitle}>Recent Readings</h3>
            {readings.length === 0 ? (
              <p style={styles.empty}>No readings yet. <span style={{color: '#ff7f50', cursor: 'pointer'}}
                onClick={() => navigate('/glucose')}>Log your first reading!</span></p>
            ) : (
              readings.map((r) => (
                <div key={r._id} style={styles.readingRow}>
                  <span style={styles.readingValue}>{r.value} mg/dL</span>
                  <span style={styles.readingContext}>{r.context}</span>
                  <span style={styles.readingDate}>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            )}
            <button style={styles.viewBtn} onClick={() => navigate('/glucose')}>
              View All & Add Reading
            </button>
          </div>
        </div>

        <div style={styles.disclaimer}>
          ⚕️ DiaGuide is a decision-support tool only. Always consult your doctor before adjusting insulin doses.
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: "'Segoe UI', Arial, sans-serif" },
  header: {
    background: 'linear-gradient(90deg, #1E3A5F, #2d5a8e)',
    padding: '16px 24px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px'
  },
  logo: { color: '#ff7f50', fontSize: '24px', margin: 0, fontWeight: '800' },
  hamburger: {
    display: 'none', backgroundColor: 'transparent',
    border: '1px solid #ff7f50', color: '#ff7f50',
    fontSize: '24px', padding: '4px 10px', borderRadius: '8px', cursor: 'pointer'
  },
  nav: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  navBtn: {
    padding: '8px 12px', backgroundColor: '#ff7f50',
    color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500'
  },
  navBtnOutline: {
    padding: '8px 12px', backgroundColor: 'transparent',
    color: '#ff7f50', border: '1px solid #ff7f50', borderRadius: '8px', cursor: 'pointer', fontSize: '13px'
  },
  mobileMenu: {
    background: 'linear-gradient(90deg, #1E3A5F, #2d5a8e)',
    padding: '8px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px'
  },
  mobileBtn: {
    padding: '12px 16px', backgroundColor: '#ff7f50',
    color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', textAlign: 'left'
  },
  content: { padding: '24px 16px' },
  welcome: { color: '#1E3A5F', marginBottom: '16px', fontWeight: '700' },
  cardRow: { display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' },
  statCard: {
    backgroundColor: 'white', padding: '16px', borderRadius: '12px',
    flex: 1, minWidth: '120px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  statLabel: { color: '#6B7280', fontSize: '13px', margin: 0 },
  statValue: { color: '#111827', fontSize: '24px', fontWeight: 'bold', margin: '4px 0 0' },
  row: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  chartCard: {
    backgroundColor: 'white', padding: '16px', borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflowX: 'auto'
  },
  tableCard: {
    backgroundColor: 'white', padding: '16px', borderRadius: '12px',
    flex: 1, minWidth: '280px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  cardTitle: { color: '#ff7f50', marginBottom: '12px', fontWeight: '700' },
  readingRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '10px 0', borderBottom: '1px solid #F3F4F6', flexWrap: 'wrap', gap: '4px'
  },
  readingValue: { fontWeight: 'bold', color: '#111827' },
  readingContext: { color: '#6B7280' },
  readingDate: { color: '#9CA3AF', fontSize: '13px' },
  empty: { color: '#6B7280' },
  viewBtn: {
    marginTop: '12px', padding: '10px 20px',
    background: 'linear-gradient(90deg, #ff7f50, #ff6030)',
    color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
  },
  disclaimer: {
    marginTop: '16px', padding: '12px',
    backgroundColor: '#FFF5F0', borderRadius: '8px',
    color: '#ff7f50', fontSize: '13px', border: '1px solid #FFD4C2'
  }
};

export default Dashboard;