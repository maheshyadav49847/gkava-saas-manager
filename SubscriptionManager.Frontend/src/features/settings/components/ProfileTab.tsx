import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { updateProfile } from '../api';
import { Save, Loader2, User, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ProfileTab = () => {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await updateProfile({ name, email });
      // Update local auth context with new details
      login(response);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Information</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Update your account's profile information and email address.</p>
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
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-transparent border-2 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-0 focus:border-indigo-500 text-slate-900 dark:text-white transition-all text-base hover:border-slate-300 dark:hover:border-slate-700"
                placeholder="e.g. John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-transparent border-2 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-0 focus:border-indigo-500 text-slate-900 dark:text-white transition-all text-base hover:border-slate-300 dark:hover:border-slate-700"
                placeholder="admin@antigravity.com"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isLoading || (!name.trim() || !email.trim())}
            className="flex items-center gap-2 px-8 py-3 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-500 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
