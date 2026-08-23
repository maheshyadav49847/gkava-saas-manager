import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Loader2, Globe, Mail, CreditCard, Key } from 'lucide-react';
import { getPlatformSettings, updatePlatformSettings } from '../api';

export function PlatformSettingsTab() {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    supportEmail: '',
    privacyEmail: '',
    legalEmail: '',
    contactPhone: '',
    cashfreeAppId: '',
    cashfreeSecretKey: '',
    cashfreeEnvironment: 'SANDBOX'
  });

  const { data: settings, isLoading, isError } = useQuery({
    queryKey: ['platformSettings'],
    queryFn: getPlatformSettings,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        supportEmail: settings.supportEmail || '',
        privacyEmail: settings.privacyEmail || '',
        legalEmail: settings.legalEmail || '',
        contactPhone: settings.contactPhone || '',
        cashfreeAppId: settings.cashfreeAppId || '',
        cashfreeSecretKey: settings.cashfreeSecretKey || '',
        cashfreeEnvironment: settings.cashfreeEnvironment || 'SANDBOX'
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: updatePlatformSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platformSettings'] });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: () => {
      setError('Failed to update platform settings');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    updateMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#0A2540]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
          <Globe className="h-5 w-5 mr-2 text-gray-400" />
          Public Website Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Update the contact information displayed on the public website.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {(error || isError) && (
          <div className="rounded-sm bg-red-50 p-4">
            <div className="text-sm text-red-700">{error || 'Failed to load platform settings'}</div>
          </div>
        )}
        
        {success && (
          <div className="rounded-sm bg-green-50 p-4">
            <div className="text-sm text-green-700">Platform settings updated successfully</div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div className="sm:col-span-2">
            <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Support / Contact Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="supportEmail"
                id="supportEmail"
                value={formData.supportEmail}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540]"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">Displayed on the Contact Us page.</p>
          </div>

          <div>
            <label htmlFor="privacyEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Privacy Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="privacyEmail"
                id="privacyEmail"
                value={formData.privacyEmail}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540]"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">Displayed in Privacy Policy and Cookies Policy.</p>
          </div>

          <div>
            <label htmlFor="legalEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Legal Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="legalEmail"
                id="legalEmail"
                value={formData.legalEmail}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540]"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">Displayed in Terms of Service.</p>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone
            </label>
            <div className="relative">
              <input
                type="text"
                name="contactPhone"
                id="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540]"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-4 w-4 text-slate-400" />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">Displayed on the Contact Us page.</p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <div className="mb-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
              Payment Gateway (Cashfree)
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure your Cashfree API keys for processing subscriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div className="sm:col-span-2">
              <label htmlFor="cashfreeEnvironment" className="block text-sm font-medium text-gray-700 mb-1">
                Environment
              </label>
              <select
                name="cashfreeEnvironment"
                id="cashfreeEnvironment"
                value={formData.cashfreeEnvironment}
                onChange={handleChange}
                className="w-full py-2 px-3 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540]"
              >
                <option value="SANDBOX">Sandbox (Test)</option>
                <option value="PRODUCTION">Production (Live)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="cashfreeAppId" className="block text-sm font-medium text-gray-700 mb-1">
                Cashfree App ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="cashfreeAppId"
                  id="cashfreeAppId"
                  value={formData.cashfreeAppId}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540]"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="cashfreeSecretKey" className="block text-sm font-medium text-gray-700 mb-1">
                Cashfree Secret Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="cashfreeSecretKey"
                  id="cashfreeSecretKey"
                  value={formData.cashfreeSecretKey}
                  onChange={handleChange}
                  placeholder={formData.cashfreeSecretKey === '***' ? 'Stored securely. Enter new key to replace.' : ''}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540]"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="inline-flex justify-center rounded-sm border border-transparent bg-[#635BFF] py-2 px-4 text-sm font-medium text-white shadow-[0_2px_5px_rgba(0,0,0,0.12)] hover:bg-[#0A2540] transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-2 disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
