import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, Layers, AlertCircle, CheckCircle } from 'lucide-react';
import { registerSubscriber, getCountries } from '../services/api';
import type { CountryDto } from '../services/api';

import './Auth.css';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [countries, setCountries] = useState<CountryDto[]>([]);

  useEffect(() => {
    getCountries().then(setCountries).catch(console.error);
  }, []);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await registerSubscriber({ name, email, phoneCountryCode, phone, password });
      navigate(`/login${location.search}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-content">
          <h1>Start your journey with GKava</h1>
          <p>Create an account today to get access to powerful tools that help you manage and scale your subscription business effortlessly.</p>
          
          <div className="auth-hero-features">
            <div className="auth-feature">
              <div className="icon-container">
                <CheckCircle size={24} />
              </div>
              <div>
                <strong>Seamless Integration</strong>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Easily connect APIs via Webhooks.</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="icon-container">
                <Layers size={24} />
              </div>
              <div>
                <strong>Unified Dashboard</strong>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>All your apps in one single place.</p>
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
            <h2>Create Account</h2>
            <p className="auth-subtitle">Join us and start managing subscriptions</p>
          </div>
          
          {error && (
            <div className="auth-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="John Doe"
                  required 
                />
                <User className="input-icon" size={20} />
              </div>
            </div>
            
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
              <label>Phone Number</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    name="phoneCountryCode"
                    id="phoneCountryCode"
                    value={phoneCountryCode}
                    onChange={e => setPhoneCountryCode(e.target.value)}
                    style={{ width: '100px', flexShrink: 0, padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none' }}
                  >
                    {countries.map(c => (
                      <option key={c.id} value={c.phoneCode}>{c.phoneCode} ({c.id})</option>
                    ))}
                  </select>
                <div className="input-with-icon" style={{ flexGrow: 1 }}>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    placeholder="98765 43210"
                    required
                  />
                  <Phone className="input-icon" size={20} />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Create a strong password"
                  required 
                />
                <Lock className="input-icon" size={20} />
              </div>
            </div>
            
            <button type="submit" className="btn auth-submit" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </form>
          
          <p className="auth-link">
            Already have an account? 
            <Link to={`/login${location.search}`}>Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
