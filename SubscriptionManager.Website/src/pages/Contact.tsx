import { useEffect, useRef, useState } from 'react';
import { Mail, MapPin, Phone, CheckCircle2, Loader2 } from 'lucide-react';
import { getPlatformSettings, submitContactMessage, type PlatformSettings, type ContactMessageDto } from '../services/api';
import './Contact.css';

export function Contact() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [formData, setFormData] = useState<ContactMessageDto>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await submitContactMessage(formData);
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getPlatformSettings();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="contact-page">
      {/* Header */}
      <header className="contact-header reveal-on-scroll">
        <div
          className="hero-badge-left"
          style={{ margin: '0 auto 1.5rem', display: 'inline-flex' }}
        >
          <span className="badge-dot"></span>
          GET IN TOUCH
        </div>
        <h1 className="contact-title">
          Let's <span className="highlight-solid">Talk.</span>
        </h1>
        <p className="contact-subtitle">
          Have a question, feedback, or want to explore a partnership? We'd love to hear from you. 
          Our team typically responds within 24 hours.
        </p>
      </header>

      {/* Two-Column Layout */}
      <div className="contact-layout">
        {/* Left: Contact Info */}
        <div className="contact-info">
          <div className="contact-info-card reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
            <div className="contact-info-icon indigo">
              <Mail size={24} />
            </div>
            <div className="contact-info-text">
              <h4>Email Us</h4>
              <p>For general inquiries and support</p>
              <a href={`mailto:${settings?.supportEmail || 'hello@gkava.com'}`}>
                {settings?.supportEmail || 'hello@gkava.com'}
              </a>
            </div>
          </div>

          <div className="contact-info-card reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
            <div className="contact-info-icon emerald">
              <Phone size={24} />
            </div>
            <div className="contact-info-text">
              <h4>Call Us</h4>
              <p>Mon–Fri, 9 AM – 6 PM IST</p>
              <a href={`tel:${settings?.contactPhone || '+919876543210'}`}>
                {settings?.contactPhone || '+91 98765 43210'}
              </a>
            </div>
          </div>

          <div className="contact-info-card reveal-on-scroll" style={{ transitionDelay: '0.3s' }}>
            <div className="contact-info-icon amber">
              <MapPin size={24} />
            </div>
            <div className="contact-info-text">
              <h4>Visit Us</h4>
              <p>GKAVA Studios HQ</p>
              <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Bengaluru, Karnataka, India
              </span>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="contact-form-card reveal-on-scroll" style={{ transitionDelay: '0.15s' }}>
          {isSuccess ? (
            <div className="contact-success" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '0.5rem' }}>Message Sent!</h3>
              <p style={{ color: '#64748b', marginBottom: '2rem' }}>Thanks for reaching out. We'll get back to you shortly.</p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="contact-submit"
                style={{ width: 'auto', padding: '0.75rem 2rem' }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              {error && (
                <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                  {error}
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    className="form-input"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    className="form-input"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact-phone">Mobile Number</label>
                <input
                  id="contact-phone"
                  type="tel"
                  required
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  className="form-input"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  required
                  className="form-input"
                  placeholder="Tell us about your project or question..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="contact-submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Loader2 size={18} className="animate-spin" /> Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
