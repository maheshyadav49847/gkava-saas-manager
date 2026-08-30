import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { getPlans, getApplications, type Plan, type Application } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Pricing.css';

export function Pricing() {
  const [searchParams] = useSearchParams();
  const appId = searchParams.get('appId');
  const { isAuthenticated } = useAuth();

  const [isAnnual, setIsAnnual] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedPlans, fetchedApps] = await Promise.all([
          getPlans(),
          getApplications()
        ]);
        
        setPlans(fetchedPlans);
        setApplications(fetchedApps);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch pricing data:', error);
        setLoading(false);
      }
    }
    fetchData();
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
  }, [plans]); // Re-run when plans update

  // Determine the active application ID
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  useEffect(() => {
    if (appId) {
      setSelectedAppId(appId);
    }
    // If no appId in URL, we leave selectedAppId as null to show the selection screen
  }, [appId]);

  // Filter plans based on the selected application
  const displayPlans = selectedAppId ? plans.filter(p => p.applicationId === selectedAppId) : [];
  const appName = applications.find(a => a.id === selectedAppId)?.name || null;

  // Render product selection screen if no product is selected
  if (!selectedAppId && applications.length > 0) {
    return (
      <div className="pricing-page" style={{ minHeight: '80vh', paddingTop: '6rem' }}>
        <header className="pricing-header reveal-on-scroll text-center mb-12">
          <div className="hero-badge-left" style={{ margin: '0 auto 1.5rem', display: 'inline-flex' }}>
            <span className="badge-dot"></span>
            SUBSCRIPTION PLANS
          </div>
          <h1 className="pricing-title">
            Select a <span className="highlight-solid">Product.</span>
          </h1>
          <p className="pricing-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Choose one of our enterprise SaaS products below to view its pricing plans and features.
          </p>
        </header>

        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20 reveal-on-scroll">
          {applications.map((app, index) => (
            <div 
              key={app.id} 
              onClick={() => setSelectedAppId(app.id)}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-indigo-500 transition-all cursor-pointer shadow-sm hover:shadow-xl group text-center"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-indigo-600">
                  {app.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{app.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {app.subtitle || 'View subscription plans and features'}
              </p>
              <div className="mt-6 inline-flex items-center text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                View Pricing <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pricing-page">
      {/* Header */}
      <header className="pricing-header reveal-on-scroll">
        <div
          className="hero-badge-left"
          style={{ margin: '0 auto 1.5rem', display: 'inline-flex', cursor: 'pointer' }}
          onClick={() => setSelectedAppId(null)}
        >
          <span className="badge-dot"></span>
          ← BACK TO PRODUCTS
        </div>
        <h1 className="pricing-title">
          {appName ? `Pricing for ${appName}.` : (
            <>Simple, Transparent <span className="highlight-solid">Pricing.</span></>
          )}
        </h1>
        <p className="pricing-subtitle">
          No hidden fees. No surprises. Choose the plan that fits your stage and
          scale as you grow.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="pricing-toggle">
          <span className={!isAnnual ? 'active-toggle' : ''}>Monthly</span>
          <div
            className={`toggle-switch ${isAnnual ? 'toggled' : ''}`}
            onClick={() => setIsAnnual(!isAnnual)}
          >
            <div className="toggle-knob"></div>
          </div>
          <span className={isAnnual ? 'active-toggle' : ''}>Annual</span>
          <span className="save-badge">Save 20%</span>
        </div>
      </header>

      {/* Pricing Cards */}
      <div className="pricing-grid">
        {loading ? (
          <div className="text-center w-full" style={{ padding: '4rem', color: '#6b7280' }}>
            Loading plans...
          </div>
        ) : displayPlans.length === 0 ? (
          <div className="text-center w-full" style={{ padding: '4rem', color: '#6b7280' }}>
            No plans available.
          </div>
        ) : (
          displayPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`pricing-card reveal-on-scroll ${plan.isPopular ? 'popular' : ''}`}
              style={{ transitionDelay: `${index * 0.12}s` }}
            >
              {plan.isPopular && (
                <span className="popular-badge">Most Popular</span>
              )}

              {/* Show which app this is for, if viewing all plans */}
              {!appId && (
                <span className="text-xs font-semibold text-indigo-600 block mb-2 uppercase tracking-wide">
                  {applications.find(a => a.id === plan.applicationId)?.name || 'Product'}
                </span>
              )}

              <h3 className="pricing-plan-name">{plan.name}</h3>
              <p className="pricing-plan-desc">{plan.description}</p>

              <div className="pricing-amount">
                <span className="pricing-currency">₹</span>
                <span className="pricing-value">
                  {isAnnual ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
              </div>
              <p className="pricing-period">
                per month{isAnnual ? ', billed annually' : ''}
              </p>

              <hr className="pricing-divider" />

              <ul className="pricing-features">
                {plan.features && plan.features.map((feature, i) => (
                  <li key={i}>
                    <Check size={18} />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="pricing-actions">
                <Link
                  to={isAuthenticated 
                    ? `/checkout?planId=${plan.id}&appId=${plan.applicationId}` 
                    : `/register?planId=${plan.id}&appId=${plan.applicationId}`}
                  className={plan.isPopular ? 'pricing-btn-primary' : 'pricing-btn-secondary'}
                >
                  {isAuthenticated ? 'Subscribe Now' : 'Sign Up to Subscribe'}
                </Link>
                
                {!isAuthenticated && (
                  <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <Link 
                      to={`/login?planId=${plan.id}&appId=${plan.applicationId}`}
                      style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', textDecoration: 'underline' }}
                    >
                      Log in to subscribe
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom CTA */}
      <section className="pricing-bottom-cta reveal-on-scroll">
        <h2>Need something custom?</h2>
        <p>
          We work with enterprises of all sizes to build tailored solutions.
          Let's discuss what GKAVA Studios can do for your business.
        </p>
        <Link to="/contact" className="pricing-btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '1rem 2.5rem' }}>
          Talk to Our Team
        </Link>
      </section>
    </div>
  );
}
