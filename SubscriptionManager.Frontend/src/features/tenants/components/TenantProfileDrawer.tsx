import { X, Building, Mail, Phone, CalendarDays, CreditCard, ExternalLink, Package } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { appsettings } from '../../../../config/appsettings';

export const TenantProfileDrawer = ({ tenantId, isOpen, onClose }: { tenantId: string | null, isOpen: boolean, onClose: () => void }) => {
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
    <div className={`fixed inset-0 z-50 transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E3E8EE] shrink-0 bg-white">
          <h2 className="text-xl font-semibold text-slate-900">Tenant Details</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-sm transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-[#F6F9FC] p-6 space-y-6">
          {isLoading ? (
            <div className="text-center text-sm text-slate-500 mt-10">Loading profile...</div>
          ) : !tenant ? (
            <div className="text-center text-sm text-slate-500 mt-10">No tenant data found.</div>
          ) : (
            <>
              {/* Overview Section */}
              <div className="bg-white p-5 rounded-md shadow-sm border border-[#E3E8EE]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-sm bg-indigo-50 flex items-center justify-center text-[#635BFF] border border-indigo-100 shrink-0">
                    <Building size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">{tenant.name}</h3>
                    <p className="text-sm text-slate-500">ID: {tenant.id.split('-')[0]}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mt-5 pt-5 border-t border-[#E3E8EE]">
                  <div className="flex items-center text-sm text-slate-600 gap-3">
                    <Mail size={16} className="text-slate-400" />
                    <span className="font-medium text-slate-900">{tenant.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 gap-3">
                    <Phone size={16} className="text-slate-400" />
                    <span>{tenant.phoneCountryCode} {tenant.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 gap-3">
                    <CalendarDays size={16} className="text-slate-400" />
                    <span>Joined {new Date(tenant.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Active Subscriptions Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Subscribed Products</h4>
                
                {tenant.subscriptions?.length === 0 ? (
                  <div className="bg-white p-4 rounded-md shadow-sm border border-[#E3E8EE] text-center text-sm text-slate-500">
                    No active subscriptions
                  </div>
                ) : (
                  tenant.subscriptions?.map((sub: any) => (
                    <div key={sub.id} className="bg-white p-4 rounded-md shadow-sm border border-[#E3E8EE] relative overflow-hidden group">
                      <div className={`absolute top-0 left-0 w-1 h-full ${sub.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'}`} />
                      
                      <div className="flex justify-between items-start mb-2 pl-3">
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-[#635BFF]" />
                          <span className="font-semibold text-[#0A2540]">{sub.applicationName}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-semibold border ${sub.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                          {sub.status}
                        </span>
                      </div>
                      
                      <div className="pl-3 mt-3">
                        <p className="text-sm font-medium text-slate-700 mb-1">{sub.planName} <span className="text-slate-400 font-normal ml-1">· ₹{sub.planPrice}/mo</span></p>
                        <div className="text-xs text-slate-500 space-y-1">
                          <p>Started: {new Date(sub.startDate).toLocaleDateString()}</p>
                          <p>Renews/Expires: {new Date(sub.endDate).toLocaleDateString()}</p>
                          <p>Auto-renew: <span className={sub.cancelAtPeriodEnd ? 'text-red-500 font-medium' : 'text-green-600 font-medium'}>{sub.cancelAtPeriodEnd ? 'Disabled' : 'Enabled'}</span></p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Payment Details Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Billing Details</h4>
                <div className="bg-white p-5 rounded-md shadow-sm border border-[#E3E8EE]">
                  <div className="flex items-start gap-3">
                    <CreditCard size={18} className="text-slate-400 mt-0.5" />
                    <div>
                      {tenant.paymentProviderCustomerId ? (
                        <>
                          <p className="text-sm font-medium text-slate-900">Payment Account Linked</p>
                          <p className="text-xs text-slate-500 mt-1 font-mono">{tenant.paymentProviderCustomerId}</p>
                        </>
                      ) : (
                        <p className="text-sm text-slate-500">No payment provider linked</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-[#E3E8EE]">
                    <a href="#" className="text-sm text-[#635BFF] hover:text-[#0A2540] font-medium flex items-center gap-1 transition-colors">
                      View full billing history <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
