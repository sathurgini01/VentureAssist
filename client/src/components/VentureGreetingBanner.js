import React, { useMemo } from 'react';
import './VentureGreetingBanner.css';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'GOOD MORNING';
  if (hour < 18) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });
}

const VentureGreetingBanner = () => {
  const { user } = useAuth();
  const { mentorRequests, campaigns } = useAppContext();
  const greeting = getGreeting();
  const today = new Date();
  const userName = user?.name || 'User';
  const formattedDate = formatDate(today);
  const avatarInitial = String(userName).trim().charAt(0).toUpperCase() || 'U';

  const parseSessionDate = (entry) => {
    const raw = entry?.confirmedDateTime || entry?.preferredDateTime || entry?.preferredTime || null;
    if (!raw) return null;
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const activeCampaigns = useMemo(
    () => (campaigns || []).filter((campaign) => ['active', 'running'].includes(String(campaign?.status || '').toLowerCase())).length,
    [campaigns],
  );

  const activeSessions = useMemo(
    () => (mentorRequests || []).filter((request) => String(request?.status || '').toLowerCase() === 'accepted').length,
    [mentorRequests],
  );

  const pendingRequests = useMemo(
    () => (mentorRequests || []).filter((request) => String(request?.status || '').toLowerCase() === 'pending').length,
    [mentorRequests],
  );

  const nextSession = useMemo(() => {
    return (mentorRequests || [])
      .filter((request) => String(request?.status || '').toLowerCase() === 'accepted')
      .map((request) => ({ request, date: parseSessionDate(request) }))
      .filter((item) => item.date && item.date > today)
      .sort((left, right) => left.date - right.date)[0]?.date || null;
  }, [mentorRequests]);

  const stats = [
    { value: activeCampaigns, label: 'Active Campaigns' },
    { value: activeSessions, label: 'Active Sessions' },
    { value: pendingRequests, label: 'Pending Requests' },
  ];

  return (
    <div className="venture-greeting-banner">
      {/* Background blobs */}
      <div className="blob blob-top-right" />
      <div className="blob blob-bottom-center" />
      <div className="banner-content">
        {/* Left section */}
        <div className="banner-left">
          <div className="avatar">
            <span className="avatar-initial">{avatarInitial}</span>
          </div>
          <div className="user-info">
            <div className="greeting-label">{greeting}</div>
            <div className="user-name">{userName}</div>
            <div className="user-meta">
              <span className="workspace-label">Founder workspace</span>
              <span className="workspace-date">{formattedDate}</span>
            </div>
          </div>
        </div>
        {/* Center section */}
        <div className="banner-center">
          {stats.map((stat, i) => (
            <React.Fragment key={stat.label}>
              <div className="stat-pill">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
              {i < stats.length - 1 && <div className="stat-divider" />}
            </React.Fragment>
          ))}
        </div>
        {/* Right section */}
        <div className="banner-right">
          <div className="nudge-box">
            <span className="pulse-dot" />
            <div className="nudge-label">Next session</div>
            <div className="nudge-value">
              {nextSession ? `${nextSession.toLocaleDateString('en-US', { weekday: 'short' })} · ${nextSession.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'No upcoming session'}
            </div>
          </div>
          <div className="streak-box">
            <span className="star-icon">★</span>
            <span className="streak-label">7-day activity streak</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VentureGreetingBanner;
