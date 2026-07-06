import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import './Pricing.css';

const plans = [
  {
    name: 'Starter',
    desc: 'Perfect for indie developers and early-stage startups.',
    monthly: 0,
    annual: 0,
    popular: false,
    cta: 'Start Free',
    ctaStyle: 'pricing-btn-secondary',
    features: [
      'Up to 3 Applications',
      '1,000 API Requests / day',
      'Basic Webhook Support',
      'Community Support',
      'Standard Analytics',
    ],
  },
  {
    name: 'Pro',
    desc: 'For growing businesses that need power and flexibility.',
    monthly: 99,
    annual: 79,
    popular: true,
    cta: 'Go Pro',
    ctaStyle: 'pricing-btn-primary',
    features: [
      'Unlimited Applications',
      '100,000 API Requests / day',
      'Advanced Webhooks & Events',
      'Priority Email Support',
      'Real-time Analytics',
      'Custom Branding',
      'Team Collaboration (5 seats)',
    ],
  },
  {
    name: 'Enterprise',
    desc: 'For large-scale operations requiring dedicated support.',
    monthly: null,
    annual: null,
    popular: false,
    cta: 'Contact Sales',
    ctaStyle: 'pricing-btn-secondary',
    features: [
      'Everything in Pro',
      'Unlimited API Requests',
      'Dedicated Account Manager',
      'Custom SLA & Uptime Guarantee',
      'SSO & Advanced Security',
      'On-premise Deployment Option',
      'White-glove Onboarding',
      '24/7 Phone & Chat Support',
    ],
  },
];

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
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
          Simple, Transparent{' '}
          <span className="highlight-solid">Pricing.</span>
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
        {plans.map((plan, index) => (
          <div
            key={plan.name}
            className={`pricing-card reveal-on-scroll ${plan.popular ? 'popular' : ''}`}
            style={{ transitionDelay: `${index * 0.12}s` }}
          >
            {plan.popular && (
              <span className="popular-badge">Most Popular</span>
            )}

            <h3 className="pricing-plan-name">{plan.name}</h3>
            <p className="pricing-plan-desc">{plan.desc}</p>

            {plan.monthly !== null ? (
              <>
                <div className="pricing-amount">
                  <span className="pricing-currency">$</span>
                  <span className="pricing-value">
                    {isAnnual ? plan.annual : plan.monthly}
                  </span>
                </div>
                <p className="pricing-period">
                  per month{isAnnual ? ', billed annually' : ''}
                </p>
              </>
            ) : (
              <>
                <div className="pricing-amount">
                  <span className="pricing-value" style={{ fontSize: '3rem' }}>
                    Custom
                  </span>
                </div>
                <p className="pricing-period">tailored to your needs</p>
              </>
            )}

            <hr className="pricing-divider" />

            <ul className="pricing-features">
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Check size={18} />
                  {feature}
                </li>
              ))}
            </ul>

            <a
              href={
                plan.name === 'Enterprise'
                  ? '/contact'
                  : 'http://localhost:5180/login'
              }
              className={plan.ctaStyle}
              target={plan.name !== 'Enterprise' ? '_blank' : undefined}
              rel={plan.name !== 'Enterprise' ? 'noreferrer' : undefined}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <section className="pricing-bottom-cta reveal-on-scroll">
        <h2>Need something custom?</h2>
        <p>
          We work with enterprises of all sizes to build tailored solutions.
          Let's discuss what GKAVA Studios can do for your business.
        </p>
        <a href="/contact" className="pricing-btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '1rem 2.5rem' }}>
          Talk to Our Team
        </a>
      </section>
    </div>
  );
}
