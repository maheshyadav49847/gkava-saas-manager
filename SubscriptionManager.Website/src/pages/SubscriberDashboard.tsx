import { useEffect, useState } from 'react';
import { getSubscriberDashboard, unsubscribeFromPlan } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  Package, Calendar, Activity, Link as LinkIcon, 
  Copy, CheckCircle2, XCircle, Receipt, Loader2, Eye, EyeOff, Info
} from 'lucide-react';
import './Dashboard.css';

export function SubscriberDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card'|'list'>('card');
  const { token, isAuthenticated, userName } = useAuth();

  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskKey = (key: string) => {
    if (!key) return '';
    return 'sk_live_' + '•'.repeat(24);
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleString('en-IN', { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

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


  const filteredSubs = data?.subscriptions?.filter((s: any) => 
    s.applicationName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.planName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div className="dashboard-section-title" style={{ margin: 0 }}>
            <Package size={20} color="#635BFF" />
            <span>Your Subscriptions</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Search apps or plans..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.9rem', width: '250px' }}
            />
            <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '8px', padding: '0.25rem' }}>
              <button 
                onClick={() => setViewMode('card')}
                style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer', background: viewMode === 'card' ? '#FFFFFF' : 'transparent', boxShadow: viewMode === 'card' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none', fontWeight: 500, color: viewMode === 'card' ? '#0F172A' : '#64748B' }}
              >
                Card
              </button>
              <button 
                onClick={() => setViewMode('list')}
                style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer', background: viewMode === 'list' ? '#FFFFFF' : 'transparent', boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none', fontWeight: 500, color: viewMode === 'list' ? '#0F172A' : '#64748B' }}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {filteredSubs.length > 0 ? (
          viewMode === 'card' ? (
            <div className="subscription-grid">
              {filteredSubs.map((sub: any) => (
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
                      <span className="meta-label"><Calendar size={14} /> Start</span>
                      <span className="meta-value">{formatDate(sub.startDate)}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label"><Calendar size={14} /> End</span>
                      <span className="meta-value">{formatDate(sub.endDate)}</span>
                    </div>
                  </div>

                  <div className="sub-divider" />

                  <div className="sub-integration">
                    <div className="sub-integration-title">Integration Credentials</div>
                    
                    <div className="key-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        userSelect: 'all', 
                        fontSize: visibleKeys[sub.id] ? '0.75rem' : '0.85rem',
                        wordBreak: 'break-all',
                        flex: 1,
                        minWidth: 0
                      }}>
                        {visibleKeys[sub.id] ? sub.applicationKey : maskKey(sub.applicationKey)}
                      </span>
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <button 
                          className="copy-btn" 
                          onClick={() => toggleKeyVisibility(sub.id)}
                          title={visibleKeys[sub.id] ? "Hide App Key" : "View App Key"}
                        >
                          {visibleKeys[sub.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button 
                          className="copy-btn" 
                          onClick={() => copyToClipboard(sub.applicationKey, sub.id)}
                          title="Copy App Key"
                        >
                          {copiedKey === sub.id ? <CheckCircle2 size={16} color="#059669" /> : <Copy size={16} />}
                        </button>
                      </div>
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
            <div className="dashboard-card" style={{ padding: 0, overflowX: 'auto' }}>
              <table className="billing-table">
                <thead>
                  <tr>
                    <th>App & Plan</th>
                    <th>Status</th>
                    <th>Valid Period</th>
                    <th>App Key</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubs.map((sub: any) => (
                    <tr key={sub.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0F172A' }}>{sub.applicationName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#635BFF' }}>{sub.planName}</div>
                      </td>
                      <td>
                        <span className={`status-badge ${sub.status.toLowerCase()}`}>
                          {getStatusIcon(sub.status)}
                          {sub.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        <div>{formatDate(sub.startDate)}</div>
                        <div style={{ color: '#64748B' }}>to {formatDate(sub.endDate)}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', background: '#F1F5F9', padding: '4px 8px', borderRadius: '4px' }}>
                            {visibleKeys[sub.id] ? sub.applicationKey : maskKey(sub.applicationKey)}
                          </span>
                          <button onClick={() => toggleKeyVisibility(sub.id)} className="copy-btn">
                            {visibleKeys[sub.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <button onClick={() => copyToClipboard(sub.applicationKey, sub.id)} className="copy-btn">
                            {copiedKey === sub.id ? <CheckCircle2 size={14} color="#059669" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </td>
                      <td>
                        {sub.status.toLowerCase() === 'active' && !sub.cancelAtPeriodEnd && (
                          <button onClick={() => handleUnsubscribe(sub.id)} style={{ background:'none', border:'none', color:'#DC2626', cursor:'pointer', fontWeight:500, fontSize:'0.85rem' }}>Cancel</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
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
