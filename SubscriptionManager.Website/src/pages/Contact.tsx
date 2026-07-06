import { useEffect, useRef } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import './Contact.css';

export function Contact() {
  const observerRef = useRef<IntersectionObserver | null>(null);

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
              <a href="mailto:hello@gkava.com">hello@gkava.com</a>
            </div>
          </div>

          <div className="contact-info-card reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
            <div className="contact-info-icon emerald">
              <Phone size={24} />
            </div>
            <div className="contact-info-text">
              <h4>Call Us</h4>
              <p>Mon–Fri, 9 AM – 6 PM IST</p>
              <a href="tel:+919876543210">+91 98765 43210</a>
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
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  className="form-input"
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  className="form-input"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                type="text"
                className="form-input"
                placeholder="How can we help?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                className="form-input"
                placeholder="Tell us about your project or question..."
                rows={5}
              ></textarea>
            </div>

            <button type="submit" className="contact-submit">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
