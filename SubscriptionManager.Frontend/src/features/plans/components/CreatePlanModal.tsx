import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2, ListTodo, Plus } from 'lucide-react';
import { createPlan } from '../api';
import { CreatePlanDto } from '../types';
import { getApplications } from '../../applications/api';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreatePlanModal = ({ isOpen, onClose, onSuccess }: CreatePlanModalProps) => {
  const queryClient = useQueryClient();
  const { data: applications = [] } = useQuery({
    queryKey: ['applications'],
    queryFn: getApplications,
    enabled: isOpen
  });

  const [formData, setFormData] = useState<CreatePlanDto>({
    applicationId: '00000000-0000-0000-0000-000000000000', // Default empty GUID
    name: '',
    description: '',
    monthlyPrice: 0,
    yearlyPrice: 0,
    isPopular: false,
    features: ['']
  });

  useEffect(() => {
    if (applications.length > 0 && formData.applicationId === '00000000-0000-0000-0000-000000000000') {
      setFormData(prev => ({ ...prev, applicationId: applications[0].id }));
    }
  }, [applications, formData.applicationId]);

  const createMutation = useMutation({
    mutationFn: (newPlan: CreatePlanDto) => createPlan(newPlan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      onSuccess();
      onClose();
    },
    onError: (error: any) => {
      console.error('Failed to create plan', error);
      const message = error.response?.data?.detail || 'Failed to create plan';
      alert(message);
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      features: formData.features.filter((f: string) => f.trim() !== '')
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_: string, i: number) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white  rounded-sm shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-[#E3E8EE]  animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-[#E3E8EE]  sticky top-0 bg-white/80  backdrop-blur-md z-10">
          <h2 className="text-xl font-bold text-[#0A2540]  flex items-center gap-2">
            <div className="p-2 bg-slate-100  rounded-sm">
              <ListTodo className="w-5 h-5 text-[#0A2540] " />
            </div>
            Add New Plan
          </h2>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-[#425466] rounded-sm hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#425466]  mb-1">Target Application</label>
              <select
                required
                value={formData.applicationId}
                onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
              >
                {applications.length === 0 && <option value="">Loading applications...</option>}
                {applications.map(app => (
                  <option key={app.id} value={app.id}>{app.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#425466]  mb-1">Plan Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
                placeholder="e.g. Starter, Professional, Enterprise"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#425466]  mb-1">Description</label>
              <input
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
                placeholder="Short description of the plan"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#425466]  mb-1">Monthly Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.monthlyPrice}
                  onChange={(e) => setFormData({ ...formData, monthlyPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#425466]  mb-1">Yearly Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.yearlyPrice}
                  onChange={(e) => setFormData({ ...formData, yearlyPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPopular"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="w-4 h-4 text-[#0A2540] rounded-sm border-[#E3E8EE] focus:ring-indigo-500/20"
              />
              <label htmlFor="isPopular" className="text-sm font-medium text-[#425466] ">
                Mark as Most Popular
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-[#425466] ">Features</label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-xs font-medium text-[#0A2540]  hover:text-indigo-700"
                >
                  + Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-[#F6F9FC]  border border-[#E3E8EE]  rounded-sm focus:outline-none focus:ring-0 focus:border-[#E3E8EE] text-[#0A2540]  transition-all"
                      placeholder={`Feature ${index + 1}`}
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-sm transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#E3E8EE] ">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 text-[#425466] bg-white hover:bg-[#F6F9FC] border border-[#E3E8EE] rounded-sm transition-colors shadow-sm"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 text-white bg-[#635BFF] hover:bg-[#0A2540] border border-transparent rounded-sm shadow-[0_2px_5px_rgba(0,0,0,0.12)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Create Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
