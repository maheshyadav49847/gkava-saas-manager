import { useEffect, useRef } from 'react';
import { Users, Zap, ShieldCheck, Globe, Heart, Rocket } from 'lucide-react';
import './About.css';

export function About() {
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
    <div className="about-page">
      {/* Header */}
      <header className="about-header reveal-on-scroll">
        <div
          className="hero-badge-left"
          style={{ margin: '0 auto 1.5rem', display: 'inline-flex' }}
        >
          <span className="badge-dot"></span>
          ABOUT US
        </div>
        <h1 className="about-title">
          Built by Developers,{' '}
          <span className="highlight-solid">for Developers.</span>
        </h1>
        <p className="about-subtitle">
          GKAVA Studios started with a simple idea: SaaS management shouldn't be a nightmare. 
          We're on a mission to empower founders and teams to build, scale, and manage 
          their products with confidence.
        </p>
      </header>

      <hr className="about-divider" />

      {/* Mission Section */}
      <div className="about-mission">
        <div className="mission-text reveal-on-scroll">
          <h2>Our Mission</h2>
          <p>
            We believe every SaaS founder deserves world-class infrastructure without the
            complexity. GKAVA Studios provides the tools, APIs, and dashboards that let you
            focus on what matters — building great products.
          </p>
          <p>
            From subscription management to real-time analytics, we handle the heavy lifting
            so you can ship faster and grow smarter.
          </p>
        </div>
        <div className="mission-graphic reveal-on-scroll" style={{ transitionDelay: '0.15s' }}>
          <div className="mission-stat">
            <div className="stat-icon indigo">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <strong>10,000+</strong>
              <span>Active Users Worldwide</span>
            </div>
          </div>
          <div className="mission-stat">
            <div className="stat-icon emerald">
              <Zap size={24} />
            </div>
            <div className="stat-info">
              <strong>99.99%</strong>
              <span>Platform Uptime SLA</span>
            </div>
          </div>
          <div className="mission-stat">
            <div className="stat-icon amber">
              <Globe size={24} />
            </div>
            <div className="stat-info">
              <strong>42+</strong>
              <span>Countries Served</span>
            </div>
          </div>
          <div className="mission-stat">
            <div className="stat-icon rose">
              <ShieldCheck size={24} />
            </div>
            <div className="stat-info">
              <strong>SOC 2</strong>
              <span>Security Compliant</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="about-divider" />

      {/* Values Section */}
      <section className="about-values">
        <div className="about-values-header reveal-on-scroll">
          <h2>Our Core <span className="highlight-solid">Values.</span></h2>
          <p>The principles that guide every decision we make and every line of code we write.</p>
        </div>
        <div className="values-grid">
          <div className="value-card reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
            <div className="value-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
              <Rocket size={28} />
            </div>
            <h3>Ship Fast, Iterate Faster</h3>
            <p>
              We believe in rapid delivery. Our CI/CD pipelines push updates multiple times a
              day, ensuring you always have the latest features and fixes.
            </p>
          </div>
          <div className="value-card reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
            <div className="value-icon" style={{ background: '#d1fae5', color: '#059669' }}>
              <ShieldCheck size={28} />
            </div>
            <h3>Security First</h3>
            <p>
              Enterprise-grade security is not optional — it's foundational. Every API
              endpoint, every webhook, every data store is built with zero-trust principles.
            </p>
          </div>
          <div className="value-card reveal-on-scroll" style={{ transitionDelay: '0.3s' }}>
            <div className="value-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <Heart size={28} />
            </div>
            <h3>Developer Empathy</h3>
            <p>
              We're developers too. Every API, every SDK, every dashboard is designed with the
              developer experience as the top priority. Clean docs, fast SDKs, no surprises.
            </p>
          </div>
        </div>
      </section>

      <hr className="about-divider" />

      {/* Team Section */}
      <section className="about-team">
        <div className="about-team-header reveal-on-scroll">
          <h2>Meet the <span className="highlight-solid">Team.</span></h2>
          <p>A small, focused team obsessed with building exceptional developer tools.</p>
        </div>
        <div className="team-grid">
          <div className="team-card reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
            <div className="team-avatar av-1">MK</div>
            <h3>Mahesh Kumar</h3>
            <p className="team-role">Founder & CEO</p>
            <p>Visionary engineer with a passion for simplifying complex SaaS workflows and building scalable platforms.</p>
          </div>
          <div className="team-card reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
            <div className="team-avatar av-2">AP</div>
            <h3>Ananya Patel</h3>
            <p className="team-role">Lead Engineer</p>
            <p>Full-stack architect who designs the APIs and infrastructure that power thousands of businesses daily.</p>
          </div>
          <div className="team-card reveal-on-scroll" style={{ transitionDelay: '0.3s' }}>
            <div className="team-avatar av-3">RV</div>
            <h3>Rohan Verma</h3>
            <p className="team-role">Head of Product</p>
            <p>Product strategist focused on translating customer feedback into features that developers actually love.</p>
          </div>
        </div>
      </section>

      <hr className="about-divider" />

      {/* Bottom CTA */}
      <section className="about-cta reveal-on-scroll">
        <h2>Want to join the journey?</h2>
        <p>
          We're always looking for talented engineers, designers, and dreamers who
          want to shape the future of SaaS management.
        </p>
        <a href="/contact" className="about-btn-primary">
          Get in Touch
        </a>
      </section>
    </div>
  );
}
