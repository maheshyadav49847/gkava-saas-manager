import { useState } from 'react';
import { changePassword } from '../api';
import { Save, Loader2, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

export const SecurityTab = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      await changePassword({ currentPassword, newPassword });
      setMessage({ type: 'success', text: 'Password changed successfully. You can use it on your next login.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password. Please check your current password.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Security Settings</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Ensure your account is using a long, random password to stay secure.</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${message.type === 'success'
          ? 'bg-emerald-50 border-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
          : 'bg-rose-50 border-rose-100 text-rose-800 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400'
          }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-transparent">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Current Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-transparent border-2 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-0 focus:border-indigo-500 text-slate-900 dark:text-white transition-all text-base hover:border-slate-300 dark:hover:border-slate-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">New Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-transparent border-2 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-0 focus:border-indigo-500 text-slate-900 dark:text-white transition-all text-base hover:border-slate-300 dark:hover:border-slate-700"
                placeholder="New password (min. 8 characters)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Confirm New Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-transparent border-2 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-0 focus:border-indigo-500 text-slate-900 dark:text-white transition-all text-base hover:border-slate-300 dark:hover:border-slate-700"
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
            className="flex items-center gap-2 px-8 py-3 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-500 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};
