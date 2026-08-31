import { useEffect, useState } from 'react';
import { getSubscriberDashboard } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  Package, Activity, CheckCircle2, XCircle, CreditCard, Receipt, Loader2
} from 'lucide-react';
import './Dashboard.css';

export function SubscriberBilling() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
            <div onClick={() => window.location.href = '/dashboard'} style={{ paddingBottom: '1rem', color: '#64748B', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={18} /> Subscriptions
            </div>
            <div style={{ paddingBottom: '1rem', borderBottom: '2px solid #635BFF', color: '#635BFF', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Receipt size={18} /> Billing & Invoices
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-container" style={{ paddingTop: '1.5rem' }}>
        {/* Billing & Invoices Section */}
        <div className="dashboard-section-title" id="billing" style={{ marginTop: '2rem' }}>
          <Receipt size={20} color="#635BFF" />
          <span>Billing History</span>
        </div>

        <div className="dashboard-card">
          {data?.invoices && data.invoices.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="billing-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  {data.invoices.map((inv: any) => (
                    <tr key={inv.id}>
                      <td className="inv-number">
                        {inv.invoiceNumber || inv.id.split('-')[0]}
                      </td>
                      <td className="inv-date">
                        {new Date(inv.invoiceDate).toLocaleDateString()}
                      </td>
                      <td className="inv-amount">
                        {inv.amount === 0 ? 'Free' : `${inv.currency} ${inv.amount.toFixed(2)}`}
                      </td>
                      <td>
                        <span className={`status-badge ${inv.status.toLowerCase()}`}>
                          {getStatusIcon(inv.status)}
                          {inv.status}
                        </span>
                      </td>
                      <td>
                        {inv.paymentMethod ? (
                          <div className="inv-method">
                            <span className="inv-method-main">
                              {inv.paymentMethod === 'card' ? <CreditCard size={14} style={{display:'inline', marginRight:'4px'}}/> : ''}
                              {inv.paymentMethod}
                            </span>
                            {inv.paymentDetails && inv.paymentDetails !== inv.paymentMethod && (
                              <span className="inv-method-sub">{inv.paymentDetails}</span>
                            )}
                          </div>
                        ) : (
                          <span className="inv-method-sub">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '3rem 2rem' }}>
              <Receipt size={40} />
              <p>No billing history available.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
