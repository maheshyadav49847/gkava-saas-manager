import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Zap, Layers, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginSubscriber } from '../services/api';
import './Auth.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await loginSubscriber({ email, password });
      login(response.token);
      
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.has('planId')) {
        navigate(`/checkout${location.search}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-content">
          <h1>Welcome back to GKava</h1>
          <p>Manage your SaaS subscriptions, monitor integrations, and scale your business from one unified dashboard.</p>
          
          <div className="auth-hero-features">
            <div className="auth-feature">
              <div className="icon-container">
                <ShieldCheck size={24} />
              </div>
              <div>
                <strong>Secure Access</strong>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Enterprise-grade security for your data.</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="icon-container">
                <Zap size={24} />
              </div>
              <div>
                <strong>Fast Integrations</strong>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Connect your apps in seconds.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon-wrapper">
              <Layers size={32} />
            </div>
            <h2>Subscriber Login</h2>
            <p className="auth-subtitle">Sign in to your account to continue</p>
          </div>
          
          {error && (
            <div className="auth-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="you@example.com"
                  required 
                />
                <Mail className="input-icon" size={20} />
              </div>
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  required 
                />
                <Lock className="input-icon" size={20} />
              </div>
            </div>
            
            <button type="submit" className="btn auth-submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </form>
          
          <p className="auth-link">
            Don't have an account? 
            <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
