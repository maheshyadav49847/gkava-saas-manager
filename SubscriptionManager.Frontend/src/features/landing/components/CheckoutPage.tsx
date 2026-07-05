import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { CreditCard, Wallet, Calendar, ShieldCheck, X } from 'lucide-react';
import { GkavaLogo } from '../../../components/GkavaLogo';

export const CheckoutPage = () => {
  const { items, removeItem } = useCartStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tenantName: '',
    email: '',
    password: '',
    paymentMethod: 'stripe' as 'stripe' | 'razorpay' | 'invoice'
  });

  const totalMonthly = items.filter(i => i.billingCycle === 'monthly').reduce((sum, i) => sum + i.price, 0);
  const totalYearly = items.filter(i => i.billingCycle === 'yearly').reduce((sum, i) => sum + i.price, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    // In a real app, this would call our backend API to create the tenant and subscriptions
    alert(`Processing checkout for ${form.tenantName} using ${form.paymentMethod}. Total Plans: ${items.length}`);
    
    // Mock successful checkout
    // useCartStore.getState().clearCart();
    // navigate('/dashboard');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <GkavaLogo className="h-12 w-auto mb-8 grayscale opacity-50" />
        <h1 className="text-3xl font-black text-slate-900 mb-4">Your Cart is Empty</h1>
        <p className="text-slate-600 mb-8">You haven't selected any subscription plans yet.</p>
        <button onClick={() => navigate('/products')} className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700">
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        <h1 className="text-4xl font-black text-slate-900 mb-12">Complete Your Purchase</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column - Form & Payment */}
          <div className="flex-1 space-y-8">
            <form id="checkout-form" onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">1. Organization Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Organization / Clinic Name</label>
                    <input 
                      type="text" required
                      value={form.tenantName} onChange={e => setForm({...form, tenantName: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                      placeholder="e.g. Apollo Hospitals"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Admin Email</label>
                      <input 
                        type="email" required
                        value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        placeholder="admin@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Admin Password</label>
                      <input 
                        type="password" required
                        value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100 my-8" />

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">2. Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button type="button" onClick={() => setForm({...form, paymentMethod: 'stripe'})} className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${form.paymentMethod === 'stripe' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300'}`}>
                    <CreditCard className={`w-6 h-6 ${form.paymentMethod === 'stripe' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <div className="text-left">
                      <p className={`font-bold ${form.paymentMethod === 'stripe' ? 'text-indigo-900' : 'text-slate-700'}`}>Credit Card (Stripe)</p>
                      <p className="text-xs text-slate-500">Pay securely via Stripe</p>
                    </div>
                  </button>
                  <button type="button" onClick={() => setForm({...form, paymentMethod: 'razorpay'})} className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${form.paymentMethod === 'razorpay' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300'}`}>
                    <Wallet className={`w-6 h-6 ${form.paymentMethod === 'razorpay' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <div className="text-left">
                      <p className={`font-bold ${form.paymentMethod === 'razorpay' ? 'text-indigo-900' : 'text-slate-700'}`}>UPI / Razorpay</p>
                      <p className="text-xs text-slate-500">Popular in India</p>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl sticky top-32">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                {items.map((item) => (
                  <div key={item.planId} className="flex justify-between items-start pb-4 border-b border-slate-700">
                    <div className="pr-4">
                      <p className="font-bold text-slate-100">{item.applicationName}</p>
                      <p className="text-sm text-slate-400">{item.planName} ({item.billingCycle})</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">₹{item.price}</p>
                      <button onClick={() => removeItem(item.planId)} className="text-xs text-red-400 hover:text-red-300 mt-1">Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-8">
                {totalMonthly > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Monthly</span>
                    <span className="font-bold">₹{totalMonthly}</span>
                  </div>
                )}
                {totalYearly > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Yearly</span>
                    <span className="font-bold">₹{totalYearly}</span>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                className="w-full py-4 bg-indigo-500 text-white rounded-xl font-bold text-lg hover:bg-indigo-400 transition-colors shadow-lg"
              >
                Complete Payment
              </button>
              
              <p className="text-xs text-slate-500 text-center mt-6">
                By subscribing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
