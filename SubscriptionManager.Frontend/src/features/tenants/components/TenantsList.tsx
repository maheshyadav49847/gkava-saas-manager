import React from 'react';
import { Search, Building, ChevronDown, ChevronRight, Plus, Users, AlertCircle, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tenant } from '../types';
import { getTenants, deleteTenant } from '../api';
import { CreateTenantModal } from './CreateTenantModal';
import { ExpandedTenantRow } from './ExpandedTenantRow';
import { EditTenantModal } from './EditTenantModal';

export const TenantsList = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [expandedTenantId, setExpandedTenantId] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deletingTenant, setDeletingTenant] = useState<Tenant | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: tenants = [], isLoading, isError, error } = useQuery({
    queryKey: ['tenants'],
    queryFn: getTenants,
  });

  const filteredTenants = useMemo(() => {
    if (!searchQuery.trim()) return tenants;
    const lowerQuery = searchQuery.toLowerCase();
    return tenants.filter(t => 
      t.name.toLowerCase().includes(lowerQuery) || 
      t.email.toLowerCase().includes(lowerQuery) ||
      (t.plan && t.plan.toLowerCase().includes(lowerQuery)) ||
      (t.phone && t.phone.toLowerCase().includes(lowerQuery))
    );
  }, [tenants, searchQuery]);

  const totalPages = Math.ceil(filteredTenants.length / rowsPerPage) || 1;

  const paginatedTenants = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredTenants.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredTenants, currentPage, rowsPerPage]);

  const deleteMutation = useMutation({
    mutationFn: deleteTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setIsDeleteModalOpen(false);
      setDeletingTenant(null);
    },
    onError: (err: any) => {
      console.error('Failed to delete tenant:', err);
      const errorMsg = err.response?.data?.detail || err.response?.data || 'Failed to delete tenant. They might have active subscriptions.';
      alert(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    },
  });

  const handleDelete = () => {
    if (!deletingTenant) return;
    deleteMutation.mutate(deletingTenant.id);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Trialing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PastDue': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cancelled': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-[#F6F9FC] text-[#425466] border-[#E3E8EE]';
    }
  };

  const startRecord = filteredTenants.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endRecord = Math.min(currentPage * rowsPerPage, filteredTenants.length);

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 border-b border-[#E3E8EE] pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E3E8EE] text-[#635BFF] shrink-0">
            <Users className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0A2540]">Tenants</h1>
            <p className="text-sm text-[#425466] mt-1">
              Manage your customers and their active subscriptions.
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#635BFF] hover:bg-[#0A2540] text-white border border-transparent rounded-sm shadow-[0_2px_5px_rgba(0,0,0,0.12)] transition-colors text-sm font-medium active:scale-95"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} /> Add Tenant
        </button>
      </div>

      {isError && (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-rose-200 bg-rose-50 rounded-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 mb-4" />
          <h3 className="text-lg font-semibold text-rose-700">Failed to load</h3>
          <p className="text-rose-600 mt-2">
            {error instanceof Error ? error.message : "Could not load tenants from the server."}
          </p>
        </div>
      )}

      <div className="bg-white rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E3E8EE] overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#E3E8EE] bg-[#F6F9FC] flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tenants by name, email, or plan..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E3E8EE] rounded-sm text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F6F9FC] border-b border-[#E3E8EE] text-xs uppercase tracking-wider text-[#425466] font-semibold">
                <th className="w-10 p-4"></th>
                <th className="p-4">Tenant Info</th>
                <th className="p-4 hidden md:table-cell">Product & Plan</th>
                <th className="p-4">Status</th>
                <th className="p-4 hidden md:table-cell">Join Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8EE] bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#425466]">Loading tenants...</td>
                </tr>
              ) : paginatedTenants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center border-dashed border-[#E3E8EE] bg-[#F6F9FC]">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-[#0A2540] font-medium">No tenants found</p>
                    <p className="text-sm text-[#425466] mt-1">Try adjusting your search or add a new tenant.</p>
                  </td>
                </tr>
              ) : (
                                paginatedTenants.map((tenant: any) => (
                  <React.Fragment key={tenant.id}>
                    <tr 
                      className={`hover:bg-[#F6F9FC] transition-colors cursor-pointer ${expandedTenantId === tenant.id ? 'bg-[#F6F9FC]' : ''}`}
                      onClick={() => setExpandedTenantId(expandedTenantId === tenant.id ? null : tenant.id)}
                    >
                      <td className="p-4 text-slate-400">
                        {expandedTenantId === tenant.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-sm bg-white flex items-center justify-center text-[#0A2540] shrink-0 border border-[#E3E8EE] shadow-sm">
                            <Building className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-[#0A2540]">{tenant.name}</div>
                            <div className="text-xs text-[#425466] md:hidden mt-0.5">{tenant.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-[#0A2540]">{tenant.applicationName || 'N/A'}</span>
                          <span className="text-xs font-medium text-[#425466]">{tenant.plan}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-sm text-xs font-semibold border ${getStatusColor(tenant.status)}`}>
                          {tenant.status}
                        </span>
                      </td>
                      <td className="p-4 hidden md:table-cell text-sm text-[#425466]">
                        {new Date(tenant.joinDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => setEditingTenant(tenant)}
                            className="p-1.5 text-slate-400 hover:text-[#635BFF] hover:bg-indigo-50 border border-[#E3E8EE] rounded-sm transition-colors"
                            title="Edit Tenant"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setDeletingTenant(tenant);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-[#E3E8EE] rounded-sm transition-colors"
                            title="Delete Tenant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedTenantId === tenant.id && (
                      <tr>
                        <td colSpan={6} className="p-0">
                          <ExpandedTenantRow tenantId={tenant.id} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-[#E3E8EE] bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[#425466]">Showing {startRecord} to {endRecord} of {filteredTenants.length}</div>
          <div className="flex items-center gap-4">
            {/* Rows per page select here */}
            <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border border-[#E3E8EE] rounded-sm px-2 py-1 focus:outline-none text-sm">
              {[10, 25, 50, 100].map(s => <option key={s} value={s}>{s} per page</option>)}
            </select>
            <div className="flex items-center gap-2">
              {/* Prev and Next buttons */}
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 border border-[#E3E8EE] rounded-sm text-[#425466] hover:bg-[#F6F9FC] disabled:opacity-50">Prev</button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || filteredTenants.length === 0} className="p-1.5 border border-[#E3E8EE] rounded-sm text-[#425466] hover:bg-[#F6F9FC] disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {isDeleteModalOpen && deletingTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-md overflow-hidden border border-[#E3E8EE] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#E3E8EE]">
              <h3 className="text-lg font-bold text-rose-600 flex items-center gap-2">
                <Trash2 className="w-5 h-5" /> Delete Tenant
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-[#425466]">
                Are you sure you want to delete <strong>{deletingTenant.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium flex items-center gap-2 text-[#425466] bg-transparent hover:bg-[#F6F9FC] border-2 border-[#E3E8EE] rounded-sm transition-colors"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 text-sm font-medium flex items-center gap-2 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-sm transition-colors disabled:opacity-50"
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" /> Yes, Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CreateTenantModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['tenants'] })}
      />

      <EditTenantModal
        isOpen={!!editingTenant}
        onClose={() => setEditingTenant(null)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['tenants'] })}
        tenant={editingTenant}
      />
      
    </div>
  );
};
