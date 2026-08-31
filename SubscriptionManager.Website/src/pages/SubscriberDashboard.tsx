import { useEffect, useState } from 'react';
import { getSubscriberDashboard, unsubscribeFromPlan } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './Dashboard.css';

export function SubscriberDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token, isAuthenticated } = useAuth();

  const loadData = async () => {
    if (!token) return;
    try {
      const result = await getSubscriberDashboard(token);
      setData(result);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleUnsubscribe = async (subId: string) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to cancel this subscription?")) return;

    setLoading(true);
    try {
      await unsubscribeFromPlan(subId, token);
      alert("Successfully unsubscribed.");
      await loadData();
    } catch (err: any) {
      const errMsg = err.response?.data?.Message || err.response?.data || "Failed to unsubscribe.";
      alert(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg));
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div className="dashboard-loading">Loading your dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {data?.profile?.name}</h1>
        <p>Manage your subscriptions and integrations.</p>
      </div>

      <div className="dashboard-content">
        <section className="dashboard-section">
          <h2>Profile Details</h2>
          <div className="card">
            <p><strong>Email:</strong> {data?.profile?.email}</p>
            <p><strong>Phone:</strong> {data?.profile?.phone || 'N/A'}</p>
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Your Subscriptions</h2>
          {data?.subscriptions && data.subscriptions.length > 0 ? (
            <div className="subscription-grid">
              {data.subscriptions.map((sub: any) => (
                <div key={sub.id} className="card subscription-card">
                  <div className="sub-header">
                    <h3>{sub.applicationName}</h3>
                    <span className={`status-badge status-${sub.status.toLowerCase()}`}>
                      {sub.status}
                    </span>
                  </div>
                  <p className="plan-name">{sub.planName}</p>
                  
                  <div className="sub-details">
                    <p><strong>Start Date:</strong> {new Date(sub.startDate).toLocaleDateString()}</p>
                    <p><strong>End Date:</strong> {new Date(sub.endDate).toLocaleDateString()}</p>
                  </div>

                  <div className="integration-details">
                    <h4>Integration Info</h4>
                    <p><strong>App Key:</strong> <code>{sub.applicationKey}</code></p>
                    <p><strong>Website URL:</strong> {sub.websiteUrl ? <a href={sub.websiteUrl} target="_blank" rel="noopener noreferrer">{sub.websiteUrl}</a> : 'N/A'}</p>
                  </div>

                  {sub.status.toLowerCase() === 'active' && !sub.cancelAtPeriodEnd && (
                    <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                      <button 
                        onClick={() => handleUnsubscribe(sub.id)}
                        className="btn"
                        style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, width: '100%' }}
                      >
                        Cancel Subscription
                      </button>
                    </div>
                  )}
                  {sub.status.toLowerCase() === 'active' && sub.cancelAtPeriodEnd && (
                    <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                      <p style={{ color: '#ef4444', fontWeight: 500, margin: 0, textAlign: 'center', fontSize: '0.9rem' }}>
                        Cancels at period end
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="card empty-state">
              <p>You don't have any active subscriptions yet.</p>
              <a href="/pricing" className="btn btn-primary">Browse Plans</a>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
