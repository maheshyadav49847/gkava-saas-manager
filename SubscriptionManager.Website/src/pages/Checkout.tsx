import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import { getPlans, subscribeToPlan, type Plan } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldCheck, CheckCircle } from 'lucide-react';
import './Checkout.css';

export function Checkout() {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('planId');
  
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState('');
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPlan() {
      if (!planId) {
        setLoading(false);
        return;
      }
      try {
        const allPlans = await getPlans();
        const foundPlan = allPlans.find(p => p.id === planId);
        if (foundPlan) {
          setPlan(foundPlan);
        } else {
          setError("Plan not found.");
        }
      } catch (err) {
        setError("Failed to load plan details.");
      } finally {
        setLoading(false);
      }
    }
    loadPlan();
  }, [planId]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !planId) return;

    setSubscribing(true);
    setError('');

    try {
      const response = await subscribeToPlan(planId, token);
      
      if (response && response.url) {
        if (response.url.startsWith('sub_session_')) {
          // Cashfree session ID
          const script = document.createElement('script');
          script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
          script.onload = () => {
            try {
              const envMode = (response as any).environment === "PRODUCTION" ? "production" : "sandbox";
              const cashfree = (window as any).Cashfree({ mode: envMode });
              // Use subscriptionsCheckout instead of checkout!
              cashfree.subscriptionsCheckout({
                subsSessionId: response.url,
                redirectTarget: "_self"
              }).then((result: any) => {
                  if(result && result.error) {
                      setError(result.error.message || "Checkout error");
                      setSubscribing(false);
                  }
              }).catch((err: any) => {
                  setError("Checkout failed: " + err.message);
                  setSubscribing(false);
              });
            } catch (err: any) {
              console.error("Cashfree SDK error", err);
              setError("Cashfree SDK failed to initialize: " + (err.message || err));
              setSubscribing(false);
            }
          };
          script.onerror = () => {
            setError("Failed to load Cashfree SDK.");
            setSubscribing(false);
          };
          document.body.appendChild(script);
        } else if (response.url.startsWith('https://')) {
          window.location.href = response.url;
        } else {
          setError("Received invalid session ID from Cashfree.");
          setSubscribing(false);
        }
      } else {
        setError("Could not generate secure checkout link.");
        setSubscribing(false);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.Message || err.response?.data || "Payment failed. Please try again.";
      setError(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg));
      setSubscribing(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login?planId=" + planId} replace />;
  }

  if (loading) {
    return <div className="checkout-loading">Loading checkout details...</div>;
  }

  if (!planId || !plan) {
    return (
      <div className="checkout-container">
        <div className="checkout-error-state">
          <h2>Oops! We couldn't find that plan.</h2>
          <p>{error || "Please go back and select a valid plan."}</p>
          <button className="btn" onClick={() => navigate('/pricing')}>Back to Pricing</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Complete your purchase</h1>
        <p>You're almost there! Review your plan and enter your payment details.</p>
      </div>

      <div className="checkout-grid">
        <div className="checkout-form-section">
          <h2>Secure Checkout</h2>
          {error && <div className="checkout-error">{error}</div>}
          
          <p style={{ color: 'var(--color-text-light)', marginBottom: '32px', lineHeight: '1.6' }}>
            You will be redirected to our secure payment partner (Cashfree) to complete your purchase. 
            Cashfree supports Credit/Debit Cards, Net Banking, and local payment methods like UPI.
          </p>

          <form className="checkout-form" onSubmit={handleCheckout}>
            <button type="submit" className="btn checkout-submit-btn" disabled={subscribing}>
              {subscribing ? 'Generating Secure Link...' : 'Proceed to Payment (₹' + plan.monthlyPrice + ')'}
            </button>
          </form>

          <div className="checkout-security-badge">
            <Lock size={16} />
            <span>Payments are securely processed by Cashfree. We do not store your card details.</span>
          </div>
        </div>

        <div className="checkout-summary-section">
          <div className="summary-card">
            <h2>Order Summary</h2>
            <div className="summary-item">
              <span className="summary-plan-name">{plan.name}</span>
              <span className="summary-plan-price">₹{plan.monthlyPrice} /mo</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-total">
              <span>Total due today</span>
              <span>₹{plan.monthlyPrice}</span>
            </div>

            <ul className="summary-features">
              {plan.features.slice(0, 3).map((feature, i) => (
                <li key={i}>
                  <CheckCircle size={16} color="var(--color-primary)" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="summary-guarantee">
              <ShieldCheck size={24} color="var(--color-primary)" />
              <div>
                <strong>30-Day Money-Back Guarantee</strong>
                <p>If you're not satisfied, we'll refund you. No questions asked.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
