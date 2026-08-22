import React, { useState } from 'react';
import { Terminal, Plus, Shield, Activity, Trash2, Webhook } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appsettings } from '../../../config/appsettings';

export const WebhooksTab = () => {
  const queryClient = useQueryClient();
  const [newUrl, setNewUrl] = useState('');
  const [newSecret, setNewSecret] = useState('');

  const { data: webhooks, isLoading } = useQuery({
    queryKey: ['webhooks'],
    queryFn: async () => {
      const res = await fetch(`${appsettings.apiUrl}/webhooks`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return res.json();
    }
  });

  const addMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch(`${appsettings.apiUrl}/webhooks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to add webhook');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      setNewUrl('');
      setNewSecret('');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`http://localhost:5048/api/webhooks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['webhooks'] })
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    // Fetch the first tenant to attach this webhook to (for MVP)
    const tenantsRes = await fetch(`${appsettings.apiUrl}/tenants`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const tenants = await tenantsRes.json();
    if (!tenants || tenants.length === 0) {
      alert("Please create at least one Tenant first.");
      return;
    }

    addMutation.mutate({
      tenantId: tenants[0].id,
      url: newUrl,
      secretKey: newSecret
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#0A2540]">Developer & Webhooks</h2>
        <p className="text-sm text-[#425466] mt-1">
          Configure webhook endpoints to receive events from the platform.
        </p>
      </div>

      <div className="bg-white rounded-sm border border-[#E3E8EE] p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-[#0A2540] flex items-center gap-2 mb-4">
          <Terminal className="w-4 h-4 text-[#635BFF]" /> Add Webhook Endpoint
        </h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#425466] mb-1">Endpoint URL</label>
              <input
                type="url"
                required
                placeholder="https://..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#425466] mb-1">Secret Key (Optional)</label>
              <input
                type="text"
                placeholder="whsec_..."
                value={newSecret}
                onChange={(e) => setNewSecret(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 text-white bg-[#635BFF] hover:bg-[#0A2540] border border-transparent rounded-sm shadow-[0_2px_5px_rgba(0,0,0,0.12)] transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> {addMutation.isPending ? 'Adding...' : 'Add Endpoint'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-sm border border-[#E3E8EE] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E3E8EE] bg-[#F6F9FC]">
          <h3 className="text-sm font-semibold text-[#0A2540] flex items-center gap-2">
            <Webhook className="w-4 h-4 text-[#635BFF]" /> Registered Endpoints
          </h3>
        </div>
        <div className="divide-y divide-[#E3E8EE]">
          {isLoading ? (
            <div className="p-8 text-center text-[#425466] text-sm">Loading webhooks...</div>
          ) : !webhooks || webhooks.length === 0 ? (
            <div className="p-8 text-center text-[#425466] text-sm">No webhooks registered.</div>
          ) : (
            webhooks.map((wh: any) => (
              <div key={wh.id} className="p-4 hover:bg-[#F6F9FC] transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="space-y-1">
                  <div className="font-mono text-sm text-[#0A2540] break-all">{wh.url}</div>
                  <div className="flex items-center gap-3 text-xs text-[#425466]">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-slate-400" /> {wh.secretKey?.substring(0, 10)}...
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-slate-400" /> All Events
                    </span>
                    <span className="flex items-center gap-1">
                      Target Tenant: {wh.tenantName}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2 py-1 rounded-sm text-xs font-medium border ${
                    wh.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {wh.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleDelete(wh.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-colors border border-transparent hover:border-rose-200"
                    title="Delete Webhook"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
