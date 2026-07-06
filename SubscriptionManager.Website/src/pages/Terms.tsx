import { useEffect, useRef } from 'react';
import './Legal.css';

export function Terms() {
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
        <h1 className="legal-title">Terms of <span className="highlight-solid">Service.</span></h1>
        <p className="legal-updated">Last updated: July 6, 2026</p>
      </header>

      <div className="legal-content">
        <div className="legal-info-card reveal-on-scroll">
          <p>
            By accessing or using GKAVA Studios' platform and services, you agree to be bound by these
            Terms of Service. Please read them carefully before using our services.
          </p>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By creating an account or using any part of our services, you acknowledge that you have read,
            understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do
            not agree, you may not use our services.
          </p>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>2. Description of Services</h2>
          <p>
            GKAVA Studios provides a SaaS management platform that enables businesses to manage applications,
            subscriptions, API keys, webhooks, and user analytics. We reserve the right to modify, suspend,
            or discontinue any part of our services at any time with reasonable notice.
          </p>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>3. User Accounts</h2>
          <ul>
            <li>You must provide accurate and complete registration information.</li>
            <li>You are responsible for maintaining the security of your account credentials.</li>
            <li>You must notify us immediately of any unauthorized use of your account.</li>
            <li>You may not share your account with third parties without our consent.</li>
            <li>We reserve the right to suspend accounts that violate these terms.</li>
          </ul>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the services for any illegal or unauthorized purpose</li>
            <li>Transmit malicious code, viruses, or harmful data</li>
            <li>Attempt to gain unauthorized access to our systems or networks</li>
            <li>Interfere with or disrupt the integrity or performance of our services</li>
            <li>Scrape, data mine, or extract data from our platform without permission</li>
            <li>Resell or redistribute our services without authorization</li>
          </ul>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>5. Payment & Billing</h2>
          <p>
            Paid plans are billed in advance on a monthly or annual basis. All fees are non-refundable except
            as required by law. We may change pricing with 30 days' written notice. Failure to pay may result
            in suspension or termination of your account.
          </p>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>6. Intellectual Property</h2>
          <p>
            All content, trademarks, logos, and intellectual property on our platform are owned by GKAVA Studios
            or its licensors. You retain ownership of any data you upload to our platform. By using our services,
            you grant us a limited license to process your data solely for the purpose of providing our services.
          </p>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, GKAVA Studios shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages, including loss of profits, data, or
            business opportunities, arising from your use of our services.
          </p>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>8. Termination</h2>
          <p>
            Either party may terminate these terms at any time. Upon termination, your right to use the
            services will immediately cease. We will retain your data for 30 days after termination,
            after which it will be permanently deleted.
          </p>
        </div>

        <div className="legal-section reveal-on-scroll">
          <h2>9. Contact Us</h2>
          <p>
            For any questions about these Terms of Service, please contact us at:
          </p>
          <p>
            <strong>GKAVA Studios</strong><br />
            Email: <a href="mailto:legal@gkava.com">legal@gkava.com</a><br />
            Address: Bengaluru, Karnataka, India
          </p>
        </div>
      </div>
    </div>
  );
}
