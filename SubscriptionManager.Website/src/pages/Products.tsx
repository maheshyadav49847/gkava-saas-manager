import { useEffect, useState, useRef } from 'react';
import { getApplications, type Application } from '../services/api';
import { ArrowRight, Layers, ShieldCheck } from 'lucide-react';
import './Products.css';

export function Products() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    async function fetchApps() {
      try {
        const data = await getApplications();
        const imaginedProducts = [
          {
            id: 'imagined-1',
            name: 'GKAVA Nexus',
            appKey: 'NKX-8932-XYZ',
            webhookUrl: 'https://nexus.gkava.com/integrate'
          },
          {
            id: 'imagined-2',
            name: 'GKAVA Sentinel',
            appKey: 'SNT-4401-ABC',
            webhookUrl: 'https://sentinel.gkava.com/security'
          }
        ];
        setApplications([...data, ...imaginedProducts]);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        setLoading(false);
      }
    }
    fetchApps();
  }, []);

  // Setup Intersection Observer for smooth scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
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
  }, [applications]); // Re-run when applications load so new items get observed

  return (
    <div className="corporate-page">
      {/* Corporate Page Header */}
      <header className="products-header reveal-on-scroll">
        <div className="hero-badge-left" style={{ margin: '0 auto 1.5rem', display: 'inline-flex' }}>
          <span className="badge-dot"></span>
          ENTERPRISE SOLUTIONS
        </div>
        <h1 className="products-title">Our Premium <span className="highlight-solid">Products.</span></h1>
        <p className="products-subtitle">
          Deep dive into the specialized software products developed and managed by GKAVA Studios. Built for performance, scale, and security.
        </p>
      </header>

      {/* Alternating Products Layout */}
      <div className="products-list">
        {loading ? (
          <div className="text-center" style={{ padding: '4rem', color: '#6b7280' }}>
            Loading products...
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center" style={{ padding: '4rem', color: '#6b7280' }}>
            No products available yet. Check back soon.
          </div>
        ) : (
          applications.map((app, index) => (
            <div key={app.id} className="product-row reveal-on-scroll" style={{ transitionDelay: `${index * 0.15}s` }}>
              
              <div className="product-content">
                <h2 className="product-name">{app.name}</h2>
                <p className="product-description">
                  A high-performance SaaS platform engineered to solve complex business challenges. This application leverages modern architecture to ensure maximum uptime, robust security, and seamless user experiences for enterprise clients.
                </p>
                
                <div className="product-specs">
                  <div className="spec-item">
                    <span className="spec-label">Application Key</span>
                    <span className="spec-value">{app.appKey}</span>
                  </div>
                  {app.webhookUrl && (
                    <div className="spec-item">
                      <span className="spec-label">Integration Webhook</span>
                      <a href={app.webhookUrl} target="_blank" rel="noreferrer" className="spec-value spec-link">
                        {app.webhookUrl}
                      </a>
                    </div>
                  )}
                  <div className="spec-item" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <ShieldCheck size={16} color="#10b981" />
                    <span style={{ fontSize: '0.875rem', color: '#4b5563', fontWeight: 600 }}>Enterprise Security Verified</span>
                  </div>
                </div>
                
                <button className="corporate-btn-primary">
                  Request Demo <ArrowRight size={18} />
                </button>
              </div>

              {/* Clean abstract placeholder for the software UI/Graphic */}
              <div className="product-graphic">
                <div className="graphic-inner">
                  <div className="graphic-header">
                    <div className="graphic-dot"></div>
                    <div className="graphic-dot"></div>
                    <div className="graphic-dot"></div>
                  </div>
                  <div className="graphic-body">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <Layers size={48} opacity={0.5} />
                      <span style={{ fontSize: '1rem', fontWeight: 500, letterSpacing: '0.05em' }}>
                        {app.name.toUpperCase()} UI
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
