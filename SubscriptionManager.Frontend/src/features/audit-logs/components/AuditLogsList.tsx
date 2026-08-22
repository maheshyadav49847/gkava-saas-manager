import { useQuery } from '@tanstack/react-query';
import { Activity, Search, Database, Clock, User as UserIcon, ChevronDown, ChevronRight, Code, Download, ChevronLeft } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { getAuditLogs } from '../api';

export const AuditLogsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: getAuditLogs,
  });

  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const lower = searchQuery.toLowerCase();
    return logs.filter(l => 
      l.action.toLowerCase().includes(lower) || 
      l.entityName.toLowerCase().includes(lower) ||
      (l.userId && l.userId.toLowerCase().includes(lower))
    );
  }, [logs, searchQuery]);

  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredLogs.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredLogs, currentPage, rowsPerPage]);

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Action', 'EntityName', 'UserId', 'Details'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => 
        [
          `"${format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}"`,
          `"${log.action}"`,
          `"${log.entityName}"`,
          `"${log.userId || 'System'}"`,
          `"${(log.details || '').replace(/"/g, '""')}"`
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_logs_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionColor = (action: string) => {
    if (action.includes('Create') || action.includes('Added')) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (action.includes('Update') || action.includes('Modified')) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (action.includes('Delete') || action.includes('Deleted')) return 'text-rose-700 bg-rose-50 border-rose-200';
    return 'text-slate-700 bg-slate-50 border-slate-200';
  };

  const toggleRow = (id: string) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedRows(newSet);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#0A2540]">System Audit Logs</h1>
          <p className="text-sm text-[#425466] mt-1">
            Track and monitor database changes across the platform.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={filteredLogs.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E3E8EE] rounded-sm text-sm font-medium text-[#425466] hover:bg-[#F6F9FC] transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export to CSV
        </button>
      </div>

      <div className="bg-white rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E3E8EE] overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#E3E8EE] bg-[#F6F9FC] flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search logs by action or entity..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // reset to first page on search
              }}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E3E8EE] rounded-sm text-sm focus:outline-none focus:ring-0 focus:border-[#E3E8EE]"
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-[#425466]">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-[#E3E8EE] rounded-sm px-2 py-1 text-sm focus:outline-none"
            >
              {[10, 25, 50, 100].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F6F9FC] border-b border-[#E3E8EE] text-xs uppercase tracking-wider text-[#425466] font-semibold">
                <th className="p-4 w-10"></th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entity</th>
                <th className="p-4">User ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8EE] bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#425466]">Loading logs...</td>
                </tr>
              ) : paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#425466]">
                    <Activity className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr 
                      onClick={() => toggleRow(log.id)}
                      className={`hover:bg-[#F6F9FC] transition-colors cursor-pointer group ${expandedRows.has(log.id) ? 'bg-[#F6F9FC]' : ''}`}
                    >
                      <td className="p-4 text-slate-400">
                        {expandedRows.has(log.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-[#425466]">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium border ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-[#0A2540]">
                          <Database className="w-4 h-4 text-slate-400" />
                          {log.entityName}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-[#425466]">
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          {log.userId || 'System / Auto'}
                        </div>
                      </td>
                    </tr>
                    
                    {expandedRows.has(log.id) && (
                      <tr className="bg-[#F8FAFC]">
                        <td colSpan={5} className="p-0 border-b border-[#E3E8EE]">
                          <div className="p-6 text-sm text-[#0A2540]">
                            <div className="flex items-center gap-2 mb-3 font-semibold text-[#425466]">
                              <Code className="w-4 h-4" />
                              Change Payload Details
                            </div>
                            <div className="bg-[#0A2540] text-slate-300 p-4 rounded-sm overflow-x-auto shadow-inner text-xs font-mono">
                              <pre>
                                {log.details 
                                  ? JSON.stringify(JSON.parse(log.details), null, 2) 
                                  : 'No payload details recorded.'}
                              </pre>
                            </div>
                          </div>
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
        {!isLoading && filteredLogs.length > 0 && (
          <div className="p-4 border-t border-[#E3E8EE] bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-[#425466]">
              Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredLogs.length)} of {filteredLogs.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 border border-[#E3E8EE] rounded-sm text-sm font-medium text-[#425466] hover:bg-[#F6F9FC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <div className="px-3 py-1.5 text-sm font-medium text-[#0A2540]">
                Page {currentPage} of {totalPages || 1}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex items-center gap-1 px-3 py-1.5 border border-[#E3E8EE] rounded-sm text-sm font-medium text-[#425466] hover:bg-[#F6F9FC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
