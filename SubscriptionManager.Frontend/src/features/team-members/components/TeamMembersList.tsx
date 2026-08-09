import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GripVertical, AlertCircle, RefreshCw } from 'lucide-react';
import { TeamMember, teamMembersService } from '../../../services/teamMembersService';
import { TeamMemberModal } from './TeamMemberModal';

export function TeamMembersList() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const data = await teamMembersService.getAll();
      setTeamMembers(data.sort((a, b) => a.displayOrder - b.displayOrder));
      setError(null);
    } catch (err) {
      setError('Failed to load team members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleAdd = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    try {
      setIsDeleting(id);
      await teamMembersService.delete(id);
      setTeamMembers(teamMembers.filter(m => m.id !== id));
    } catch (err) {
      alert('Failed to delete team member');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSave = async (memberData: Omit<TeamMember, 'id'> | TeamMember) => {
    try {
      if ('id' in memberData && memberData.id) {
        await teamMembersService.update(memberData.id, memberData as TeamMember);
      } else {
        await teamMembersService.create(memberData);
      }
      await fetchTeamMembers();
      setIsModalOpen(false);
    } catch (err) {
      throw new Error('Failed to save team member');
    }
  };

  if (loading && teamMembers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team Members</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage the people displayed on the website's About Us page.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm shadow-indigo-600/20"
        >
          <Plus className="w-5 h-5" />
          Add Member
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {teamMembers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            No team members found. Click "Add Member" to create one.
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {teamMembers.map((member) => (
              <div key={member.id} className="p-4 sm:p-6 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <div className="cursor-grab text-slate-400 hover:text-slate-600 hidden sm:block">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg shrink-0">
                  {member.initials}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">
                      {member.name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                    {member.bio}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    disabled={isDeleting === member.id}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isDeleting === member.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        member={editingMember}
      />
    </div>
  );
}
