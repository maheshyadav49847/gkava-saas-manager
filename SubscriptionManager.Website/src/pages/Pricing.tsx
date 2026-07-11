import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { getPlans, getApplications, type Plan, type Application } from '../services/api';
import './Pricing.css';

export function Pricing() {
  const [searchParams] = useSearchParams();
  const appId = searchParams.get('appId');

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

  // Filter plans based on the selected application (if provided)
  const displayPlans = appId ? plans.filter(p => p.applicationId === appId) : plans;
  const appName = appId ? applications.find(a => a.id === appId)?.name : null;

  return (
    <div className="pricing-page">
      {/* Header */}
      <header className="pricing-header reveal-on-scroll">
        <div
          className="hero-badge-left"
          style={{ margin: '0 auto 1.5rem', display: 'inline-flex' }}
        >
          <span className="badge-dot"></span>
          PRICING PLANS
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
                <span className="pricing-currency">$</span>
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

              {/* Route to the SaaS dashboard register page with URL params */}
              <a
                href={`http://localhost:5180/register?planId=${plan.id}&appId=${plan.applicationId}`}
                className={plan.isPopular ? 'pricing-btn-primary' : 'pricing-btn-secondary'}
                target="_blank"
                rel="noreferrer"
              >
                Subscribe Now
              </a>
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
