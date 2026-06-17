import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Dashboard = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await authAPI.getProfile();
        if (data.success) setProfileData(data.user);
      } catch {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [logout, navigate]);

  const handleLogout = () => {
    logout();
    toast.success('You have been logged out.');
    navigate('/login');
  };

  const stats = [
    { label: 'Account Status', value: '✅ Active', color: '#10b981' },
    { label: 'Email Verified', value: '✅ Yes', color: '#6366f1' },
    { label: 'Member Since', value: profileData ? formatDate(profileData.createdAt) : '—', color: '#f59e0b' },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome banner */}
        <div className="dashboard-banner">
          <div className="banner-content">
            <div className="banner-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
              <p>{user?.email}</p>
            </div>
          </div>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Sign Out
          </button>
        </div>

        {loading ? (
          <div className="dashboard-loading">
            <div className="spinner-lg" />
            <p>Loading your profile…</p>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="stats-grid">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-card">
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-value" style={{ color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Profile card */}
            <div className="profile-card">
              <div className="profile-card-header">
                <h2>Account Details</h2>
                <span className="badge badge-verified">Verified ✅</span>
              </div>
              <div className="profile-fields">
                <ProfileField icon="👤" label="Full Name" value={profileData?.name} />
                <ProfileField icon="✉️" label="Email Address" value={profileData?.email} />
                <ProfileField icon="📅" label="Joined" value={formatDate(profileData?.createdAt)} />
                <ProfileField icon="🔐" label="Account ID" value={`#${profileData?.id?.slice(-8).toUpperCase()}`} />
              </div>
            </div>

            {/* Info box */}
            <div className="info-box">
              <div className="info-icon">🔒</div>
              <div>
                <strong>Protected Route</strong>
                <p>You're viewing this dashboard because your JWT token is valid and your email is verified. Only authenticated, verified users can reach this page.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ProfileField = ({ icon, label, value }) => (
  <div className="profile-field">
    <span className="field-icon">{icon}</span>
    <div>
      <span className="field-label">{label}</span>
      <span className="field-value">{value || '—'}</span>
    </div>
  </div>
);

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};

export default Dashboard;