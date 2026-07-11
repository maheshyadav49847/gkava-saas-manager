import { useEffect, useState } from 'react';
import { Application } from '../types';
import { getApplications, createApplication, updateApplication, deleteApplication } from '../api';
import { AppWindow, Plus, Copy, Link as LinkIcon, LayoutGrid, Edit2, Trash2, MoreVertical, X, Loader2 } from 'lucide-react';
import { ApplicationStudio } from './ApplicationStudio';

export const ApplicationList = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [deletingApp, setDeletingApp] = useState<Application | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const fetchApps = () => {
    setIsLoading(true);
    getApplications()
      .then((data) => {
        setApplications(data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch applications", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleDelete = async () => {
    if (!deletingApp) return;
    
    setIsDeleting(true);
    try {
      await deleteApplication(deletingApp.id);
      setIsDeleteModalOpen(false);
      setDeletingApp(null);
      fetchApps();
    } catch (error) {
      console.error("Failed to delete application", error);
      alert("Error deleting application");
    } finally {
      setIsDeleting(false);
    }
  };

  // Close dropdown if clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (isLoading && applications.length === 0) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Applications...</div>;
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl">
            <LayoutGrid className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Your SaaS Apps</h2>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-1">Manage all your independent applications and their API keys.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-500 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {applications.length === 0 && !isLoading ? (
          <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
            <AppWindow className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No applications yet</h3>
            <p className="text-slate-500 dark:text-slate-400">Create your first SaaS application to start managing plans.</p>
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors group">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800/50 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <AppWindow className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{app.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" /> {app.webhookUrl || "No webhook set"}
                    </p>
                  </div>
                </div>
                
                {/* Actions Dropdown */}
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownId(openDropdownId === app.id ? null : app.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {openDropdownId === app.id && (
                    <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden z-10">
                      <button 
                        onClick={() => {
                          setEditingApp(app);
                          setIsEditModalOpen(true);
                          setOpenDropdownId(null);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 w-full text-left transition-colors"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button 
                        onClick={() => {
                          setDeletingApp(app);
                          setIsDeleteModalOpen(true);
                          setOpenDropdownId(null);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 w-full text-left transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950/50">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">API Key</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs text-slate-600 dark:text-slate-300 font-mono truncate">
                    {app.appKey}
                  </code>
                  <button className="p-1.5 text-slate-400 hover:text-indigo-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded transition-colors" title="Copy API Key">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Application Studio (Create/Edit) */}
      {(isModalOpen || isEditModalOpen) && (
        <ApplicationStudio
          application={isEditModalOpen ? editingApp : null}
          onSave={async (data) => {
            if (isEditModalOpen && editingApp) {
              try {
                await updateApplication(editingApp.id, data as any);
                setIsEditModalOpen(false);
                setEditingApp(null);
                fetchApps();
              } catch (error) {
                console.error("Failed to update application", error);
                alert("Error updating application");
              }
            } else {
              try {
                await createApplication(data as any);
                setIsModalOpen(false);
                fetchApps();
              } catch (error) {
                console.error("Failed to create application", error);
                alert("Error creating application");
              }
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-rose-600 dark:text-rose-500 flex items-center gap-2">
                <Trash2 className="w-5 h-5" /> Delete Application
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Are you sure you want to delete <strong>{deletingApp.name}</strong>? This will permanently remove the application and all associated data, including plans and subscriptions.
              </p>
              <div className="flex items-center justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium flex items-center gap-2 text-rose-600 dark:text-rose-400 bg-transparent hover:bg-rose-50 dark:hover:bg-rose-500/10 border-2 border-rose-600 dark:border-rose-500 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
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
