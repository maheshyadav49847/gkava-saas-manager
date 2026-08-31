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
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
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


  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleString('en-IN', { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="dashboard-layout">
      {/* Header Banner */}
      <div className="dashboard-header-banner hide-on-print">
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
        <div className="dashboard-container hide-on-print" style={{ marginTop: '2rem' }}>
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

      <div className="dashboard-container hide-on-print" style={{ paddingTop: '1.5rem' }}>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.invoices.map((inv: any) => (
                    <tr key={inv.id}>
                      <td className="inv-number">
                        {inv.invoiceNumber || inv.id.split('-')[0]}
                      </td>
                      <td className="inv-date">
                        {formatDate(inv.invoiceDate)}
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
                      <td>
                        <button 
                          onClick={() => setSelectedInvoice(inv)}
                          style={{ background: '#F1F5F9', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', color: '#0F172A', fontWeight: 500, fontSize: '0.85rem' }}
                        >
                          View / Download
                        </button>
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

      {/* Invoice Modal Overlay */}
      {selectedInvoice && (
        <div className="modal-overlay hide-on-print" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
          <div className="modal-content" style={{ background: '#FFFFFF', borderRadius: '12px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', position: 'relative' }}>
            <button 
              onClick={() => setSelectedInvoice(null)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
            >
              <XCircle size={24} />
            </button>
            
            <div id="invoice-print-area">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #E2E8F0', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ margin: 0, color: '#0F172A', fontSize: '1.8rem', letterSpacing: '-0.02em' }}>INVOICE</h2>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#64748B', fontFamily: 'monospace', fontSize: '1rem' }}>#{selectedInvoice.invoiceNumber || selectedInvoice.id.split('-')[0]}</p>
                  <span className={`status-badge ${selectedInvoice.status.toLowerCase()}`} style={{ marginTop: '0.5rem' }}>
                    {getStatusIcon(selectedInvoice.status)} {selectedInvoice.status}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ margin: 0, color: '#635BFF', fontSize: '1.25rem' }}>{data?.companyInfo?.companyName || "SAAS Platform Inc."}</h3>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#64748B', fontSize: '0.9rem', whiteSpace: 'pre-line' }}>{data?.companyInfo?.companyAddress || "123 Tech Park, Phase 1\nSan Francisco, CA 94107"}</p>
                  {data?.companyInfo?.gstNumber && (
                    <p style={{ margin: '0.25rem 0 0 0', color: '#64748B', fontSize: '0.9rem', fontWeight: 600 }}>GSTIN: {data.companyInfo.gstNumber}</p>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#0F172A', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Billed To</h4>
                  <p style={{ margin: 0, color: '#0F172A', fontWeight: 500 }}>{data?.profile?.name || userName}</p>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#64748B', fontSize: '0.9rem' }}>{data?.profile?.email}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#0F172A', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Invoice Date</h4>
                  <p style={{ margin: 0, color: '#0F172A', fontWeight: 500 }}>{formatDate(selectedInvoice.invoiceDate)}</p>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                <thead>
                  <tr>
                    <th style={{ background: '#F8FAFC', padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>Description</th>
                    <th style={{ background: '#F8FAFC', padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>Qty</th>
                    <th style={{ background: '#F8FAFC', padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.lineItems && selectedInvoice.lineItems.length > 0 ? (
                    selectedInvoice.lineItems.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #F1F5F9', color: '#0F172A', fontWeight: 500 }}>{item.description}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #F1F5F9', color: '#64748B', textAlign: 'center' }}>{item.quantity}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #F1F5F9', color: '#0F172A', textAlign: 'right' }}>{selectedInvoice.amount === 0 ? 'Free' : `${selectedInvoice.currency} ${item.amount.toFixed(2)}`}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td style={{ padding: '1rem', borderBottom: '1px solid #F1F5F9', color: '#0F172A', fontWeight: 500 }}>Subscription Plan</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid #F1F5F9', color: '#64748B', textAlign: 'center' }}>1</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid #F1F5F9', color: '#0F172A', textAlign: 'right' }}>{selectedInvoice.amount === 0 ? 'Free' : `${selectedInvoice.currency} ${selectedInvoice.amount.toFixed(2)}`}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '300px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #F1F5F9', color: '#64748B' }}>
                    <span>Subtotal</span>
                    <span>{selectedInvoice.amount === 0 ? 'Free' : `${selectedInvoice.currency} ${selectedInvoice.amount.toFixed(2)}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #F1F5F9', color: '#64748B' }}>
                    <span>Tax (0%)</span>
                    <span>{selectedInvoice.amount === 0 ? 'Free' : `${selectedInvoice.currency} 0.00`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
                    <span>Total Paid</span>
                    <span>{selectedInvoice.amount === 0 ? 'Free' : `${selectedInvoice.currency} ${selectedInvoice.amount.toFixed(2)}`}</span>
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.85rem' }}>
                <p style={{ margin: '0 0 0.5rem 0' }}><strong>Payment Method:</strong> {selectedInvoice.paymentMethod} {selectedInvoice.paymentDetails && `(${selectedInvoice.paymentDetails})`}</p>
                <p style={{ margin: 0 }}>Thank you for your business. For any questions, contact support@saasplatform.com.</p>
              </div>
            </div>

            <div className="hide-on-print" style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button 
                onClick={handlePrint}
                style={{ background: '#635BFF', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 6px rgba(99, 91, 255, 0.2)' }}
              >
                Download as PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .modal-overlay, .modal-content {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              padding: 0 !important;
              background: white !important;
            }
            #invoice-print-area, #invoice-print-area * {
              visibility: visible;
            }
            #invoice-print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 2cm !important;
            }
            .hide-on-print {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}
