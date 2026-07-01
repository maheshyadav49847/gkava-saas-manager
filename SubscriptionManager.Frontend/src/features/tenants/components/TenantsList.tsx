import { Search, Filter, Building, Mail, Phone, CalendarDays, Plus, ChevronLeft, ChevronRight, Users, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Tenant } from '../types';
import { getTenants, deleteTenant } from '../api';
import { CreateTenantModal } from './CreateTenantModal';
import { EditTenantModal } from './EditTenantModal';

export const TenantsList = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  const fetchTenants = () => {
    setIsLoading(true);
    getTenants()
      .then((data) => {
        setTenants(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch tenants:", err);
        setError("Could not load tenants from the server.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) return;
    
    try {
      await deleteTenant(id);
      fetchTenants();
    } catch (error) {
      console.error('Failed to delete tenant:', error);
      alert('Failed to delete tenant. They might have active subscriptions.');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Trialing': return 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'PastDue': return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Cancelled': return 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      default: return 'bg-slate-50 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400 border-slate-200 dark:border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl">
            <Users className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Tenants</h2>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-1">Manage your customers and their active subscriptions.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-500 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Tenant
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-rose-200 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-800 rounded-xl">
          <AlertCircle className="w-10 h-10 text-rose-500 mb-4" />
          <h3 className="text-lg font-semibold text-rose-700 dark:text-rose-400">Failed to load</h3>
          <p className="text-rose-600 dark:text-rose-300 mt-2">{error}</p>
        </div>
      ) : tenants.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
          <Users className="w-12 h-12 text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No tenants found</h3>
          <p className="text-slate-500 mt-2 max-w-md">Get started by adding your first customer to the platform.</p>
        </div>
      ) : (

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tenants by name or email..." 
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-0 focus:border-indigo-500 dark:text-white"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                <th className="p-4">Tenant Info</th>
                <th className="p-4 hidden md:table-cell">Contact</th>
                <th className="p-4">Status & Plan</th>
                <th className="p-4 hidden sm:table-cell">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{tenant.name}</div>
                        <div className="text-xs text-slate-500 md:hidden mt-0.5">{tenant.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                        <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" /> {tenant.email}
                      </div>
                      <div className="flex items-center text-xs text-slate-500">
                        <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" /> {tenant.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col items-start gap-1.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(tenant.status)}`}>
                        {tenant.status}
                      </span>
                      <span className="text-xs font-medium text-slate-500">{tenant.plan}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-slate-400" />
                      {new Date(tenant.joinDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingTenant(tenant)}
                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Tenant"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(tenant.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                        title="Delete Tenant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500">
          <div>Showing 1 to 5 of 24 tenants</div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-3 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors" disabled>
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button className="flex items-center gap-1 px-3 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      )}

      <CreateTenantModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchTenants()}
      />

      <EditTenantModal
        isOpen={!!editingTenant}
        onClose={() => setEditingTenant(null)}
        onSuccess={() => fetchTenants()}
        tenant={editingTenant}
      />
    </div>
  );
};
