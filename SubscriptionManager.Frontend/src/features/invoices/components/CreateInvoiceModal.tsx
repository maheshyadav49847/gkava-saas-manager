import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appsettings } from '../../../config/appsettings';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateInvoiceModal = ({ isOpen, onClose }: CreateInvoiceModalProps) => {
  const queryClient = useQueryClient();
  const [tenantId, setTenantId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [currency] = useState('INR');
  
  const [lineItems, setLineItems] = useState([
    { description: '', amount: 0, quantity: 1, taxAmount: 0, discountAmount: 0 }
  ]);

  const { data: tenants } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const res = await fetch(`${appsettings.apiUrl}/tenants`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return res.json();
    }
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch(`${appsettings.apiUrl}/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to create invoice');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      onClose();
    }
  });

  if (!isOpen) return null;

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { description: '', amount: 0, quantity: 1, taxAmount: 0, discountAmount: 0 }]);
  };

  const handleRemoveLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: string, value: string | number) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId || !dueDate) return;
    createMutation.mutate({
      tenantId,
      dueDate: new Date(dueDate).toISOString(),
      currency,
      lineItems
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#E3E8EE] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-[#E3E8EE] sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-slate-900">Create New Invoice</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-sm transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Customer (Tenant)</label>
              <select 
                value={tenantId} 
                onChange={(e) => setTenantId(e.target.value)}
                className="w-full px-3 py-2 border border-[#E3E8EE] rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#635BFF] focus:border-[#635BFF]"
                required
              >
                <option value="">Select a customer...</option>
                {tenants?.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Due Date</label>
              <input 
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-[#E3E8EE] rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#635BFF] focus:border-[#635BFF]"
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E3E8EE]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Line Items</h3>
              <button type="button" onClick={handleAddLineItem} className="flex items-center gap-1 text-sm text-[#635BFF] hover:text-[#5249e5] font-medium">
                <Plus size={16} /> Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {lineItems.map((item, index) => (
                <div key={index} className="flex gap-2 items-start bg-slate-50 p-3 border border-[#E3E8EE] rounded-sm">
                  <div className="flex-1 space-y-2">
                    <input 
                      type="text" 
                      placeholder="Item Description"
                      value={item.description}
                      onChange={(e) => handleChange(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-[#E3E8EE] rounded-sm text-sm"
                      required
                    />
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="Amount"
                        value={item.amount || ''}
                        onChange={(e) => handleChange(index, 'amount', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-[#E3E8EE] rounded-sm text-sm"
                        required
                      />
                      <input 
                        type="number" 
                        placeholder="Qty"
                        value={item.quantity || ''}
                        onChange={(e) => handleChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-24 px-3 py-2 border border-[#E3E8EE] rounded-sm text-sm"
                        required
                      />
                    </div>
                  </div>
                  {lineItems.length > 1 && (
                    <button type="button" onClick={() => handleRemoveLineItem(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-sm">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E3E8EE] sticky bottom-0 bg-white">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-[#E3E8EE] rounded-sm hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 text-sm font-medium text-white bg-[#635BFF] rounded-sm hover:bg-[#5249e5] disabled:opacity-50">
              {createMutation.isPending ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
