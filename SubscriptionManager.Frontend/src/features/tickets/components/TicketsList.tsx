import { useState } from 'react';
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
      await fetch(`http://localhost:5048/api/tickets/${activeTicketId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
    },
    onSuccess: () => {
      setReplyText('');
      queryClient.invalidateQueries({ queryKey: ['tickets', activeTicketId, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    }
  });



  const handleSendReply = () => {
    if (!replyText.trim() || !activeTicketId) return;
    replyMutation.mutate({ messageText: replyText, isInternalNote });
  };

  const activeTicket = tickets?.find((t: any) => t.id === activeTicketId);

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
                placeholder="Search tickets..." 
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 border border-[#E3E8EE] rounded-sm text-xs font-medium text-[#425466] hover:bg-[#F6F9FC] shadow-sm transition-colors bg-white">
                <Filter size={14} />
                Filter
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 border border-[#E3E8EE] rounded-sm text-xs font-medium text-[#425466] hover:bg-[#F6F9FC] shadow-sm transition-colors bg-white">
                <Clock size={14} />
                Sort by Date
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {ticketsLoading ? (
              <div className="p-4 text-center text-sm text-slate-500">Loading tickets...</div>
            ) : tickets?.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500">No tickets found.</div>
            ) : tickets?.map((ticket: any) => (
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
                  <span className="text-xs font-semibold text-slate-500 font-mono">{ticket.id.split('-')[0]}</span>
                  <span className="text-xs text-slate-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="text-sm font-medium text-[#0A2540] mb-1 line-clamp-1">{ticket.subject}</h4>
                <div className="text-xs text-slate-500 mb-3 line-clamp-1 flex items-center gap-1">
                  <User size={12} className="inline" />
                  {ticket.tenantName}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 border rounded-sm text-[10px] font-semibold uppercase tracking-wider ${getPriorityBadgeClass(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                  <span className={`px-2 py-0.5 border rounded-sm text-[10px] font-semibold uppercase tracking-wider ${getStatusBadgeClass(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane - Chat View */}
        <div className="flex-1 flex flex-col bg-white min-w-0">
          {!activeTicket ? (
            <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
              Select a ticket to view details.
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-[#E3E8EE] flex justify-between items-start shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-[#0A2540]">{activeTicket.subject}</h3>
                    <span className={`px-2.5 py-1 border rounded-sm text-xs font-semibold ${getStatusBadgeClass(activeTicket.status)}`}>
                      {activeTicket.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 flex items-center gap-4">
                    <span className="flex items-center gap-1"><User size={14} /> {activeTicket.tenantName}</span>
                    <span className="flex items-center gap-1"><AlertCircle size={14} /> {activeTicket.priority} Priority</span>
                    <span className="font-mono text-xs">ID: {activeTicket.id}</span>
                  </div>
                </div>
                <button className="text-sm text-[#635BFF] font-medium hover:underline">View Customer</button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/30">
                {messagesLoading ? (
                  <div className="text-center text-sm text-slate-500">Loading messages...</div>
                ) : messages?.map((msg: any) => (
                  <div key={msg.id} className={`flex flex-col ${msg.senderId !== 'ADMIN' ? 'items-start' : 'items-end'}`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs font-medium text-slate-700">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-400">{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <div className={`max-w-[80%] rounded-sm p-3 text-sm shadow-sm ${
                      msg.isInternalNote 
                        ? 'bg-yellow-100 border border-yellow-300 text-yellow-900' 
                        : msg.senderId !== 'ADMIN'
                          ? 'bg-white border border-[#E3E8EE] text-[#0A2540]'
                          : 'bg-[#635BFF] text-white'
                    }`}>
                      {msg.isInternalNote && <div className="text-[10px] font-bold uppercase tracking-wider text-yellow-700 mb-1 border-b border-yellow-200 pb-1">Internal Note</div>}
                      {msg.messageText}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-[#E3E8EE] shrink-0 bg-white">
                <div className="flex gap-4 mb-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input 
                      type="radio" 
                      checked={!isInternalNote} 
                      onChange={() => setIsInternalNote(false)}
                      className="text-[#635BFF] focus:ring-[#635BFF]"
                    />
                    <span className={!isInternalNote ? 'font-medium text-[#0A2540]' : 'text-slate-500'}>Public Reply</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input 
                      type="radio" 
                      checked={isInternalNote} 
                      onChange={() => setIsInternalNote(true)}
                      className="text-yellow-600 focus:ring-yellow-600"
                    />
                    <span className={isInternalNote ? 'font-medium text-[#0A2540]' : 'text-slate-500'}>Internal Note</span>
                  </label>
                </div>
                
                <div className={`border rounded-sm shadow-sm overflow-hidden flex flex-col transition-colors ${
                  isInternalNote ? 'border-yellow-300 bg-yellow-50 focus-within:ring-2 focus-within:ring-yellow-500/20 focus-within:border-yellow-500' : 'border-[#E3E8EE] bg-white focus-within:ring-2 focus-within:ring-[#635BFF]/20 focus-within:border-[#635BFF]'
                }`}>
                  <textarea 
                    rows={3} 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={isInternalNote ? "Type an internal note (customer won't see this)..." : "Type your reply to the customer..."}
                    className="w-full p-3 text-sm focus:outline-none resize-none bg-transparent placeholder:text-slate-400 text-[#0A2540]"
                  />
                  <div className="p-2 border-t flex justify-between items-center opacity-70 hover:opacity-100 transition-opacity" style={{ borderColor: isInternalNote ? '#fde047' : '#E3E8EE' }}>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 rounded-sm">
                      <Paperclip size={16} />
                    </button>
                    <button 
                      onClick={handleSendReply}
                      disabled={replyMutation.isPending}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm shadow-sm text-sm font-medium text-white transition-colors disabled:opacity-50 ${
                      isInternalNote ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-[#635BFF] hover:bg-[#5249e5]'
                    }`}>
                      <Send size={14} />
                      {replyMutation.isPending ? 'Sending...' : isInternalNote ? 'Add Note' : 'Send Reply'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <CreateTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};