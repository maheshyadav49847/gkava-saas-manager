import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Blocks, ListTodo, LogOut, Home, ChevronRight, ChevronDown, User, Tag, ChevronLeft, Settings, Search, Bell, Activity, Receipt, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { CommandPalette } from '../components/CommandPalette';

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Applications", href: "/applications", icon: Blocks },
  { name: "Plans", href: "/plans", icon: ListTodo },
  { name: "Coupons", href: "/coupons", icon: Tag },
  { name: "Tenants", href: "/tenants", icon: Users },
  { name: "Invoices", href: "/invoices", icon: Receipt },
  { name: "Support", href: "/support", icon: MessageSquare },
];

const websiteNavigation = [
  { name: "Platform Settings", href: "/settings", icon: Settings },
  { name: "Team Members", href: "/team-members", icon: User },
  { name: "Audit Logs", href: "/audit-logs", icon: Activity },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex font-sans text-[#0A2540] bg-[#FAFAFA]">
      
      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out bg-white border-r border-[#EAEAEA] hidden md:flex flex-col shrink-0 relative z-20`}>
        <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} border-b border-[#EAEAEA] shrink-0`}>
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center shadow-[0_2px_10px_rgba(79,70,229,0.2)] shrink-0 overflow-hidden bg-white">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            {!isCollapsed && (
              <span className="text-[15px] font-bold tracking-tight text-[#0A2540]">
                gkava-saas-manager
              </span>
            )}
          </div>
        </div>

        <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} py-6 space-y-0.5 overflow-y-auto`}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group relative flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2'} rounded-sm text-[13px] font-medium transition-all duration-200 ${isActive
                    ? "bg-white text-[#635BFF] shadow-[0_2px_5px_rgba(0,0,0,0.04)] border border-[#E3E8EE] font-semibold"
                    : "text-[#425466] hover:bg-[#F6F9FC] hover:text-[#0A2540] border border-transparent"
                  }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#635BFF]" : "text-slate-400 group-hover:text-[#425466]"}`} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
          
          <div className={`pt-6 pb-2 ${isCollapsed ? 'hidden' : 'px-3'}`}>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Settings</p>
          </div>
          
          {websiteNavigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group relative flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2'} rounded-sm text-[13px] font-medium transition-all duration-200 ${isActive
                    ? "bg-white text-[#635BFF] shadow-[0_2px_5px_rgba(0,0,0,0.04)] border border-[#E3E8EE] font-semibold"
                    : "text-[#425466] hover:bg-[#F6F9FC] hover:text-[#0A2540] border border-transparent"
                  }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#635BFF]" : "text-slate-400 group-hover:text-[#425466]"}`} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle Button */}
        <div className="border-t border-[#EAEAEA] p-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-2 px-3'} py-2 rounded-sm text-slate-400 hover:text-[#425466] hover:bg-[#F6F9FC] transition-colors border border-transparent`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4 shrink-0" /> : <ChevronLeft className="w-4 h-4 shrink-0" />}
            {!isCollapsed && <span className="text-[13px] font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        {/* Top Header */}
        <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-[#EAEAEA] flex items-center justify-between px-8 shrink-0 z-10 sticky top-0">
          <div className="flex items-center text-[13px] font-medium text-[#425466]">
            <Link to="/dashboard" className="hover:text-[#0A2540] transition-colors flex items-center gap-1.5 p-1 -ml-1 rounded-sm hover:bg-[#F6F9FC]">
              <Home className="w-3.5 h-3.5" />
            </Link>
            {location.pathname !== "/dashboard" && (
              <>
                <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-300" />
                <span className="capitalize text-[#0A2540] font-semibold tracking-tight">
                  {location.pathname.split('/')[1]?.replace(/-/g, ' ')}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 text-slate-400 border-r border-[#E3E8EE] pr-5">
              <button 
                onClick={() => setIsCommandPaletteOpen(true)}
                className="hover:text-[#425466] transition-colors p-1"
                title="Search (Ctrl+K)"
              >
                <Search className="w-4 h-4" />
              </button>
              
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="hover:text-[#425466] transition-colors relative p-1"
                >
                  <Bell className="w-4 h-4" />
                </button>
                
                  {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-sm border border-[#EAEAEA] shadow-[0_12px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-[#EAEAEA] bg-[#F6F9FC] flex justify-between items-center">
                      <p className="text-[13px] font-semibold text-[#0A2540]">Notifications</p>
                      <button className="text-[11px] text-[#635BFF] hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-8 text-center">
                      <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                      <p className="text-[13px] text-[#425466]">No new notifications</p>
                      <p className="text-[11px] text-slate-400 mt-1">You're all caught up!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 hover:bg-[#F6F9FC] p-1 pr-2 rounded-sm transition-colors border border-transparent hover:border-[#E3E8EE]/60 focus:outline-none"
              >
                <div className="w-7 h-7 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:flex flex-col items-start text-left">
                  <span className="text-[13px] font-medium text-[#425466] leading-none">{user?.name || 'User'}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-sm border border-[#EAEAEA] shadow-[0_12px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-[#EAEAEA] bg-[#F6F9FC]">
                    <p className="text-[13px] font-semibold text-[#0A2540]">{user?.name}</p>
                    <p className="text-[11px] text-[#425466] mt-0.5 truncate">{user?.email}</p>
                  </div>
                  <div className="p-1.5">
                    <Link
                      to="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[#425466] hover:bg-[#F6F9FC] rounded-sm transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Profile Settings
                    </Link>
                  </div>
                  <div className="p-1.5 border-t border-[#EAEAEA]">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                        navigate('/login');
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-rose-600 hover:bg-rose-50 w-full rounded-sm transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="w-full p-6 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
    </div>
  );
}
