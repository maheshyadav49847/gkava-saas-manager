import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getApplications, type Application } from '../services/api';
import { ArrowRight, Layers, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import './Products.css';

export function Products() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedApps, setExpandedApps] = useState<Record<string, boolean>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    async function fetchApps() {
      try {
        const data = await getApplications();
        setApplications(data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        setLoading(false);
      }
    }
    fetchApps();
  }, []);

  const toggleModules = (appId: string) => {
    setExpandedApps(prev => {
      const isCurrentlyExpanded = prev[appId];
      if (!isCurrentlyExpanded) {
        // Wait for state to update and render, then scroll
        setTimeout(() => {
          const el = document.getElementById(`modules-${appId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Add a subtle flash/focus effect
            el.classList.add('flash-focus');
            setTimeout(() => el.classList.remove('flash-focus'), 1000);
          }
        }, 100);
      }
      return { ...prev, [appId]: !isCurrentlyExpanded };
    });
  };

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
  }, [applications]);

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
              
              <div className="product-hero-section">
                <div className="product-graphic" style={app.imageBase64 ? { padding: '1rem', aspectRatio: 'auto' } : {}}>
                  {app.imageBase64 ? (
                    <img src={app.imageBase64} alt={`${app.name} UI`} style={{ width: '100%', height: '100%', aspectRatio: '16 / 11', display: 'block', objectFit: 'fill', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                  ) : (
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
                  )}
                </div>

                <div className="product-intro">
                  <h2 className="product-name" style={app.subtitle ? { marginBottom: '0.5rem' } : {}}>{app.name}</h2>
                  {app.subtitle && (
                    <p className="product-subtitle" style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                      {app.subtitle}
                    </p>
                  )}
                  {app.description ? (
                    <p className="product-description">
                      {app.description}
                    </p>
                  ) : (
                    <p className="product-description">
                      A high-performance SaaS platform engineered to solve complex business challenges. This application leverages modern architecture to ensure maximum uptime, robust security, and seamless user experiences for enterprise clients.
                    </p>
                  )}
                  
                  <div className="product-specs">
                    <div className="spec-item" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <ShieldCheck size={20} color="#10b981" />
                      <span style={{ fontSize: '1rem', color: '#4b5563', fontWeight: 600 }}>Enterprise Security Verified</span>
                    </div>
                  </div>

                  {app.webhookUrl && (
                    <a href={app.webhookUrl} target="_blank" rel="noreferrer" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem', marginTop: '0.75rem' }}>
                      Visit Website <ArrowRight size={16} />
                    </a>
                  )}
                  
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    {app.modules && app.modules.length > 0 && (
                      <button onClick={() => toggleModules(app.id)} className="btn-secondary-large">
                        Platform Modules {expandedApps[app.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    )}
                    <Link to={`/pricing?appId=${app.id}`} className="btn-primary-large">
                      View Pricing <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>

              {expandedApps[app.id] && app.modules && app.modules.length > 0 && (
                <div id={`modules-${app.id}`} className="product-details-section">
                  <div>
                    <h3 className="detail-title">Platform Modules</h3>
                    <div className="product-modules-grid">
                      {[...app.modules].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map((module, mIndex) => {
                        const IconCmp = (LucideIcons as any)[module.icon || 'Layers'] || LucideIcons.Layers;
                          return (
                            <div key={mIndex} className="module-card">
                              <div className="module-card-header">
                                <div className="module-icon">
                                  <IconCmp size={24} />
                                </div>
                                <div className="module-name">{module.name || 'Untitled'}</div>
                              </div>
                              <div className="module-desc">{module.description}</div>
                            </div>
                          );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
