import { useState, useEffect } from 'react';
import { X, Loader2, Edit2, Save } from 'lucide-react';
import { getCountries } from '@/lib/apiClient';
import { useQuery, useMutation } from '@tanstack/react-query';
import { updateTenant, UpdateTenantDto } from '../api';
import { Tenant } from '../types';

interface EditTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tenant: Tenant | null;
}

export const EditTenantModal = ({ isOpen, onClose, onSuccess, tenant }: EditTenantModalProps) => {
  const [formData, setFormData] = useState<UpdateTenantDto>({
    id: '',
    name: '',
    email: '',
    phoneCountryCode: '+91',
    phone: ''
  });

  useEffect(() => {
    if (isOpen && tenant) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        id: tenant.id,
        name: tenant.name,
        email: tenant.email,
        phoneCountryCode: tenant.phoneCountryCode || '+91',
        phone: tenant.phone || ''
      });
    }
  }, [isOpen, tenant]);

  
  const { data: countries = [] } = useQuery({ queryKey: ['countries'], queryFn: getCountries });
  const updateMutation = useMutation({
    mutationFn: (data: UpdateTenantDto) => {
      if (!tenant) throw new Error('No tenant selected');
      return updateTenant(tenant.id, data);
    },
    onSuccess: () => {
      onSuccess();
      onClose();
    },
    onError: (error) => {
      console.error('Failed to update tenant', error);
      alert('Failed to update tenant');
    },
  });

  if (!isOpen || !tenant) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white  rounded-sm shadow-xl w-full max-w-md border border-[#E3E8EE]  animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-[#E3E8EE] ">
          <h2 className="text-xl font-bold text-[#0A2540]  flex items-center gap-2">
            <div className="p-2 bg-slate-100  rounded-sm">
              <Edit2 className="w-5 h-5 text-[#0A2540] " />
            </div>
            Edit Tenant
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
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E3E8EE]">
            <h3 className="text-sm font-semibold text-[#0A2540] mb-3">Feature Flags & Quota Overrides</h3>
            
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm text-[#425466] cursor-pointer">
                <input 
                  type="checkbox" 
                  defaultChecked={true}
                  className="w-4 h-4 rounded-sm border-[#E3E8EE] text-[#635BFF] focus:ring-[#635BFF]"
                />
                <span className="font-medium">enable_beta_reports</span>
              </label>
              
              <label className="flex items-center gap-2 text-sm text-[#425466] cursor-pointer">
                <input 
                  type="checkbox" 
                  defaultChecked={false}
                  className="w-4 h-4 rounded-sm border-[#E3E8EE] text-[#635BFF] focus:ring-[#635BFF]"
                />
                <span className="font-medium">bypass_rate_limits</span>
              </label>

              <div className="pt-2">
                <label className="block text-xs font-medium text-[#425466] mb-1">override_user_limit (0 = infinite)</label>
                <input
                  type="number"
                  defaultValue={50}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={updateMutation.isPending}
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
