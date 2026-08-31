import { useQuery } from '@tanstack/react-query';
import { Mail, Loader2, Calendar } from 'lucide-react';
import { getContactMessages } from '../api';

export function ContactMessagesList() {
  const { data: messages, isLoading, isError } = useQuery({
    queryKey: ['contactMessages'],
    queryFn: getContactMessages,
  });

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>;
  if (isError) return <div className="text-red-500">Error loading contact messages.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Contact Messages</h1>
        <p className="mt-1 text-sm text-gray-500">View inquiries submitted through the public website contact form.</p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
        <ul role="list" className="divide-y divide-gray-100">
          {messages?.length === 0 && (
            <li className="p-6 text-center text-gray-500">No contact messages yet.</li>
          )}
          {messages?.map((msg) => (
            <li key={msg.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{msg.subject}</h3>
                    <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                      <span className="font-medium text-gray-900">{msg.name}</span>
                      <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current"><circle cx="1" cy="1" r="1" /></svg>
                      <a href={`mailto:${msg.email}`} className="hover:underline">{msg.email}</a>
                      {msg.phone && (
                        <>
                          <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current"><circle cx="1" cy="1" r="1" /></svg>
                          <a href={`tel:${msg.phoneCountryCode || '+91'}${msg.phone}`} className="hover:underline">{msg.phoneCountryCode || '+91'} {msg.phone}</a>
                        </>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-md border border-gray-100">{msg.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-x-4 sm:flex-col sm:items-end sm:gap-y-2">
                  <div className="flex items-center gap-x-1.5 text-xs text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={msg.createdAt}>{new Date(msg.createdAt).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</time>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
