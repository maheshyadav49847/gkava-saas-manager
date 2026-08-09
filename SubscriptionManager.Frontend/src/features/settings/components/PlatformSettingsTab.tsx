import React, { useState, useEffect } from 'react';
import { Save, Loader2, Globe } from 'lucide-react';
import { getPlatformSettings, updatePlatformSettings } from '../api';

export function PlatformSettingsTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    supportEmail: '',
    privacyEmail: '',
    legalEmail: '',
    contactPhone: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getPlatformSettings();
      setFormData({
        supportEmail: data.supportEmail || '',
        privacyEmail: data.privacyEmail || '',
        legalEmail: data.legalEmail || '',
        contactPhone: data.contactPhone || ''
      });
    } catch (err) {
      setError('Failed to load platform settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await updatePlatformSettings(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update platform settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
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
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        
        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">Platform settings updated successfully</div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div className="sm:col-span-2">
            <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700">
              Support / Contact Email
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="supportEmail"
                id="supportEmail"
                value={formData.supportEmail}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Displayed on the Contact Us page.</p>
          </div>

          <div>
            <label htmlFor="privacyEmail" className="block text-sm font-medium text-gray-700">
              Privacy Email
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="privacyEmail"
                id="privacyEmail"
                value={formData.privacyEmail}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Displayed in Privacy Policy and Cookies Policy.</p>
          </div>

          <div>
            <label htmlFor="legalEmail" className="block text-sm font-medium text-gray-700">
              Legal Email
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="legalEmail"
                id="legalEmail"
                value={formData.legalEmail}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Displayed in Terms of Service.</p>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
              Contact Phone
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="contactPhone"
                id="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Displayed on the Contact Us page.</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {saving ? (
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
