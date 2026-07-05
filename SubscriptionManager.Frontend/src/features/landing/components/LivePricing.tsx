import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Info } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

interface LivePricingProps {
  applicationId?: string;
}

export const LivePricing = ({ applicationId }: LivePricingProps) => {
  const [plans, setPlans] = useState<any[]>([]);
  const [applicationName, setApplicationName] = useState<string>('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const addItem = useCartStore(state => state.addItem);
  const navigate = useNavigate();

  useEffect(() => {
    if (!applicationId) return;

    // Fetch Application details
    fetch('http://localhost:5048/api/applications')
      .then(res => res.json())
      .then(data => {
        const app = data.find((a: any) => a.id === applicationId);
        if (app) setApplicationName(app.name);
      })
      .catch(err => console.error(err));

    // Fetch Plans
    fetch('http://localhost:5048/api/plans')
      .then(res => res.json())
      .then(data => {
        const appPlans = data.filter((p: any) => p.applicationId === applicationId);
        setPlans(appPlans);
      })
      .catch(err => console.error(err));
  }, [applicationId]);

  if (!applicationId || plans.length === 0) {
    return null; // Don't show pricing if no application linked or no plans exist
  }

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
          Pricing for {applicationName}
        </h2>
        <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
          Choose the right plan for your team. Transparent pricing with no hidden fees.
        </p>

        <div className="mt-8 flex justify-center">
          <div className="bg-slate-100 p-1 rounded-full inline-flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Yearly <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] uppercase tracking-wider rounded-full">Save 20%</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
          return (
            <div 
              key={plan.id}
              className={`relative bg-white rounded-3xl p-8 border-2 ${plan.isPopular ? 'border-indigo-600 shadow-xl scale-105 z-10' : 'border-slate-200 shadow-md hover:border-indigo-300'} flex flex-col transition-all`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                <p className="text-sm text-slate-500 font-medium mt-2 min-h-[40px]">{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-black text-slate-900">₹{price}</span>
                <span className="text-slate-500 font-medium">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features?.map((feature: any, idx: number) => {
                  const featureName = typeof feature === 'string' ? feature : feature.featureName;
                  const featureValue = typeof feature === 'object' ? feature.featureValue : null;
                  return (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 font-medium">{featureName} {featureValue && <span className="font-bold">({featureValue})</span>}</span>
                    </li>
                  );
                })}
              </ul>

              <button
                onClick={() => {
                  addItem({
                    planId: plan.id,
                    planName: plan.name,
                    applicationId: plan.applicationId,
                    applicationName: applicationName,
                    price: price,
                    billingCycle: billingCycle
                  });
                  navigate('/checkout');
                }}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${plan.isPopular ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
              >
                Add to Subscription
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
