import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, AppWindow, Building, ListTodo, Users, Tag, Settings, Activity } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const commands = [
  { id: 'dashboard', name: 'Go to Dashboard', icon: Command, path: '/dashboard' },
  { id: 'applications', name: 'Manage Applications', icon: AppWindow, path: '/applications' },
  { id: 'tenants', name: 'View Tenants', icon: Building, path: '/tenants' },
  { id: 'plans', name: 'Manage Pricing Plans', icon: ListTodo, path: '/plans' },
  { id: 'coupons', name: 'Manage Coupons', icon: Tag, path: '/coupons' },
  { id: 'team', name: 'Team Members', icon: Users, path: '/team-members' },
  { id: 'settings', name: 'Account Settings', icon: Settings, path: '/settings' },
  { id: 'audit-logs', name: 'Audit Logs', icon: Activity, path: '/audit-logs' },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filteredCommands = commands.filter(cmd => 
    cmd.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredCommands.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          navigate(filteredCommands[selectedIndex].path);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-sm shadow-2xl overflow-hidden border border-[#E3E8EE] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 py-3 border-b border-[#E3E8EE]">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-[#0A2540] placeholder:text-slate-400 text-lg"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-500 border border-slate-200">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-[#425466] text-sm">No results found.</div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <button
                key={cmd.id}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => {
                  navigate(cmd.path);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm transition-colors ${
                  index === selectedIndex
                    ? 'bg-[#F6F9FC] text-[#635BFF] font-medium'
                    : 'text-[#0A2540] hover:bg-slate-50'
                }`}
              >
                <cmd.icon className={`w-5 h-5 ${index === selectedIndex ? 'text-[#635BFF]' : 'text-slate-400'}`} />
                {cmd.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
