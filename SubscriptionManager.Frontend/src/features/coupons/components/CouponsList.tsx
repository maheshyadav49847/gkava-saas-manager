import { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Trash2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { CouponDto } from '../types';
import { couponsApi } from '../api';
import { CreateCouponModalView } from './CreateCouponModalView';
import { EditCouponModalView } from './EditCouponModalView';

// Trigger IDE refresh
export const CouponsList = () => {
  const [coupons, setCoupons] = useState<CouponDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponDto | null>(null);

  const fetchCoupons = () => {
    setIsLoading(true);
    couponsApi.getCoupons()
      .then((data: CouponDto[]) => {
        setCoupons(data);
        setIsLoading(false);
      })
      .catch((err: any) => {
        console.error("Failed to fetch coupons:", err);
        setError("Could not load coupons from the server.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this coupon? This action cannot be undone.')) return;
    
    try {
      await couponsApi.deleteCoupon(id);
      fetchCoupons();
    } catch (error) {
      console.error('Failed to delete coupon:', error);
      alert('Failed to delete coupon.');
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex items-center justify-between mb-10">
          <div className="flex gap-4 items-center">
            <div className="w-14 h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            <div className="space-y-2">
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-48"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-64"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-rose-200 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-800 rounded-xl">
        <AlertCircle className="w-10 h-10 text-rose-500 mb-4" />
        <h3 className="text-lg font-semibold text-rose-700 dark:text-rose-400">Failed to load</h3>
        <p className="text-rose-600 dark:text-rose-300 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4 max-w-2xl">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl shrink-0">
            <Tag className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Coupons & Discounts</h2>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Manage promotional codes and discounts for your subscriptions.
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-500 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      {coupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
          <Tag className="w-12 h-12 text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No coupons created</h3>
          <p className="text-slate-500 mt-2 max-w-md">Create your first discount code to offer to your customers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {coupons.map((coupon) => {
            const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
            const isMaxedOut = coupon.maxUses && coupon.currentUses >= coupon.maxUses;
            const isUsable = coupon.isActive && !isExpired && !isMaxedOut;

            return (
              <div 
                key={coupon.id}
                className={`flex flex-col p-6 bg-white dark:bg-slate-900 rounded-3xl border shadow-sm transition-all duration-300 hover:shadow-xl ${
                  isUsable 
                    ? "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700"
                    : "border-slate-200 dark:border-slate-800 opacity-75 grayscale-[30%]"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold tracking-wider font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-slate-900 dark:text-white">
                      {coupon.code}
                    </span>
                    {isUsable ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    )}
                  </div>
                  <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    isUsable ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                             : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                  }`}>
                    {isUsable ? 'Active' : (isExpired ? 'Expired' : (isMaxedOut ? 'Maxed Out' : 'Inactive'))}
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-6 text-indigo-600 dark:text-indigo-400">
                  <span className="text-4xl font-extrabold tracking-tight">
                    {coupon.discountType === 'FixedAmount' && '₹'}
                    {coupon.discountValue}
                    {coupon.discountType === 'Percentage' && '%'}
                  </span>
                  <span className="font-medium text-slate-500 text-sm">OFF</span>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Usage</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {coupon.currentUses} {coupon.maxUses ? `/ ${coupon.maxUses}` : 'uses'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Expires</span>
                    <span className="font-medium text-slate-900 dark:text-white">{formatDate(coupon.expiryDate)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <button 
                    onClick={() => setEditingCoupon(coupon)}
                    className="w-full py-2 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(coupon.id)}
                    className="w-full py-2 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateCouponModalView
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchCoupons}
      />

      <EditCouponModalView
        isOpen={!!editingCoupon}
        onClose={() => setEditingCoupon(null)}
        onSuccess={fetchCoupons}
        coupon={editingCoupon}
      />
    </div>
  );
};
