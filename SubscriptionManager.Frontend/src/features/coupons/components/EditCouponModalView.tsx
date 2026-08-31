import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2, Edit2, Save } from 'lucide-react';
import { couponsApi } from '../api';
import { UpdateCouponDto, CouponDto } from '../types';

interface EditCouponModalViewProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  coupon: CouponDto | null;
}

export const EditCouponModalView = ({ isOpen, onClose, onSuccess, coupon }: EditCouponModalViewProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<UpdateCouponDto>({
    id: '',
    code: '',
    discountType: 'Percentage',
    discountValue: 0,
    maxUses: null,
    expiryDate: null,
    isActive: true
  });

  useEffect(() => {
    if (coupon && isOpen) {
      setFormData({
        id: coupon.id,
        code: coupon.code,
        description: coupon.description || '',
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxUses: coupon.maxUses,
        expiryDate: coupon.expiryDate,
        isActive: coupon.isActive
      });
    }
  }, [coupon, isOpen]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateCouponDto) => couponsApi.updateCoupon(coupon!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      onSuccess();
      onClose();
    },
    onError: (error: any) => {
      console.error('Failed to update coupon', error);
      alert(error?.response?.data?.detail || 'Failed to update coupon');
    }
  });

  if (!isOpen || !coupon) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white  rounded-sm shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[#E3E8EE]  animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-[#E3E8EE]  sticky top-0 bg-white/80  backdrop-blur-md z-10">
          <h2 className="text-xl font-bold text-[#0A2540]  flex items-center gap-2">
            <div className="p-2 bg-slate-100  rounded-sm">
              <Edit2 className="w-5 h-5 text-[#0A2540] " />
            </div>
            Edit Coupon Code
          </h2>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-[#425466] rounded-sm hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#425466]  mb-1">Coupon Code</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
                placeholder="e.g. SUMMER20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#425466] mb-1">Description (Optional)</label>
              <input
                type="text"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
                placeholder="e.g. 20% off for Summer Sale"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#425466]  mb-1">Discount Type</label>
                <select
                  required
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'Percentage' | 'FixedAmount' })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="FixedAmount">Fixed Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#425466]  mb-1">Discount Value</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
                  placeholder={formData.discountType === 'Percentage' ? '10' : '500'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#425466]  mb-1">Max Uses (Optional)</label>
              <input
                type="number"
                min="1"
                value={formData.maxUses || ''}
                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
                placeholder="Leave blank for unlimited"
              />
              {coupon.currentUses > 0 && (
                <p className="text-xs text-[#425466] mt-1">Currently used {coupon.currentUses} times.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#425466] mb-1">Expiry Date (Optional)</label>
              <DatePicker
                selected={formData.expiryDate ? new Date(formData.expiryDate) : null}
                onChange={(date: Date | null) => {
                  if (date) {
                    setFormData({ ...formData, expiryDate: date.toISOString() });
                  } else {
                    setFormData({ ...formData, expiryDate: null });
                  }
                }}
                minDate={new Date()}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
                placeholderText="Select expiry date and time"
                isClearable
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="yyyy-MM-dd h:mm aa"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="editIsActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-[#0A2540] rounded-sm border-[#E3E8EE] focus:ring-indigo-500/20"
              />
              <label htmlFor="editIsActive" className="text-sm font-medium text-[#425466] ">
                Active (can be used immediately)
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#E3E8EE] ">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 text-[#425466] bg-white hover:bg-[#F6F9FC] border border-[#E3E8EE] rounded-sm transition-colors shadow-sm"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 text-white bg-[#635BFF] hover:bg-[#0A2540] border border-transparent rounded-sm shadow-[0_2px_5px_rgba(0,0,0,0.12)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
