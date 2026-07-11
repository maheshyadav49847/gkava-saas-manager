import { ArrowRight, Layers, ShieldCheck, Zap, Globe, ArrowUp, Server, Terminal } from 'lucide-react';
import './Home.css';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { getApplications, type Application } from '../services/api';

export function Home() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await getApplications();
        setApplications(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  // Setup Intersection Observer for smooth scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Optional: Unobserve after revealing if you only want it to animate once
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [applications]); // Re-run when applications load so new cards get observed

  return (
    <div className="corporate-home">
      {/* Client-Facing Hero Section */}
      <section className="corporate-hero">
        <div className="hero-content hero-split">
          
          <div className="hero-left">
            <div className="hero-badge-left animate-fade-in-up">
              <span className="badge-dot"></span>
              GKAVA SOFTWARE SOLUTIONS
            </div>
            
            <h1 className="hero-title animate-fade-in-up delay-100">
              We Build Software<br />
              <span className="highlight-solid">That Runs Your<br />Business.</span>
            </h1>
            
            <p className="hero-subtitle animate-fade-in-up delay-200">
              From intelligent SaaS platforms like MyQCare to bespoke enterprise systems, we engineer scalable technology that drives efficiency and growth.
            </p>
            
            <div className="hero-actions animate-fade-in-up delay-300">
               <Link to="/products" className="corporate-btn-primary">
                  Custom Engineering
               </Link>
               <button 
                  className="corporate-btn-secondary"
                  onClick={() => document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth' })}
               >
                  Explore Ecosystem
               </button>
            </div>
          </div>
          
          <div className="hero-right animate-fade-in-up delay-400">
            <div className="mockup-container">
               {/* 3D Tilted Dashboard Window */}
               <div className="mockup-window">
                 <div className="mockup-header">
                    <div className="mockup-icon-box bg-indigo-100">
                      <Server size={18} className="text-indigo-600" />
                    </div>
                    <div className="mockup-header-text">
                      <h4 className="mockup-title">Infrastructure Health</h4>
                      <p className="mockup-sub">All systems operational</p>
                    </div>
                    <div className="mockup-dots">
                      <span></span><span></span><span></span>
                    </div>
                 </div>
                 
                 <div className="mockup-grid">
                    <div className="mockup-card">
                       <p className="mc-label">REQUESTS / SEC</p>
                       <p className="mc-value">42,891</p>
                       <p className="mc-status text-green"><ArrowUp size={14}/> 99.99% Uptime</p>
                    </div>
                    <div className="mockup-card">
                       <p className="mc-label">LATENCY</p>
                       <p className="mc-value">12ms</p>
                       <p className="mc-status text-green"><ArrowUp size={14}/> Optimized</p>
                    </div>
                 </div>
                 
                 <div className="mockup-chart">
                    <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                       <path d="M0,20 C20,20 30,10 50,20 C70,30 80,5 100,20 L100,30 L0,30 Z" fill="#e0e7ff" />
                       <path d="M0,20 C20,20 30,10 50,20 C70,30 80,5 100,20" fill="none" stroke="#4f46e5" strokeWidth="2" />
                    </svg>
                 </div>
               </div>
               
               {/* Floating Badges */}
               <div className="floating-badge badge-tr floating-anim">
                  <div className="fb-icon text-green bg-green-50"><ShieldCheck size={20}/></div>
                  <div className="fb-text">
                     <strong>Secure</strong>
                     <span>Enterprise grade</span>
                  </div>
               </div>
               
               <div className="floating-badge badge-bl floating-anim-delayed">
                  <div className="fb-icon text-purple bg-purple-50"><Zap size={20}/></div>
                  <div className="fb-text">
                     <strong>Lightning Fast</strong>
                     <span>Zero latency</span>
                  </div>
               </div>
               
            </div>
          </div>
          
        </div>
      </section>

      {/* Trust Banner */}
      <div className="trust-banner reveal-on-scroll">
        <p>TRUSTED BY INNOVATIVE TEAMS WORLDWIDE</p>
        <div className="marquee-container">
          <div className="marquee-content">
            {/* Set 1 */}
            <span className="logo-text">Acme Corp</span>
            <span className="logo-text">GlobalTech</span>
            <span className="logo-text">Nexus</span>
            <span className="logo-text">Pinnacle</span>
            <span className="logo-text">Horizon</span>
            <span className="logo-text">Stellar</span>
            <span className="logo-text">Quantum</span>
            {/* Set 2 (for seamless loop) */}
            <span className="logo-text">Acme Corp</span>
            <span className="logo-text">GlobalTech</span>
            <span className="logo-text">Nexus</span>
            <span className="logo-text">Pinnacle</span>
            <span className="logo-text">Horizon</span>
            <span className="logo-text">Stellar</span>
            <span className="logo-text">Quantum</span>
          </div>
        </div>
      </div>

      {/* Simple Divider */}
      <hr className="normal-divider" />

      {/* Features Section */}
      <section className="corporate-features-section">
        <div className="section-header reveal-on-scroll">
          <div className="hero-badge-left" style={{ margin: '0 auto 1.5rem', display: 'inline-flex' }}>
            <span className="badge-dot"></span>
            CORE CAPABILITIES
          </div>
          <h2 className="section-title">Engineered for <span className="highlight-solid">Scale.</span></h2>
          <p className="section-subtitle">Everything you need to run your software ecosystem securely and efficiently, packed into one unified platform.</p>
        </div>
        
        <div className="bento-grid">
          {/* Card 1: Wide */}
          <div className="bento-card bento-wide reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
            <div className="bento-content">
              <div className="feature-icon-wrapper">
                <ShieldCheck size={24} />
              </div>
              <h3>Enterprise Security</h3>
              <p>Bank-grade encryption, SOC 2 compliance, and strict RBAC protocols ensure your sensitive data is protected at all times across all applications.</p>
            </div>
          </div>

          {/* Card 2: Square */}
          <div className="bento-card reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
            <div className="feature-icon-wrapper">
              <Zap size={24} />
            </div>
            <h3>High Performance</h3>
            <p>Optimized cloud architecture guarantees lightning-fast load times.</p>
          </div>

          {/* Card 3: Square */}
          <div className="bento-card reveal-on-scroll" style={{ transitionDelay: '0.3s' }}>
            <div className="feature-icon-wrapper">
              <Globe size={24} />
            </div>
            <h3>Global Scale</h3>
            <p>Infrastructure that seamlessly scales from a few users to millions.</p>
          </div>

          {/* Card 4: Wide */}
          <div className="bento-card bento-wide reveal-on-scroll" style={{ transitionDelay: '0.4s' }}>
            <div className="bento-content">
              <div className="feature-icon-wrapper">
                <Terminal size={24} />
              </div>
              <h3>Developer APIs</h3>
              <p>Extensive REST and GraphQL APIs, webhooks, and SDKs allow your engineering team to integrate and extend our platform effortlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Divider */}
      <hr className="normal-divider" />

      {/* Client-Facing Products Section */}
      <section id="ecosystem" className="corporate-products-section">
        <div className="section-header reveal-on-scroll">
          <div className="hero-badge-left" style={{ margin: '0 auto 1.5rem', display: 'inline-flex' }}>
            <span className="badge-dot"></span>
            OUR ECOSYSTEM
          </div>
          <h2 className="section-title">Explore Our <span className="highlight-solid">Products.</span></h2>
          <p className="section-subtitle">A suite of specialized applications designed to streamline operations and enhance productivity.</p>
        </div>

        {loading ? (
          <div className="corporate-empty">Loading products...</div>
        ) : applications.length === 0 ? (
          <div className="corporate-empty">No products available at the moment.</div>
        ) : (
          <div className="corporate-grid">
            {applications.map((app, index) => (
              <div 
                key={app.id} 
                className="corporate-card reveal-on-scroll" 
                style={{ transitionDelay: `${index * 0.1}s` }} // Staggered reveal for cards
              >
                <div className="card-header">
                  <div className="corporate-icon">
                    <Layers size={28} />
                  </div>
                  <h3 className="card-title">{app.name}</h3>
                </div>
                {app.subtitle && (
                  <p className="card-subtitle" style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: 600, marginBottom: '0.5rem' }}>
                    {app.subtitle}
                  </p>
                )}
                <p className="card-desc">
                  {app.description || 'A comprehensive SaaS platform designed to streamline operations and enhance productivity.'}
                </p>
                
                <div className="card-footer">
                  <Link to={`/products`} className="corporate-btn-primary">
                    Learn More
                  </Link>
                  {app.webhookUrl && (
                    <a href={app.webhookUrl} target="_blank" rel="noreferrer" className="corporate-link">
                      Visit Website <ArrowRight size={16} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Final CTA */}
      <section className="corporate-bottom-cta reveal-on-scroll">
         <h2>Ready to scale your business?</h2>
         <p>Join hundreds of companies that trust GKAVA Studios for their critical infrastructure.</p>
         <button className="corporate-btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
            Get Started Today
         </button>
      </section>
    </div>
  );
}
