import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tag, Plus, Edit2, Trash2, AlertCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { CouponDto } from '../types';
import { couponsApi } from '../api';
import { CreateCouponModalView } from './CreateCouponModalView';
import { EditCouponModalView } from './EditCouponModalView';

export const CouponsList = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponDto | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Expired' | 'Deleted'>('Active');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: coupons = [], isLoading, isError, error } = useQuery({
    queryKey: ['coupons'],
    queryFn: couponsApi.getCoupons
  });

  const deleteMutation = useMutation({
    mutationFn: couponsApi.deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
    onError: (err) => {
      console.error('Failed to delete coupon:', err);
      alert('Failed to delete coupon.');
    }
  });

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    deleteMutation.mutate(id);
  };

  const filteredCoupons = useMemo(() => {
    return coupons.filter(coupon => {
      // Status Logic
      const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
      const isMaxedOut = coupon.maxUses && coupon.currentUses >= coupon.maxUses;
      const isUsable = coupon.isActive && !isExpired && !isMaxedOut;

      let statusMatch = true;
      if (statusFilter === 'Active') statusMatch = isUsable;
      else if (statusFilter === 'Expired') statusMatch = !!(isExpired && coupon.isActive);
      else if (statusFilter === 'Deleted') statusMatch = !coupon.isActive;

      // Search Logic
      const searchMatch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase());

      return statusMatch && searchMatch;
    });
  }, [coupons, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredCoupons.length / rowsPerPage);
  const paginatedCoupons = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredCoupons.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredCoupons, currentPage, rowsPerPage]);

  const getStatusBadge = (coupon: CouponDto) => {
    if (!coupon.isActive) return <span className="px-2.5 py-1 text-xs font-semibold rounded-sm bg-slate-100 text-slate-600">Deleted</span>;
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) return <span className="px-2.5 py-1 text-xs font-semibold rounded-sm bg-rose-100 text-rose-700">Expired</span>;
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) return <span className="px-2.5 py-1 text-xs font-semibold rounded-sm bg-orange-100 text-orange-700">Maxed Out</span>;
    return <span className="px-2.5 py-1 text-xs font-semibold rounded-sm bg-emerald-100 text-emerald-700">Active</span>;
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-rose-200 bg-rose-50 rounded-sm">
        <AlertCircle className="w-10 h-10 text-rose-500 mb-4" />
        <h3 className="text-lg font-semibold text-rose-700">Failed to load</h3>
        <p className="text-rose-600 mt-2">
          {error instanceof Error ? error.message : "Could not load coupons."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-[#E3E8EE] pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E3E8EE] text-[#635BFF] shrink-0">
            <Tag className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0A2540]">Coupons & Discounts</h1>
            <p className="text-sm text-[#425466] mt-1">
              Manage promotional codes and discounts for your subscriptions.
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#635BFF] hover:bg-[#0A2540] text-white border border-transparent rounded-sm shadow-sm transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} /> Add Coupon
        </button>
      </div>

      <div className="bg-white rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E3E8EE] overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#E3E8EE] bg-[#F6F9FC] flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-2">
            {(['Active', 'All', 'Expired', 'Deleted'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => { setStatusFilter(tab); setCurrentPage(1); }}
                className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${
                  statusFilter === tab 
                    ? 'bg-white text-[#635BFF] border border-[#E3E8EE] shadow-sm' 
                    : 'text-[#425466] hover:bg-slate-100 border border-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by code..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E3E8EE] rounded-sm text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F6F9FC] border-b border-[#E3E8EE] text-xs uppercase tracking-wider text-[#425466] font-semibold">
                <th className="p-4">Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Usage</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8EE] bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#425466]">Loading coupons...</td>
                </tr>
              ) : paginatedCoupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center border-dashed border-[#E3E8EE] bg-[#F6F9FC]">
                    <Tag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-[#0A2540] font-medium">No coupons found</p>
                    <p className="text-sm text-[#425466] mt-1">Try adjusting your filters or create a new one.</p>
                  </td>
                </tr>
              ) : (
                paginatedCoupons.map((coupon) => (
                  <tr key={coupon.id} className={`hover:bg-[#F6F9FC] transition-colors ${!coupon.isActive ? 'opacity-60' : ''}`}>
                    <td className="p-4">
                      <span className="font-mono font-bold text-[#0A2540] bg-slate-100 px-2.5 py-1 rounded-sm">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-[#0A2540]">
                        {coupon.discountType === 'FixedAmount' ? '₹' : ''}
                        {coupon.discountValue}
                        {coupon.discountType === 'Percentage' ? '%' : ''} OFF
                      </span>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(coupon)}
                    </td>
                    <td className="p-4 text-sm text-[#425466]">
                      {coupon.currentUses} / {coupon.maxUses || 'âˆž'}
                    </td>
                    <td className="p-4 text-sm text-[#425466]">
                      {coupon.expiryDate ? format(new Date(coupon.expiryDate), 'MMM d, yyyy') : 'No expiry'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setEditingCoupon(coupon)}
                          disabled={!coupon.isActive}
                          className="p-1.5 text-slate-400 hover:text-[#635BFF] hover:bg-indigo-50 border border-[#E3E8EE] rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(coupon.id)}
                          disabled={!coupon.isActive}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-[#E3E8EE] rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete"
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
        {!isLoading && filteredCoupons.length > 0 && (
          <div className="p-4 border-t border-[#E3E8EE] bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-[#425466]">
              Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredCoupons.length)} of {filteredCoupons.length} coupons
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-[#425466]">
                <select
                  value={rowsPerPage}
                  onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-white border border-[#E3E8EE] rounded-sm px-2 py-1 focus:outline-none"
                >
                  {[10, 25, 50, 100].map(size => <option key={size} value={size}>{size} per page</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-[#E3E8EE] rounded-sm text-[#425466] hover:bg-[#F6F9FC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-sm font-medium text-[#0A2540] px-2">
                  Page {currentPage} of {totalPages || 1}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 border border-[#E3E8EE] rounded-sm text-[#425466] hover:bg-[#F6F9FC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <CreateCouponModalView
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['coupons'] })}
      />

      <EditCouponModalView
        isOpen={!!editingCoupon}
        onClose={() => setEditingCoupon(null)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['coupons'] })}
        coupon={editingCoupon}
      />
    </div>
  );
};
