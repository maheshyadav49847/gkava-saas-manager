import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from "lucide-react";
import { useMutation } from '@tanstack/react-query';
import { TeamMember } from '../../../services/teamMembersService';

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Omit<TeamMember, 'id'> | TeamMember) => Promise<void>;
  member: TeamMember | null;
}

export function TeamMemberModal({ isOpen, onClose, onSave, member }: TeamMemberModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    initials: '',
    displayOrder: 1,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        role: member.role,
        bio: member.bio,
        initials: member.initials,
        displayOrder: member.displayOrder,
      });
    } else {
      setFormData({
        name: '',
        role: '',
        bio: '',
        initials: '',
        displayOrder: 1,
      });
    }
    setError(null);
  }, [member, isOpen]);

  const saveMutation = useMutation({
    mutationFn: async (data: Omit<TeamMember, 'id'> | TeamMember) => {
      await onSave(data);
    },
    onError: () => {
      setError('Failed to save team member');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    saveMutation.mutate(member ? { ...formData, id: member.id } : formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white  rounded shadow-xl w-full max-w-md border border-[#E3E8EE]  flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-[#E3E8EE] ">
          <h2 className="text-xl font-semibold text-[#0A2540] ">
            {member ? 'Edit Team Member' : 'Add Team Member'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-[#425466] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto">
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-sm text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#425466]  mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#425466]  mb-1">
                Role
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
                placeholder="e.g. Lead Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#425466]  mb-1">
                Initials (Avatar)
              </label>
              <input
                type="text"
                required
                maxLength={2}
                value={formData.initials}
                onChange={(e) => setFormData({ ...formData, initials: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
                placeholder="e.g. JD"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#425466]  mb-1">
                Display Order
              </label>
              <input
                type="number"
                required
                min={1}
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#425466]  mb-1">
                Bio
              </label>
              <textarea
                required
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
                placeholder="A short bio about the team member..."
              />
            </div>
          </div>

          <div className="p-6 border-t border-[#E3E8EE]  bg-[#F6F9FC]  flex justify-end gap-3 mt-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={saveMutation.isPending}
              className="px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 text-[#425466] bg-white hover:bg-[#F6F9FC] border border-[#E3E8EE] rounded transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 text-white bg-[#635BFF] hover:bg-[#0A2540] border border-transparent rounded shadow-[0_2px_5px_rgba(0,0,0,0.12)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Member</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
