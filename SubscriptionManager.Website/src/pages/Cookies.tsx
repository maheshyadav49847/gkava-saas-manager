import { useEffect, useRef } from 'react';
import './Legal.css';

export function Cookies() {
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
    return () => { observerRef.current?.disconnect(); };
  }, []);

  return (
    <div className="legal-page">
      <header className="legal-header reveal-on-scroll">
        <div className="hero-badge-left" style={{ margin: '0 auto 1.5rem', display: 'inline-flex' }}>
          <span className="badge-dot"></span>
          LEGAL
        </div>
        <h1 className="legal-title">Cookie <span className="highlight-solid">Policy.</span></h1>
        <p className="legal-updated">Last updated: July 6, 2026</p>
      </header>

      <div className="legal-content">
        <div className="legal-info-card reveal-on-scroll">
          <p>
            This Cookie Policy explains how GKAVA Studios uses cookies and similar tracking technologies
            when you visit our platform. By using our services, you consent to the use of cookies as
            described in this policy.
          </p>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your device when you visit a website. They are
            widely used to make websites work more efficiently, provide a better user experience, and give
            website owners useful information about how their site is being used.
          </p>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>2. Types of Cookies We Use</h2>
          <h3>Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly. They enable core features
            like user authentication, session management, and security. You cannot opt out of these cookies.
          </p>
          <h3>Analytics Cookies</h3>
          <p>
            We use analytics cookies to understand how visitors interact with our platform. This helps us
            improve the user experience and optimize our services. These cookies collect anonymized data.
          </p>
          <h3>Preference Cookies</h3>
          <p>
            These cookies remember your preferences and settings (such as language, theme, and display options)
            to provide a more personalized experience on return visits.
          </p>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>3. Third-Party Cookies</h2>
          <p>
            Some cookies on our platform are set by third-party services that appear on our pages. We use
            the following third-party services:
          </p>
          <ul>
            <li><strong>Google Analytics</strong> — for website usage analytics</li>
            <li><strong>Stripe</strong> — for secure payment processing</li>
            <li><strong>Intercom</strong> — for customer support chat</li>
          </ul>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>4. Managing Cookies</h2>
          <p>
            You can control and manage cookies through your browser settings. Most browsers allow you to:
          </p>
          <ul>
            <li>View what cookies are stored and delete them individually</li>
            <li>Block third-party cookies</li>
            <li>Block cookies from specific sites</li>
            <li>Block all cookies from being set</li>
            <li>Delete all cookies when you close your browser</li>
          </ul>
          <p>
            Please note that blocking or deleting cookies may impact your experience on our platform and
            some features may not function properly.
          </p>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>5. Contact Us</h2>
          <p>
            If you have any questions about our use of cookies, please contact us at:
          </p>
          <p>
            <strong>GKAVA Studios</strong><br />
            Email: <a href="mailto:privacy@gkava.com">privacy@gkava.com</a><br />
            Address: Bengaluru, Karnataka, India
          </p>
        </div>
      </div>
    </div>
  );
}
