import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Application, CreateApplicationDTO, UpdateApplicationDTO } from '../types';
import { getApplications, createApplication, updateApplication, deleteApplication } from '../api';
import { AppWindow, Plus, Copy, Check, Link as LinkIcon, Edit2, Trash2, X, Loader2, LayoutGrid, Search } from 'lucide-react';
import { ApplicationStudio } from './ApplicationStudio';

export const ApplicationList = () => {
  const queryClient = useQueryClient();

  // Search & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [deletingApp, setDeletingApp] = useState<Application | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: getApplications,
    select: (data) => [...data].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      setIsDeleteModalOpen(false);
      setDeletingApp(null);
    },
    onError: (error: any) => {
      console.error("Failed to delete application", error);
      const errorMsg = error.response?.data || "Error deleting application";
      alert(errorMsg);
    }
  });

  const createMutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      console.error("Failed to create application", error);
      const message = error.response?.data?.detail || error.response?.data?.title || error.response?.data || "Error creating application";
      alert(typeof message === 'string' ? message : JSON.stringify(message));
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateApplicationDTO }) => updateApplication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      setIsEditModalOpen(false);
      setEditingApp(null);
    },
    onError: (error: any) => {
      console.error("Failed to update application", error);
      const message = error.response?.data?.detail || error.response?.data?.title || error.response?.data || "Error updating application";
      alert(typeof message === 'string' ? message : JSON.stringify(message));
    }
  });

  const handleDelete = () => {
    if (!deletingApp) return;
    deleteMutation.mutate(deletingApp.id);
  };

  const handleCopyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredApplications = useMemo(() => {
    if (!searchQuery.trim()) return applications;
    const lower = searchQuery.toLowerCase();
    return applications.filter(
      (app) =>
        app.name.toLowerCase().includes(lower) ||
        (app.subtitle && app.subtitle.toLowerCase().includes(lower)) ||
        (app.description && app.description.toLowerCase().includes(lower)) ||
        (app.appKey && app.appKey.toLowerCase().includes(lower)) ||
        (app.websiteUrl && app.websiteUrl.toLowerCase().includes(lower))
    );
  }, [applications, searchQuery]);

  const totalPages = Math.ceil(filteredApplications.length / rowsPerPage) || 1;
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredApplications.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredApplications, currentPage, rowsPerPage]);

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-[#E3E8EE] pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E3E8EE] text-[#635BFF] shrink-0">
            <LayoutGrid className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0A2540]">Applications</h1>
            <p className="text-sm text-[#425466] mt-1">
              Manage your independent SaaS applications and API keys.
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#635BFF] hover:bg-[#0A2540] text-white border border-transparent rounded-sm shadow-[0_2px_5px_rgba(0,0,0,0.12)] transition-colors text-sm font-medium active:scale-95"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} /> Add Application
        </button>
      </div>

      {/* Table Wrapper */}
      <div className="bg-white rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E3E8EE] overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#E3E8EE] bg-[#F6F9FC] flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E3E8EE] rounded-sm text-sm focus:outline-none focus:border-[#635BFF]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F6F9FC] border-b border-[#E3E8EE] text-xs uppercase tracking-wider text-[#425466] font-semibold">
                <th className="p-4">Application</th>
                <th className="p-4">API Key</th>
                <th className="p-4">Website URL</th>
                <th className="p-4">Modules</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8EE] bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#425466]">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#635BFF]" />
                      <span>Loading Applications...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center bg-white">
                    <AppWindow className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-[#0A2540] mb-1">
                      {searchQuery ? 'No matching applications found' : 'No applications yet'}
                    </h3>
                    <p className="text-sm text-[#425466]">
                      {searchQuery
                        ? 'Try adjusting your search query.'
                        : 'Create your first SaaS application to start managing plans.'}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-[#F6F9FC] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-sm bg-[#F6F9FC] border border-[#E3E8EE] flex items-center justify-center text-[#635BFF] shrink-0 overflow-hidden">
                          {app.imageBase64 ? (
                            <img src={app.imageBase64} alt={app.name} className="w-full h-full object-cover" />
                          ) : (
                            <AppWindow className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-[#0A2540] block">{app.name}</span>
                          {app.subtitle && (
                            <p className="text-xs text-[#425466] mt-0.5">{app.subtitle}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 max-w-xs">
                        <code className="px-2.5 py-1 bg-[#F6F9FC] border border-[#E3E8EE] rounded-sm text-xs text-[#425466] font-mono truncate">
                          {app.appKey}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopyKey(app.id, app.appKey)}
                          className="p-1.5 text-slate-400 hover:text-[#0A2540] bg-white border border-[#E3E8EE] rounded-sm transition-colors shrink-0"
                          title="Copy API Key"
                        >
                          {copiedId === app.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#425466]" />}
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      {app.websiteUrl ? (
                        <div className="flex items-center gap-1.5 text-xs text-[#425466] max-w-xs truncate" title={app.websiteUrl}>
                          <LinkIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{app.websiteUrl}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No website set</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium bg-[#F6F9FC] text-[#425466] border border-[#E3E8EE]">
                        {app.modules?.length || 0} {app.modules?.length === 1 ? 'module' : 'modules'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingApp(app);
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-[#635BFF] hover:bg-indigo-50 border border-[#E3E8EE] rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit Application"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingApp(app);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-[#E3E8EE] rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Application"
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
            {filteredApplications.length > 0
              ? `Showing ${(currentPage - 1) * rowsPerPage + 1} to ${Math.min(currentPage * rowsPerPage, filteredApplications.length)} of ${filteredApplications.length}`
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
              className="bg-white border border-[#E3E8EE] rounded-sm px-2 py-1 focus:outline-none text-sm text-[#425466]"
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
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-[#E3E8EE] rounded-sm text-[#425466] hover:bg-[#F6F9FC] disabled:opacity-50"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 border border-[#E3E8EE] rounded-sm text-[#425466] hover:bg-[#F6F9FC] disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Studio (Create/Edit) */}
      {(isModalOpen || isEditModalOpen) && (
        <ApplicationStudio
          application={isEditModalOpen ? editingApp : null}
          onSave={async (data) => {
            if (isEditModalOpen && editingApp) {
              await updateMutation.mutateAsync({ id: editingApp.id, data: data as UpdateApplicationDTO });
            } else {
              await createMutation.mutateAsync(data as CreateApplicationDTO);
            }
          }}
          onCancel={() => {
            setIsModalOpen(false);
            setIsEditModalOpen(false);
            setEditingApp(null);
          }}
        />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && deletingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-md overflow-hidden border border-[#E3E8EE] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#E3E8EE]">
              <h3 className="text-lg font-bold text-rose-600 flex items-center gap-2">
                <Trash2 className="w-5 h-5" /> Delete Application
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-[#425466]">
                Are you sure you want to delete <strong>{deletingApp.name}</strong>? This will permanently remove the application and all associated data, including plans and subscriptions.
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
    </div>
  );
};
