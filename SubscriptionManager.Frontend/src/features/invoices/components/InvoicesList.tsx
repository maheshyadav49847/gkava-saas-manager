import { useState } from 'react';
import { Receipt, Download, Send, Search, Filter } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appsettings } from '../../../config/appsettings';
import { CreateInvoiceModal } from './CreateInvoiceModal';

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Paid': return 'bg-green-50 text-green-700 border-green-200';
    case 'Open': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Draft': return 'bg-slate-50 text-slate-700 border-slate-200';
    case 'Void': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

export const InvoicesList = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const res = await fetch(`${appsettings.apiUrl}/invoices`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return res.json();
    }
  });

  const sendMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`http://localhost:5048/api/invoices/${id}/send`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] })
  });
  
  const markPaidMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`http://localhost:5048/api/invoices/${id}/mark-paid`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] })
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Invoices</h2>
          <p className="text-sm text-slate-500 mt-1">Manage billing and invoices across all tenants.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#635BFF] hover:bg-[#0A2540] text-white border border-transparent rounded-sm shadow-[0_2px_5px_rgba(0,0,0,0.12)] transition-colors text-sm font-medium active:scale-95"
        >
          <Receipt size={16} />
          Generate Invoice
        </button>
      </div>

      <div className="bg-white rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E3E8EE] overflow-hidden">
        <div className="p-4 border-b border-[#E3E8EE] flex justify-between items-center bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-3 py-2 border border-[#E3E8EE] rounded-sm text-sm text-[#425466] hover:bg-[#F6F9FC] transition-colors bg-white shadow-sm">
            <Filter size={16} />
            Filter
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E3E8EE] text-sm text-[#425466] bg-slate-50/50">
                <th className="p-4 font-medium">Invoice Number</th>
                <th className="p-4 font-medium">Customer/Tenant</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Payment Method</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8EE] text-sm">
              {isLoading ? (
                <tr><td colSpan={7} className="p-4 text-center text-slate-500">Loading invoices...</td></tr>
              ) : invoices?.length === 0 ? (
                <tr><td colSpan={7} className="p-4 text-center text-slate-500">No invoices found.</td></tr>
              ) : invoices?.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 font-medium text-slate-900 font-mono text-xs">{inv.invoiceNumber || inv.id.split('-')[0]}</td>
                  <td className="p-4 text-slate-600">
                    <div className="font-medium text-[#0A2540]">{inv.tenantName}</div>
                    <div className="text-xs text-slate-500">{inv.tenantEmail}</div>
                  </td>
                  <td className="p-4 text-[#0A2540] font-medium">{inv.currency} {inv.amount.toFixed(2)}</td>
                  <td className="p-4 text-slate-500">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                  <td className="p-4 text-slate-600">
                    {inv.paymentMethod ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">{inv.paymentMethod}</span>
                        {inv.paymentDetails && <span className="text-xs text-slate-500">{inv.paymentDetails}</span>}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Not paid</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-sm text-xs font-semibold border ${getStatusBadgeClass(inv.status)}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {inv.status === 'Draft' && (
                         <button onClick={() => sendMutation.mutate(inv.id)} className="p-1.5 text-slate-400 hover:text-[#635BFF] hover:bg-indigo-50 border border-[#E3E8EE] rounded-sm transition-colors" title="Send Invoice">
                          <Send size={16} />
                         </button>
                      )}
                      {inv.status === 'Open' && (
                         <button onClick={() => markPaidMutation.mutate(inv.id)} className="px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 border border-emerald-200 hover:bg-emerald-200 rounded-sm transition-colors" title="Mark Paid">
                          Mark Paid
                         </button>
                      )}
                      <button className="p-1.5 text-slate-400 hover:text-[#0A2540] hover:bg-slate-100 border border-[#E3E8EE] rounded-sm transition-colors" title="Download PDF">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <CreateInvoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
