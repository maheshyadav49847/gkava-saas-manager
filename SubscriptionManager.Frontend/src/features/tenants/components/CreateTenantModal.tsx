import { useState } from 'react';
import { X, Loader2, Users, Plus } from 'lucide-react';
import { getCountries } from '@/lib/apiClient';
import { useQuery, useMutation } from '@tanstack/react-query';
import { createTenant } from '../api';
import { CreateTenantDto } from '../types';
import { getPlans } from '../../plans/api';
import { couponsApi } from '../../coupons/api';
import { CouponDto } from '../../coupons/types';

interface CreateTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTenantModal = ({ isOpen, onClose, onSuccess }: CreateTenantModalProps) => {
  const [formData, setFormData] = useState<CreateTenantDto>({
    name: '',
    email: '',
    phoneCountryCode: '+91',
    phone: '',
    planId: '',
    couponCode: ''
  });
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponDto | null>(null);

  
  const { data: countries = [] } = useQuery({ queryKey: ['countries'], queryFn: getCountries });
  const { data: plans = [] } = useQuery({
    queryKey: ['plans'],
    queryFn: getPlans,
    enabled: isOpen,
  });

  const validateCouponMutation = useMutation({
    mutationFn: (code: string) => couponsApi.validateCoupon(code),
    onSuccess: (coupon) => {
      setAppliedCoupon(coupon);
      setCouponError(null);
    },
    onError: (error: any) => {
      setAppliedCoupon(null);
      setCouponError(error?.response?.data?.detail || "Invalid or expired coupon");
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateTenantDto) => createTenant(data),
    onSuccess: () => {
      setFormData({ name: '', email: '', phoneCountryCode: '+91', phone: '', planId: '', couponCode: '' });
      setAppliedCoupon(null);
      onSuccess();
      onClose();
    },
    onError: (error) => {
      console.error('Failed to create tenant', error);
      alert('Failed to create tenant');
    },
  });

  const handleValidateCoupon = () => {
    if (!formData.couponCode) {
      setCouponError("Please enter a coupon code");
      return;
    }
    setCouponError(null);
    validateCouponMutation.mutate(formData.couponCode);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white  rounded-sm shadow-xl w-full max-w-md border border-[#E3E8EE]  animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-[#E3E8EE] ">
          <h2 className="text-xl font-bold text-[#0A2540]  flex items-center gap-2">
            <div className="p-2 bg-slate-100  rounded-sm">
              <Users className="w-5 h-5 text-[#0A2540] " />
            </div>
            Add New Tenant
          </h2>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-[#425466] rounded-sm hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#425466]  mb-1">Company/Tenant Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
              placeholder="Acme Corp"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#425466]  mb-1">Admin Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
              placeholder="admin@acme.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#425466]  mb-1">Phone Number</label>
            <div className="flex gap-2">
              <select
                value={formData.phoneCountryCode}
                onChange={(e) => setFormData({ ...formData, phoneCountryCode: e.target.value })}
                className="w-24 px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540]"
              >
                {countries.map(c => (
                  <option key={c.id} value={c.phoneCode}>{c.phoneCode} ({c.id})</option>
                ))}
              </select>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="flex-1 px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
                placeholder="555 000-0000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#425466]  mb-1">Initial Plan</label>
            <select
              required
              value={formData.planId}
              onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
            >
              <option value="">Select a plan</option>
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.name} - ₹{plan.monthlyPrice}/mo</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#425466]  mb-1">Discount / Coupon Code (Optional)</label>
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
                className="flex-1 px-4 py-2.5 bg-[#F6F9FC]  border border-[#E3E8EE]  rounded-sm focus:outline-none focus:ring-0 focus:border-[#E3E8EE] text-[#0A2540]  transition-all font-mono uppercase"
                placeholder="e.g. SUMMER20"
              />
              <button
                type="button"
                onClick={handleValidateCoupon}
                disabled={!formData.couponCode || validateCouponMutation.isPending || appliedCoupon?.code === formData.couponCode}
                className="px-4 py-2.5 text-sm font-medium text-[#0A2540]  bg-[#F6F9FC]  rounded-sm hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                {validateCouponMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
              </button>
            </div>
            {couponError && (
              <p className="mt-2 text-sm text-red-600 ">{couponError}</p>
            )}
            {appliedCoupon && (
              <p className="mt-2 text-sm text-green-600  font-medium">
                ✅ Coupon Applied: {appliedCoupon.discountType === 'Percentage' ? `${appliedCoupon.discountValue}% OFF` : `₹${appliedCoupon.discountValue} OFF`}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 text-[#425466] bg-white hover:bg-[#F6F9FC] border border-[#E3E8EE] rounded-sm transition-colors shadow-sm"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 text-white bg-[#635BFF] hover:bg-[#0A2540] border border-transparent rounded-sm shadow-[0_2px_5px_rgba(0,0,0,0.12)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? (
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
