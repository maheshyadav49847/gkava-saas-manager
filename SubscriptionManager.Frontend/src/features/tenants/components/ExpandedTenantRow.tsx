import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Phone, CalendarDays, CreditCard, AlertCircle, Pause, Play, Power, Key, Loader2, RefreshCw, Smartphone, Landmark } from 'lucide-react';
import { appsettings } from '../../../config/appsettings';
import { suspendTenant, resetTenantPassword, cancelTenantSubscription, changeTenantPlan } from '../api';


export const ExpandedTenantRow = ({ tenantId }: { tenantId: string }) => {
  const queryClient = useQueryClient();

  const suspendMutation = useMutation({
    mutationFn: (suspend: boolean) => suspendTenant(tenantId, suspend),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenantDetails', tenantId] });
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    }
  });


  const cancelSubMutation = useMutation({
    mutationFn: () => cancelTenantSubscription(tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenantDetails', tenantId] });
      alert('Subscription will cancel at period end.');
    }
  });

  const changePlanMutation = useMutation({
    mutationFn: (newPlanId: string) => changeTenantPlan(tenantId, newPlanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenantDetails', tenantId] });
      alert('Plan changed successfully!');
    }
  });

  const handleChangePlan = () => {
    const planId = prompt("Enter new Plan ID (UUID):");
    if (planId) changePlanMutation.mutate(planId);
  };

  const resetMutation = useMutation({
    mutationFn: () => resetTenantPassword(tenantId),
    onSuccess: () => alert('Password reset email sent!')
  });

  const { data: tenant, isLoading } = useQuery({
    queryKey: ['tenantDetails', tenantId],
    queryFn: async () => {
      const res = await fetch(`${appsettings.apiUrl}/tenants/${tenantId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return res.json();
    },
    enabled: !!tenantId
  });

  if (isLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-[#425466] bg-slate-50 border-b border-[#E3E8EE]">
        <Loader2 className="w-6 h-6 animate-spin mb-2 text-[#635BFF]" />
        <p className="text-sm font-medium">Loading complete profile...</p>
      </div>
    );
  }

  if (!tenant) return null;

  const renderPaymentIcon = (method: string) => {
    const m = method?.toLowerCase() || '';
    if (m.includes('upi')) return <Smartphone className="w-4 h-4 text-emerald-600" />;
    if (m.includes('bank') || m.includes('net')) return <Landmark className="w-4 h-4 text-blue-600" />;
    return <CreditCard className="w-4 h-4 text-indigo-600" />;
  };

  return (
    <div className="bg-[#F8FAFC] shadow-inner p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Profile & Payment */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          
          {/* Complete Profile */}
          <div className="bg-white rounded border border-[#E3E8EE] shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-[#E3E8EE]">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Complete Profile</h4>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tenant ID</p>
                <p className="text-xs font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded inline-block mt-0.5">{tenant.id}</p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center text-sm text-[#425466] mb-1.5">
                  <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" /> {tenant.email}
                </div>
                <div className="flex items-center text-sm text-[#425466] mb-1.5">
                  <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" /> {tenant.phoneCountryCode || '+91'} {tenant.phone}
                </div>
                <div className="flex items-center text-sm text-[#425466]">
                  <CalendarDays className="w-3.5 h-3.5 mr-2 text-slate-400" /> Joined {new Date(tenant.createdAt).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Billing Details */}
          <div className="bg-white rounded border border-[#E3E8EE] shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-[#E3E8EE]">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Details</h4>
            </div>
            <div className="p-4 space-y-3">
              {tenant.subscriptions?.[0]?.paymentMethod ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Method</span>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                      {renderPaymentIcon(tenant.subscriptions[0].paymentMethod)}
                      <span className="text-xs font-bold text-slate-700">{tenant.subscriptions[0].paymentMethod}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-slate-500">Details (UPI/Card/Bank)</span>
                    <span className="text-sm font-mono text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200 break-all">
                      {tenant.subscriptions[0].paymentDetails || tenant.paymentProviderCustomerId || 'N/A'}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-400 italic">No payment details on file.</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded border border-[#E3E8EE] shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-[#E3E8EE]">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Actions</h4>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">

              <button 
                onClick={handleChangePlan}
                disabled={changePlanMutation.isPending}
                className="flex flex-col items-center justify-center p-2 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 transition-colors gap-1"
              >
                {changePlanMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span className="text-[10px] font-bold">Change Plan</span>
              </button>
              <button 
                onClick={() => suspendMutation.mutate(!tenant.isSuspended)}
                disabled={suspendMutation.isPending}
                className={`flex flex-col items-center justify-center p-2 rounded transition-colors gap-1 border ${
                  tenant.isSuspended 
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100' 
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-100'
                }`}
              >
                {suspendMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (tenant.isSuspended ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />)}
                <span className="text-[10px] font-bold">{tenant.isSuspended ? 'Restore' : 'Suspend'}</span>
              </button>
              <button 
                onClick={() => resetMutation.mutate()}
                disabled={resetMutation.isPending}
                className="flex flex-col items-center justify-center p-2 rounded bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors gap-1"
              >
                {resetMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                <span className="text-[10px] font-bold">Reset Pass</span>
              </button>
              <button 
                onClick={() => { if(window.confirm('Cancel this subscription?')) cancelSubMutation.mutate(); }}
                disabled={cancelSubMutation.isPending}
                className="flex flex-col items-center justify-center p-2 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100 transition-colors gap-1"
              >
                {cancelSubMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
                <span className="text-[10px] font-bold">Cancel Sub</span>
              </button>

            </div>
          </div>

        </div>

        {/* Right Column: Subscription History */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded border border-[#E3E8EE] shadow-sm overflow-hidden h-full">
            <div className="bg-slate-50 px-4 py-3 border-b border-[#E3E8EE] flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subscription History</h4>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E3E8EE] bg-slate-50/50">
                    <th className="p-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Product & Plan</th>
                    <th className="p-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
                    <th className="p-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Billing Period</th>
                    <th className="p-3 font-semibold text-slate-600 text-xs uppercase tracking-wider text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E8EE]">
                  {tenant.subscriptions?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400">No subscription history found.</td>
                    </tr>
                  ) : (
                    tenant.subscriptions?.map((sub: any) => (
                      <tr key={sub.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <p className="font-semibold text-[#0A2540]">{sub.applicationName}</p>
                          <p className="text-xs text-[#635BFF] font-medium">{sub.planName}</p>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            sub.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            sub.status === 'Canceled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {sub.status}
                          </span>
                          {sub.cancelAtPeriodEnd && (
                            <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Cancels at end
                            </p>
                          )}
                        </td>
                        <td className="p-3">
                          <p className="text-xs text-slate-600">{new Date(sub.startDate).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} -</p>
                          <p className="text-xs font-semibold text-slate-900">{new Date(sub.endDate).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </td>
                        <td className="p-3 text-right">
                          <p className="font-bold text-slate-900">₹{sub.planPrice}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">/mo</p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
