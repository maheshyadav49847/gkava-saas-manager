import { useState } from 'react';
import { X, Building, Mail, Phone, CalendarDays, CreditCard, ExternalLink, Package, History, FileText, Settings, ShieldAlert, Key } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { appsettings } from '../../../config/appsettings';

export const TenantProfileDrawer = ({ tenantId, isOpen, onClose }: { tenantId: string | null, isOpen: boolean, onClose: () => void }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'billing' | 'settings'>('overview');

  const { data: tenant, isLoading } = useQuery({
    queryKey: ['tenantDetails', tenantId],
    queryFn: async () => {
      if (!tenantId) return null;
      const res = await fetch(`${appsettings.apiUrl}/tenants/${tenantId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return res.json();
    },
    enabled: !!tenantId && isOpen
  });

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`absolute top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        
        {/* Header - Upgraded Design */}
        <div className="bg-[#0A2540] text-white p-6 pb-0 shrink-0">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-md flex items-center justify-center border border-white/20 shadow-inner">
                <Building size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">{isLoading ? 'Loading...' : tenant?.name}</h2>
                <p className="text-indigo-200 text-sm font-medium mt-0.5">Tenant ID: {tenant?.id?.split('-')[0]}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-indigo-200 hover:text-white hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-4 pb-6">
            <button className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-sm text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 backdrop-blur-md border border-white/10">
              <Key size={14} /> Impersonate
            </button>
            <button className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-sm text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 backdrop-blur-md border border-white/10">
              <Mail size={14} /> Email User
            </button>
            <button className="flex-1 bg-rose-500/20 hover:bg-rose-500/40 text-rose-100 px-3 py-1.5 rounded-sm text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 backdrop-blur-md border border-rose-500/20">
              <ShieldAlert size={14} /> Suspend
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-white/10">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'billing', label: 'Billing & Plans' },
              { id: 'settings', label: 'Settings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === tab.id ? 'text-white' : 'text-indigo-300 hover:text-indigo-100'}`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#635BFF] rounded-t-full shadow-[0_0_10px_rgba(99,91,255,0.8)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-[#F6F9FC] p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
              <div className="w-8 h-8 border-2 border-[#635BFF] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">Fetching details...</p>
            </div>
          ) : !tenant ? (
            <div className="text-center text-sm text-slate-500 mt-10">No tenant data found.</div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* TAB: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Contact Info Card */}
                  <div className="bg-white rounded-md shadow-sm border border-[#E3E8EE] overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-[#E3E8EE] flex justify-between items-center">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Information</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                          <Mail size={14} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Primary Email</p>
                          <p className="text-sm font-medium text-slate-900">{tenant.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                          <Phone size={14} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Phone Number</p>
                          <p className="text-sm font-medium text-slate-900">{tenant.phoneCountryCode} {tenant.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                          <CalendarDays size={14} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Member Since</p>
                          <p className="text-sm font-medium text-slate-900">{new Date(tenant.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: BILLING */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  {/* Payment Method */}
                  <div className="bg-white rounded-md shadow-sm border border-[#E3E8EE] overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-[#E3E8EE] flex justify-between items-center">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Method</h3>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-sm bg-indigo-50 flex items-center justify-center text-[#635BFF] shrink-0 border border-indigo-100">
                          <CreditCard size={20} />
                        </div>
                        <div className="flex-1">
                          {tenant.paymentProviderCustomerId ? (
                            <>
                              <h4 className="text-sm font-bold text-slate-900">Stripe Customer Linked</h4>
                              <p className="text-xs text-slate-500 mt-1 font-mono bg-slate-100 inline-block px-1.5 py-0.5 rounded">{tenant.paymentProviderCustomerId}</p>
                            </>
                          ) : (
                            <h4 className="text-sm font-medium text-slate-500">No payment method on file</h4>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-5 pt-4 border-t border-[#E3E8EE] flex gap-3">
                        <button 
                          onClick={() => {
                            onClose();
                            navigate('/invoices'); // Routes to invoices tab
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-[#0A2540] bg-white border border-[#E3E8EE] hover:bg-slate-50 rounded-sm transition-colors shadow-sm"
                        >
                          <FileText size={14} /> View All Invoices
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Subscriptions */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Active Subscriptions</h3>
                    {tenant.subscriptions?.length === 0 ? (
                      <div className="bg-white p-6 rounded-md shadow-sm border border-dashed border-slate-300 text-center flex flex-col items-center">
                        <Package size={24} className="text-slate-300 mb-2" />
                        <p className="text-sm text-slate-500 font-medium">No active subscriptions</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {tenant.subscriptions?.map((sub: any) => (
                          <div key={sub.id} className="bg-white rounded-md shadow-sm border border-[#E3E8EE] relative overflow-hidden group hover:border-[#635BFF]/30 transition-colors">
                            <div className={`absolute top-0 left-0 w-1 h-full ${sub.status === 'Active' ? 'bg-[#10B981]' : 'bg-slate-300'}`} />
                            <div className="p-4 pl-5">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-[#0A2540] text-sm">{sub.applicationName}</h4>
                                    <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold tracking-wide uppercase border ${sub.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                                      {sub.status}
                                    </span>
                                  </div>
                                  <p className="text-sm font-medium text-[#635BFF]">{sub.planName}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-slate-900">₹{sub.planPrice}</p>
                                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">/month</p>
                                </div>
                              </div>
                              
                              <div className="bg-slate-50 rounded p-3 flex justify-between items-center border border-[#E3E8EE]">
                                <div>
                                  <p className="text-xs text-slate-500 mb-0.5 font-medium">Current Period Ends</p>
                                  <p className="text-sm font-bold text-slate-700">{new Date(sub.endDate).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-slate-500 mb-0.5 font-medium">Auto-Renew</p>
                                  <p className={`text-sm font-bold ${sub.cancelAtPeriodEnd ? 'text-rose-600' : 'text-[#10B981]'}`}>
                                    {sub.cancelAtPeriodEnd ? 'Disabled' : 'Active'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="bg-white rounded-md shadow-sm border border-[#E3E8EE] p-8 text-center flex flex-col items-center justify-center">
                  <Settings size={32} className="text-slate-300 mb-3" />
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Advanced Settings</h3>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto">Manage API keys, webhooks, and advanced configurations for this tenant.</p>
                  <button className="mt-4 px-4 py-2 bg-[#F6F9FC] border border-[#E3E8EE] rounded-sm text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                    Coming Soon
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
