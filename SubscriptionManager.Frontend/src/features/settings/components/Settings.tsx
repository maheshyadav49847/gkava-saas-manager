import { useState } from 'react';
import { Settings as SettingsIcon, User, ShieldCheck } from 'lucide-react';
import { ProfileTab } from './ProfileTab';
import { SecurityTab } from './SecurityTab';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-5 border-b border-slate-200 dark:border-slate-800/60 pb-8">
        <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-3xl shadow-sm border border-indigo-200/50 dark:border-indigo-500/20 shrink-0">
          <SettingsIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 tracking-tight">Account Settings</h2>
          <p className="mt-2 text-lg text-slate-500 dark:text-slate-400 font-medium">
            Manage your personal profile and security preferences.
          </p>
        </div>
      </div>

      {/* Main Content: Unified Flat Card */}
      <div className="flex flex-col lg:flex-row items-stretch mt-8 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Left Panel: Navigation */}
        <div className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r-2 border-slate-200 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-900">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 px-2">Settings Menu</h4>
          <nav className="flex lg:flex-col gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap text-left ${
                activeTab === 'profile'
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              Profile Details
            </button>
            
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap text-left ${
                activeTab === 'security'
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className={`w-5 h-5 ${activeTab === 'security' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              Security & Password
            </button>
          </nav>
        </div>

        {/* Right Panel: Content Area */}
        <div className="flex-1 w-full min-w-0 p-6 lg:p-10">
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'security' && <SecurityTab />}
          </div>
        </div>
      </div>
    </div>
  );
};
