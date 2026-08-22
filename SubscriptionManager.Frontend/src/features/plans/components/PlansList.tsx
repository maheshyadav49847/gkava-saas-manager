import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, ListTodo, AlertCircle, Search, Star } from 'lucide-react';
import { Plan } from '../types';
import { getPlans, deletePlan } from '../api';
import { CreatePlanModal } from './CreatePlanModal';
import { EditPlanModal } from './EditPlanModal';

export const PlansList = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: plans = [], isLoading, isError, error } = useQuery({
    queryKey: ['plans'],
    queryFn: getPlans
  });

  const deleteMutation = useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
    onError: (err) => {
      console.error('Failed to delete plan:', err);
      alert('Failed to delete plan. It might be in use.');
    }
  });

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) return;
    deleteMutation.mutate(id);
  };

  const filteredPlans = useMemo(() => {
    if (!searchQuery.trim()) return plans;
    const query = searchQuery.toLowerCase().trim();
    return plans.filter((plan) => {
      const nameMatch = plan.name?.toLowerCase().includes(query);
      const descMatch = plan.description?.toLowerCase().includes(query);
      const featureMatch = plan.features?.some((f) => f.toLowerCase().includes(query));
      return nameMatch || descMatch || featureMatch;
    });
  }, [plans, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPlans.length / rowsPerPage));

  const paginatedPlans = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredPlans.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredPlans, currentPage, rowsPerPage]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-rose-200 bg-rose-50 rounded-sm">
        <AlertCircle className="w-10 h-10 text-rose-500 mb-4" />
        <h3 className="text-lg font-semibold text-rose-700">Failed to load</h3>
        <p className="text-rose-600 mt-2">
          {error instanceof Error ? error.message : "Could not load plans from the server."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 border-b border-[#E3E8EE] pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E3E8EE] text-[#635BFF] shrink-0">
            <ListTodo className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0A2540]">Pricing Plans</h1>
            <p className="text-sm text-[#425466] mt-1">
              Manage the subscription plans offered across your SaaS applications.
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#635BFF] hover:bg-[#0A2540] text-white border border-transparent rounded-sm shadow-[0_2px_5px_rgba(0,0,0,0.12)] transition-colors text-sm font-medium active:scale-95"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} /> Add Plan
        </button>
      </div>

      <div className="bg-white rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E3E8EE] overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#E3E8EE] bg-[#F6F9FC] flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search plans by name, description, or features..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E3E8EE] rounded-sm text-sm focus:outline-none"
            />
          </div>
          <div className="text-xs font-medium text-[#425466]">
            Total Plans: {filteredPlans.length}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F6F9FC] border-b border-[#E3E8EE] text-xs uppercase tracking-wider text-[#425466] font-semibold">
                <th className="p-4">Plan Name</th>
                <th className="p-4">Monthly Price</th>
                <th className="p-4">Yearly Price</th>
                <th className="p-4">Features</th>
                <th className="p-4">Badge</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8EE] bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#425466]">Loading plans...</td>
                </tr>
              ) : paginatedPlans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center border-dashed border-[#E3E8EE] bg-[#F6F9FC]">
                    <ListTodo className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-[#0A2540] font-medium">No plans found</p>
                    <p className="text-sm text-[#425466] mt-1">
                      {searchQuery ? 'Try adjusting your search query.' : 'Get started by creating your first subscription plan.'}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-[#F6F9FC] transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#0A2540]">{plan.name}</span>
                        {plan.description && (
                          <span className="text-xs text-[#425466] mt-0.5 line-clamp-1 max-w-sm">
                            {plan.description}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-[#0A2540]">
                      ₹{plan.monthlyPrice} <span className="text-xs text-[#425466] font-normal">/mo</span>
                    </td>
                    <td className="p-4 font-medium text-[#0A2540]">
                      ₹{plan.yearlyPrice} <span className="text-xs text-[#425466] font-normal">/yr</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {plan.features && plan.features.length > 0 ? (
                          plan.features.slice(0, 2).map((feat, idx) => (
                            <span 
                              key={idx} 
                              className="inline-flex items-center text-xs px-2 py-0.5 rounded-sm bg-slate-100 text-[#425466] border border-slate-200 max-w-[120px] truncate"
                              title={feat}
                            >
                              {feat}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">None</span>
                        )}
                        {plan.features && plan.features.length > 2 && (
                          <span className="inline-flex items-center text-xs px-1.5 py-0.5 rounded-sm bg-indigo-50 text-[#635BFF] font-medium border border-indigo-100">
                            +{plan.features.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {plan.isPopular ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-sm bg-indigo-50 text-[#635BFF] border border-indigo-200">
                          <Star className="w-3 h-3 fill-current" /> Most Popular
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-medium rounded-sm bg-slate-100 text-slate-600 border border-slate-200">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setEditingPlan(plan)}
                          className="p-1.5 text-slate-400 hover:text-[#635BFF] hover:bg-indigo-50 border border-[#E3E8EE] rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit Plan"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(plan.id)}
                          disabled={deleteMutation.isPending && deleteMutation.variables === plan.id}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-[#E3E8EE] rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-[#E3E8EE] bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[#425466]">
            Showing {filteredPlans.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredPlans.length)} of {filteredPlans.length}
          </div>
          <div className="flex items-center gap-4">
            {/* Rows per page select here */}
            <select 
              value={rowsPerPage} 
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} 
              className="bg-white border border-[#E3E8EE] rounded-sm px-2 py-1 focus:outline-none"
            >
              {[10, 25, 50, 100].map(s => <option key={s} value={s}>{s} per page</option>)}
            </select>
            <div className="flex items-center gap-2">
              {/* Prev and Next buttons */}
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1} 
                className="p-1.5 border border-[#E3E8EE] rounded-sm text-[#425466] hover:bg-[#F6F9FC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages || filteredPlans.length === 0} 
                className="p-1.5 border border-[#E3E8EE] rounded-sm text-[#425466] hover:bg-[#F6F9FC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <CreatePlanModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['plans'] })}
      />

      <EditPlanModal
        isOpen={!!editingPlan}
        onClose={() => setEditingPlan(null)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['plans'] })}
        plan={editingPlan}
      />
    </div>
  );
};
