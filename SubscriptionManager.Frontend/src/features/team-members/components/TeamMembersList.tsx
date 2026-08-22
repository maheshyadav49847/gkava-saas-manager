import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, RefreshCw, User, Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TeamMember, teamMembersService } from '../../../services/teamMembersService';
import { TeamMemberModal } from './TeamMemberModal';

export function TeamMembersList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: teamMembers = [], isLoading, isError, error } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      const data = await teamMembersService.getAll();
      return [...data].sort((a, b) => a.displayOrder - b.displayOrder);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => teamMembersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
    onError: (err) => {
      console.error('Failed to delete team member:', err);
      alert('Failed to delete team member');
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (memberData: Omit<TeamMember, 'id'> | TeamMember) => {
      if ('id' in memberData && memberData.id) {
        return await teamMembersService.update(memberData.id, memberData as TeamMember);
      } else {
        return await teamMembersService.create(memberData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      setIsModalOpen(false);
    },
  });

  const handleAdd = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    deleteMutation.mutate(id);
  };

  const handleSave = async (memberData: Omit<TeamMember, 'id'> | TeamMember) => {
    await saveMutation.mutateAsync(memberData);
  };

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return teamMembers;
    const lower = searchQuery.toLowerCase();
    return teamMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(lower) ||
        m.role.toLowerCase().includes(lower) ||
        (m.bio && m.bio.toLowerCase().includes(lower))
    );
  }, [teamMembers, searchQuery]);

  const totalPages = Math.ceil(filteredMembers.length / rowsPerPage) || 1;
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredMembers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredMembers, currentPage, rowsPerPage]);

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-[#E3E8EE] pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E3E8EE] text-[#635BFF] shrink-0">
            <Users className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0A2540]">Team Members</h1>
            <p className="text-sm text-[#425466] mt-1">
              Manage the people displayed on the website About Us page.
            </p>
          </div>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#635BFF] hover:bg-[#0A2540] text-white border border-transparent rounded shadow-[0_2px_5px_rgba(0,0,0,0.12)] transition-colors text-sm font-medium active:scale-95"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} /> Add Member
        </button>
      </div>

      {isError && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded flex items-center gap-3 text-[13px] font-medium">
          <AlertCircle className="w-4 h-4" />
          {error instanceof Error ? error.message : 'Failed to load team members'}
        </div>
      )}

      <div className="bg-white rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E3E8EE] overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#E3E8EE] bg-[#F6F9FC] flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, role, bio..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E3E8EE] rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F6F9FC] border-b border-[#E3E8EE] text-xs uppercase tracking-wider text-[#425466] font-semibold">
                <th className="p-4">Member</th>
                <th className="p-4">Role</th>
                <th className="p-4">Bio</th>
                <th className="p-4 text-center">Display Order</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8EE] bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#425466]">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-[#635BFF]" />
                      <span>Loading team members...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center border-dashed border-[#E3E8EE] bg-[#F6F9FC]">
                    <User className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-[#0A2540] font-medium">No team members found</p>
                    <p className="text-sm text-[#425466] mt-1 mb-4">
                      {searchQuery ? 'Try adjusting your search query.' : 'Get started by creating a new team member to display on your website.'}
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={handleAdd}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#EAEAEA] text-[#425466] rounded-sm hover:bg-[#F6F9FC] transition-colors text-sm font-medium shadow-sm"
                      >
                        <Plus className="w-4 h-4 text-slate-400" />
                        Add Member
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-[#F6F9FC] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-[#425466] flex items-center justify-center font-bold text-xs shrink-0 border border-[#E3E8EE]/60 shadow-sm">
                          {member.initials}
                        </div>
                        <div className="font-semibold text-sm text-[#0A2540]">
                          {member.name}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-[#F6F9FC] text-[#0A2540] border border-[#E3E8EE]">
                        {member.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-[#425466]">
                      <p className="line-clamp-2 max-w-md">{member.bio}</p>
                    </td>
                    <td className="p-4 text-center text-sm font-medium text-[#425466]">
                      {member.displayOrder}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-1.5 text-slate-400 hover:text-[#635BFF] hover:bg-indigo-50 border border-[#E3E8EE] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          disabled={deleteMutation.isPending && deleteMutation.variables === member.id}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-[#E3E8EE] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete"
                        >
                          {deleteMutation.isPending && deleteMutation.variables === member.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
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
            {filteredMembers.length > 0
              ? `Showing ${((currentPage - 1) * rowsPerPage) + 1} to ${Math.min(currentPage * rowsPerPage, filteredMembers.length)} of ${filteredMembers.length}`
              : 'Showing 0 to 0 of 0'}
          </div>
          <div className="flex items-center gap-4">
            {/* Rows per page select here */}
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-[#E3E8EE] rounded px-2 py-1 focus:outline-none text-sm text-[#425466]"
            >
              {[10, 25, 50, 100].map((s) => (
                <option key={s} value={s}>
                  {s} per page
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              {/* Prev and Next buttons */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-[#E3E8EE] rounded text-[#425466] hover:bg-[#F6F9FC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 border border-[#E3E8EE] rounded text-[#425466] hover:bg-[#F6F9FC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
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
