import { useState } from 'react';
import { User, ShieldCheck, Globe , Settings as SettingsIcon, Terminal } from 'lucide-react';
import { ProfileTab } from './ProfileTab';
import { SecurityTab } from './SecurityTab';
import { PlatformSettingsTab } from './PlatformSettingsTab';
import { WebhooksTab } from '../../webhooks/components/WebhooksTab';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'platform' | 'webhooks'>('profile');

  return (
            <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 border-b border-[#E3E8EE] pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E3E8EE] text-[#635BFF] shrink-0">
            <SettingsIcon className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0A2540]">Account Settings</h1>
            <p className="text-sm text-[#425466] mt-1">
              Manage your personal profile and platform preferences.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content: Unified Flat Card */}
      <div className="flex flex-col lg:flex-row items-stretch mt-8 bg-white rounded-sm border border-[#EAEAEA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        
        {/* Left Panel: Navigation */}
        <div className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r-2 border-[#E3E8EE]  p-6 bg-[#F6F9FC] ">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#425466]/60  mb-4 px-2">Settings Menu</h4>
          <nav className="flex lg:flex-col gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm font-medium transition-colors whitespace-nowrap text-left ${
                activeTab === 'profile'
                  ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-[#635BFF]'
                  : 'text-[#425466]  hover:bg-slate-100 hover:text-[#0A2540]'
              }`}
            >
              <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-[#0A2540] ' : 'text-[#425466]/60'}`} />
              Profile Details
            </button>
            
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm font-medium transition-colors whitespace-nowrap text-left ${
                activeTab === 'security'
                  ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-[#635BFF]'
                  : 'text-[#425466]  hover:bg-slate-100 hover:text-[#0A2540]'
              }`}
            >
              <ShieldCheck className={`w-5 h-5 ${activeTab === 'security' ? 'text-[#0A2540] ' : 'text-[#425466]/60'}`} />
              Security & Password
            </button>
            
            <button
              onClick={() => setActiveTab('platform')}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm font-medium transition-colors whitespace-nowrap text-left ${
                activeTab === 'platform'
                  ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-[#635BFF]'
                  : 'text-[#425466]  hover:bg-slate-100 hover:text-[#0A2540]'
              }`}
            >
              <Globe className={`w-5 h-5 ${activeTab === 'platform' ? 'text-[#0A2540] ' : 'text-[#425466]/60'}`} />
              Platform Settings
            </button>

            <button
              onClick={() => setActiveTab('webhooks')}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm font-medium transition-colors whitespace-nowrap text-left ${
                activeTab === 'webhooks'
                  ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-[#635BFF]'
                  : 'text-[#425466] hover:bg-slate-100 hover:text-[#0A2540]'
              }`}
            >
              <Terminal className={`w-5 h-5 ${activeTab === 'webhooks' ? 'text-[#0A2540]' : 'text-[#425466]/60'}`} />
              Developer & Webhooks
            </button>
          </nav>
        </div>

        {/* Right Panel: Content Area */}
        <div className="flex-1 w-full min-w-0 p-6 lg:p-10">
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 w-full max-w-4xl">
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'platform' && <PlatformSettingsTab />}
            {activeTab === 'webhooks' && <WebhooksTab />}
          </div>
        </div>
      </div>
    </div>
  );
};
