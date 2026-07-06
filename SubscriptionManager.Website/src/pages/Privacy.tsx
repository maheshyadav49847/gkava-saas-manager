import { useEffect, useRef } from 'react';
import './Legal.css';

export function Privacy() {
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
        <h1 className="legal-title">Privacy <span className="highlight-solid">Policy.</span></h1>
        <p className="legal-updated">Last updated: July 6, 2026</p>
      </header>

      <div className="legal-content">
        <div className="legal-info-card reveal-on-scroll">
          <p>
            At GKAVA Studios, we take your privacy seriously. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our platform and services.
          </p>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>1. Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>We may collect personally identifiable information that you voluntarily provide when you:</p>
          <ul>
            <li>Register for an account on our platform</li>
            <li>Subscribe to a plan or make a purchase</li>
            <li>Contact us through our support channels</li>
            <li>Fill out a form or participate in surveys</li>
          </ul>
          <h3>Automatically Collected Information</h3>
          <p>
            When you access our services, we automatically collect certain information including your IP address,
            browser type, operating system, access times, and the pages you have viewed directly before and after
            accessing our platform.
          </p>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Create and manage your account</li>
            <li>Process transactions and send billing information</li>
            <li>Provide, operate, and maintain our services</li>
            <li>Improve, personalize, and expand our platform</li>
            <li>Communicate with you about updates, offers, and promotions</li>
            <li>Detect and prevent fraud and unauthorized access</li>
            <li>Comply with legal obligations</li>
          </ul>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>3. Data Sharing & Disclosure</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share data with
            trusted third-party service providers who assist us in operating our platform, conducting business,
            or servicing you, so long as those parties agree to keep this information confidential.
          </p>
          <p>We may also disclose your information when required by law or to protect our rights.</p>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>4. Data Security</h2>
          <p>
            We implement industry-standard security measures including encryption (TLS 1.3), access controls,
            regular security audits, and SOC 2 Type II compliance to protect your personal data. However, no
            method of transmission over the Internet is 100% secure.
          </p>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>5. Data Retention</h2>
          <p>
            We retain your personal data only for as long as necessary to fulfill the purposes outlined in this
            policy, unless a longer retention period is required or permitted by law. When data is no longer
            needed, it is securely deleted or anonymized.
          </p>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>6. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p>To exercise any of these rights, please contact us at <a href="mailto:privacy@gkava.com">privacy@gkava.com</a>.</p>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>7. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy, please contact us at:
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
