import { useState, useMemo, useEffect } from 'react';
import { LifeBuoy, Search, Filter, Clock, User, AlertCircle, Paperclip, Send } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appsettings } from '../../../config/appsettings';
import { CreateTicketModal } from './CreateTicketModal';

const getPriorityBadgeClass = (priority: string) => {
  switch (priority) {
    case 'Urgent': return 'bg-red-50 text-red-700 border-red-200';
    case 'High': return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Medium': return 'bg-blue-50 text-blue-700 border-blue-200';
    default: return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Open': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'PendingCustomer': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    case 'Escalated': return 'bg-red-50 text-red-700 border-red-200';
    case 'Resolved': return 'bg-green-50 text-green-700 border-green-200';
    case 'Closed': return 'bg-slate-50 text-slate-700 border-slate-200';
    default: return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

export const TicketsList = () => {
  const queryClient = useQueryClient();
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [replyText, setReplyText] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');

  // Fetch Tickets
  const { data: tickets, isLoading: ticketsLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const res = await fetch(`${appsettings.apiUrl}/tickets`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return res.json();
    }
  });

  // Fetch Messages for active ticket
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['tickets', activeTicketId, 'messages'],
    queryFn: async () => {
      if (!activeTicketId) return [];
      const res = await fetch(`http://localhost:5048/api/tickets/${activeTicketId}/messages`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return res.json();
    },
    enabled: !!activeTicketId
  });

  // Mutations
  const replyMutation = useMutation({
    mutationFn: async (payload: { messageText: string, isInternalNote: boolean }) => {
      await fetch(`http://localhost:5048/api/tickets/${activeTicketId}/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ 
          messageText: payload.messageText, 
          isInternalNote: payload.isInternalNote,
          senderType: "Agent"
        })
      });
    },
    onSuccess: () => {
      setReplyText('');
      queryClient.invalidateQueries({ queryKey: ['tickets', activeTicketId, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    }
  });

  const filteredTickets = useMemo(() => {
    if (!tickets) return [];
    let result = tickets.filter((t: any) => {
      const matchesSearch = t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.tenantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.id?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'Newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [tickets, searchQuery, statusFilter, sortOrder]);

  const handleSendReply = () => {
    if (!replyText.trim() || !activeTicketId) return;
    replyMutation.mutate({ messageText: replyText, isInternalNote });
  };

  const activeTicket = tickets?.find((t: any) => t.id === activeTicketId);

  // Auto-select first ticket if none selected
  useEffect(() => {
    if (filteredTickets.length > 0 && !activeTicketId) {
      setActiveTicketId(filteredTickets[0].id);
    }
  }, [filteredTickets, activeTicketId]);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Support Tickets</h2>
          <p className="text-sm text-slate-500 mt-1">Manage customer inquiries and internal support requests.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#635BFF] hover:bg-[#0A2540] text-white border border-transparent rounded-sm shadow-[0_2px_5px_rgba(0,0,0,0.12)] transition-colors text-sm font-medium active:scale-95"
        >
          <LifeBuoy size={16} />
          Create Ticket
        </button>
      </div>

      <div className="flex-1 bg-white rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E3E8EE] overflow-hidden flex min-h-0">
        {/* Left Pane - Ticket List */}
        <div className="w-1/3 border-r border-[#E3E8EE] flex flex-col bg-slate-50/30">
          <div className="p-4 border-b border-[#E3E8EE] flex flex-col gap-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tickets..." 
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                 <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} pointerEvents="none" />
                 <select 
                   value={statusFilter}
                   onChange={(e) => setStatusFilter(e.target.value)}
                   className="w-full pl-8 pr-6 py-1.5 border border-[#E3E8EE] rounded-sm text-xs font-medium text-[#425466] hover:bg-[#F6F9FC] shadow-sm transition-colors bg-white focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] appearance-none cursor-pointer"
                 >
                   <option value="All">All Status</option>
                   <option value="Open">Open</option>
                   <option value="PendingCustomer">Pending</option>
                   <option value="Escalated">Escalated</option>
                   <option value="Resolved">Resolved</option>
                   <option value="Closed">Closed</option>
                 </select>
                 <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                   <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M1 1L5 5L9 1" stroke="#425466" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                 </div>
              </div>
              <div className="relative flex-1">
                 <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} pointerEvents="none" />
                 <select 
                   value={sortOrder}
                   onChange={(e) => setSortOrder(e.target.value)}
                   className="w-full pl-8 pr-6 py-1.5 border border-[#E3E8EE] rounded-sm text-xs font-medium text-[#425466] hover:bg-[#F6F9FC] shadow-sm transition-colors bg-white focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] appearance-none cursor-pointer"
                 >
                   <option value="Newest">Newest First</option>
                   <option value="Oldest">Oldest First</option>
                 </select>
                 <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                   <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M1 1L5 5L9 1" stroke="#425466" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {ticketsLoading ? (
              <div className="p-4 text-center text-sm text-slate-500">Loading tickets...</div>
            ) : filteredTickets?.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500">No tickets found.</div>
            ) : filteredTickets?.map((ticket: any) => (
              <div 
                key={ticket.id}
                onClick={() => setActiveTicketId(ticket.id)}
                className={`p-4 border-b border-[#E3E8EE] cursor-pointer transition-colors ${
                  activeTicketId === ticket.id 
                    ? 'bg-indigo-50/50 border-l-2 border-l-[#635BFF]' 
                    : 'hover:bg-slate-50 border-l-2 border-l-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-semibold text-slate-900 truncate pr-2">{ticket.subject}</span>
                  <span className="text-xs text-slate-500 whitespace-nowrap">{new Date(ticket.createdAt).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="text-xs text-slate-600 truncate mb-2">{ticket.tenantName}</div>
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-semibold border ${getStatusBadgeClass(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-semibold border ${getPriorityBadgeClass(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane - Ticket Details & Chat */}
        {activeTicket ? (
          <div className="w-2/3 flex flex-col bg-white">
            <div className="p-6 border-b border-[#E3E8EE] shrink-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-slate-900">{activeTicket.subject}</h3>
                <span className={`px-2.5 py-1 rounded-sm text-xs font-semibold border ${getStatusBadgeClass(activeTicket.status)}`}>
                  {activeTicket.status}
                </span>
              </div>
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <User size={14} className="text-slate-400" />
                  <span className="font-medium">{activeTicket.tenantName}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <AlertCircle size={14} className="text-slate-400" />
                  Priority: <span className="font-medium">{activeTicket.priority}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock size={14} className="text-slate-400" />
                  Created: <span className="font-medium">{new Date(activeTicket.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              <div className="space-y-6">
                {messagesLoading ? (
                  <div className="text-center text-sm text-slate-500">Loading messages...</div>
                ) : messages?.map((msg: any) => (
                  <div key={msg.id} className={`flex gap-4 ${msg.senderType === 'Agent' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                      <User size={14} className="text-slate-500" />
                    </div>
                    <div className={`max-w-[75%] rounded-md p-4 shadow-sm border ${
                      msg.isInternalNote 
                        ? 'bg-amber-50 border-amber-200' 
                        : msg.senderType === 'Agent' 
                          ? 'bg-[#F6F9FC] border-[#E3E8EE]' 
                          : 'bg-white border-[#E3E8EE]'
                    }`}>
                      <div className="flex justify-between items-end mb-2 gap-4">
                        <span className="font-semibold text-sm text-slate-900">
                          {msg.senderType === 'Agent' ? 'Support Agent' : activeTicket.tenantName}
                          {msg.isInternalNote && <span className="ml-2 text-xs text-amber-700 font-medium">(Internal Note)</span>}
                        </span>
                        <span className="text-xs text-slate-400">{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{msg.messageText}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-[#E3E8EE] bg-white shrink-0">
              <div className="border border-[#E3E8EE] rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#635BFF]/20 focus-within:border-[#635BFF] transition-all">
                <textarea 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full p-3 text-sm resize-none focus:outline-none min-h-[100px] text-slate-700"
                />
                <div className="bg-slate-50 border-t border-[#E3E8EE] p-2 flex justify-between items-center">
                  <div className="flex items-center gap-4 px-2">
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isInternalNote}
                        onChange={(e) => setIsInternalNote(e.target.checked)}
                        className="rounded border-slate-300 text-[#635BFF] focus:ring-[#635BFF]"
                      />
                      Internal Note
                    </label>
                    <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Attach file">
                      <Paperclip size={16} />
                    </button>
                  </div>
                  <button 
                    onClick={handleSendReply}
                    disabled={replyMutation.isPending || !replyText.trim()}
                    className="flex items-center gap-2 px-4 py-1.5 bg-[#0A2540] hover:bg-slate-800 text-white rounded-sm text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <Send size={14} />
                    {replyMutation.isPending ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-2/3 flex flex-col items-center justify-center bg-slate-50/50 text-slate-400">
            <LifeBuoy size={48} className="mb-4 opacity-20" />
            <p className="text-sm">Select a ticket to view details</p>
          </div>
        )}
      </div>

      <CreateTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};