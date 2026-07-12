import { Check, Star, Plus, Edit2, ListTodo, AlertCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Plan } from '../types';
import { getPlans, deletePlan } from '../api';
import { CreatePlanModal } from './CreatePlanModal';
import { EditPlanModal } from './EditPlanModal';

export const PlansList = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const fetchPlans = () => {
    setIsLoading(true);
    getPlans()
      .then((data) => {
        setPlans(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch plans:", err);
        setError("Could not load plans from the server.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) return;
    
    try {
      await deletePlan(id);
      fetchPlans();
    } catch (error) {
      console.error('Failed to delete plan:', error);
      alert('Failed to delete plan. It might be in use.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex items-center justify-between mb-10">
          <div className="flex gap-4 items-center">
            <div className="w-14 h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            <div className="space-y-2">
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-48"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-64"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-rose-200 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-800 rounded-xl">
        <AlertCircle className="w-10 h-10 text-rose-500 mb-4" />
        <h3 className="text-lg font-semibold text-rose-700 dark:text-rose-400">Failed to load</h3>
        <p className="text-rose-600 dark:text-rose-300 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4 max-w-2xl">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl shrink-0">
            <ListTodo className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Pricing Plans</h2>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Manage the subscription plans offered across your SaaS applications.
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-500 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
          <ListTodo className="w-12 h-12 text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No plans configured</h3>
          <p className="text-slate-500 mt-2 max-w-md">Get started by creating your first subscription plan to offer to your tenants.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative flex flex-col p-8 bg-white dark:bg-slate-900 rounded-3xl border shadow-sm transition-all duration-300 hover:shadow-xl ${
                plan.isPopular 
                  ? "border-indigo-500 shadow-indigo-500/10 scale-105 z-10 ring-2 ring-indigo-500/20" 
                  : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-current" /> Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 min-h-[5rem]">{plan.description}</p>
              </div>

              <div className="mb-6 flex items-baseline text-slate-900 dark:text-white">
                <span className="text-5xl font-extrabold tracking-tight">₹{plan.monthlyPrice}</span>
                <span className="text-slate-500 dark:text-slate-400 ml-1 font-medium">/month</span>
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0 mr-3" />
                    <span className="text-slate-700 dark:text-slate-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button 
                  onClick={() => setEditingPlan(plan)}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    plan.isPopular
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                      : "bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(plan.id)}
                  className="w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreatePlanModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchPlans()}
      />

      <EditPlanModal
        isOpen={!!editingPlan}
        onClose={() => setEditingPlan(null)}
        onSuccess={() => fetchPlans()}
        plan={editingPlan}
      />
    </div>
  );
};
