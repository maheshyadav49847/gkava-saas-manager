import { useState, useEffect } from 'react';
import { X, Loader2, Users, Plus } from 'lucide-react';
import { createTenant } from '../api';
import { CreateTenantDto } from '../types';
import { getPlans } from '../../plans/api';
import { Plan } from '../../plans/types';
import { couponsApi } from '../../coupons/api';
import { CouponDto } from '../../coupons/types';

interface CreateTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTenantModal = ({ isOpen, onClose, onSuccess }: CreateTenantModalProps) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [formData, setFormData] = useState<CreateTenantDto>({
    name: '',
    email: '',
    phone: '',
    planId: '',
    couponCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponDto | null>(null);

  const handleValidateCoupon = async () => {
    if (!formData.couponCode) {
      setCouponError("Please enter a coupon code");
      return;
    }
    
    setIsValidatingCoupon(true);
    setCouponError(null);
    try {
      const coupon = await couponsApi.validateCoupon(formData.couponCode);
      setAppliedCoupon(coupon);
    } catch (error: any) {
      setAppliedCoupon(null);
      setCouponError(error?.response?.data?.detail || "Invalid or expired coupon");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getPlans().then(setPlans);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createTenant(formData);
      setFormData({ name: '', email: '', phone: '', planId: '', couponCode: '' });
      setAppliedCoupon(null);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create tenant', error);
      alert('Failed to create tenant');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl">
              <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            Add New Tenant
          </h2>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company/Tenant Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-0 focus:border-indigo-500 text-slate-900 dark:text-white transition-all"
              placeholder="Acme Corp"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Admin Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-0 focus:border-indigo-500 text-slate-900 dark:text-white transition-all"
              placeholder="admin@acme.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-0 focus:border-indigo-500 text-slate-900 dark:text-white transition-all"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Initial Plan</label>
            <select
              required
              value={formData.planId}
              onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-0 focus:border-indigo-500 text-slate-900 dark:text-white transition-all"
            >
              <option value="">Select a plan</option>
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.name} - ${plan.monthlyPrice}/mo</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Discount / Coupon Code (Optional)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.couponCode || ''}
                onChange={(e) => {
                  setFormData({ ...formData, couponCode: e.target.value.toUpperCase() });
                  setCouponError(null);
                  if (appliedCoupon && e.target.value.toUpperCase() !== appliedCoupon.code) {
                    setAppliedCoupon(null);
                  }
                }}
                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-0 focus:border-indigo-500 text-slate-900 dark:text-white transition-all font-mono uppercase"
                placeholder="e.g. SUMMER20"
              />
              <button
                type="button"
                onClick={handleValidateCoupon}
                disabled={!formData.couponCode || isValidatingCoupon || appliedCoupon?.code === formData.couponCode}
                className="px-4 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors disabled:opacity-50"
              >
                {isValidatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
              </button>
            </div>
            {couponError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{couponError}</p>
            )}
            {appliedCoupon && (
              <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                ✅ Coupon Applied: {appliedCoupon.discountType === 'Percentage' ? `${appliedCoupon.discountValue}% OFF` : `₹${appliedCoupon.discountValue} OFF`}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium flex items-center gap-2 text-indigo-600 dark:text-indigo-400 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border-2 border-indigo-600 dark:border-indigo-500 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Create Tenant
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
