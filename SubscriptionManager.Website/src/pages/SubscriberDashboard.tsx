import { useEffect, useState } from 'react';
import { getSubscriberDashboard, unsubscribeFromPlan } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  Package, Calendar, Activity, Link as LinkIcon, 
  Copy, CheckCircle2, XCircle, Receipt, Loader2, Info
} from 'lucide-react';
import './Dashboard.css';

export function SubscriberDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { token, isAuthenticated, userName } = useAuth();

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

  useEffect(() => {
    if (window.location.hash === '#billing' && data) {
      setTimeout(() => {
        document.getElementById('billing')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [window.location.hash, data]);

  const handleUnsubscribe = async (subId: string) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to cancel this subscription? It will remain active until the end of the current billing period.")) return;

    setLoading(true);
    try {
      await unsubscribeFromPlan(subId, token);
      await loadData();
    } catch (err: any) {
      const errMsg = err.response?.data?.Message || err.response?.data || "Failed to unsubscribe.";
      alert(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg));
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading && !data) {
    return (
      <div className="dashboard-layout loader-container">
        <Loader2 size={40} className="spinner" />
        <p>Loading your workspace...</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return <CheckCircle2 size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      default: return <Activity size={14} />;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Header Banner */}
      <div className="dashboard-header-banner">
        <div className="dashboard-container dashboard-title-row">
          <div className="dashboard-avatar-large">
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="dashboard-header-text">
            <h1>Welcome back, {data?.profile?.name || userName}</h1>
            <p>Manage your active subscriptions, integration keys, and billing history.</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="dashboard-container" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #E2E8F0' }}>
            <div style={{ paddingBottom: '1rem', borderBottom: '2px solid #635BFF', color: '#635BFF', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={18} /> Subscriptions
            </div>
            <div onClick={() => window.location.href = '/billing'} style={{ paddingBottom: '1rem', color: '#64748B', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Receipt size={18} /> Billing & Invoices
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-container" style={{ paddingTop: '1.5rem' }}>
        
        {/* Active Subscriptions Section */}
        <div className="dashboard-section-title">
          <Package size={20} color="#635BFF" />
          <span>Your Subscriptions</span>
        </div>

        {data?.subscriptions && data.subscriptions.length > 0 ? (
          <div className="subscription-grid">
            {data.subscriptions.map((sub: any) => (
              <div key={sub.id} className="sub-card">
                <div className="sub-header">
                  <div className="sub-app-info">
                    <div className="app-icon">
                      <Package size={20} />
                    </div>
                    <div>
                      <h3 className="sub-app-name">{sub.applicationName}</h3>
                      <p className="sub-plan-name">{sub.planName}</p>
                    </div>
                  </div>
                  <span className={`status-badge ${sub.status.toLowerCase()}`}>
                    {getStatusIcon(sub.status)}
                    {sub.status}
                  </span>
                </div>

                <div className="sub-meta">
                  <div className="meta-row">
                    <span className="meta-label"><Calendar size={14} /> Start Date</span>
                    <span className="meta-value">{new Date(sub.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label"><Calendar size={14} /> End Date</span>
                    <span className="meta-value">{new Date(sub.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="sub-divider" />

                <div className="sub-integration">
                  <div className="sub-integration-title">Integration Credentials</div>
                  
                  <div className="key-box">
                    <span>{sub.applicationKey}</span>
                    <button 
                      className="copy-btn" 
                      onClick={() => copyToClipboard(sub.applicationKey, sub.id)}
                      title="Copy App Key"
                    >
                      {copiedKey === sub.id ? <CheckCircle2 size={16} color="#059669" /> : <Copy size={16} />}
                    </button>
                  </div>
                  
                  {sub.websiteUrl && (
                    <div className="key-box" style={{ marginTop: '0.5rem', background: 'transparent', border: 'none', padding: 0 }}>
                      <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <LinkIcon size={14} /> 
                        <a href={sub.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#635BFF', textDecoration: 'none' }}>
                          {sub.websiteUrl.replace(/^https?:\/\//, '')}
                        </a>
                      </span>
                    </div>
                  )}
                </div>

                <div className="sub-actions">
                  {sub.status.toLowerCase() === 'active' && !sub.cancelAtPeriodEnd && (
                    <button 
                      onClick={() => handleUnsubscribe(sub.id)}
                      className="btn-cancel"
                    >
                      Cancel Subscription
                    </button>
                  )}
                  {sub.status.toLowerCase() === 'active' && sub.cancelAtPeriodEnd && (
                    <div className="cancel-notice">
                      <Info size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                      Cancels at period end
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dashboard-card empty-state">
            <Package size={48} />
            <p>You don't have any active subscriptions yet.</p>
            <a href="/pricing" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
              Browse Plans
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
