import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, AppWindow, Blocks, ListTodo, LogOut, Home, ChevronRight, ChevronDown, User, Tag, ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Website Builder", href: "/website-builder", icon: AppWindow },
  { name: "Applications", href: "/applications", icon: Blocks },
  { name: "Plans", href: "/plans", icon: ListTodo },
  { name: "Coupons", href: "/coupons", icon: Tag },
  { name: "Tenants", href: "/tenants", icon: Users },
];

export default function DashboardLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans text-slate-900 dark:text-slate-100">

      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col shrink-0 relative`}>
        <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} border-b border-slate-200 dark:border-slate-800 shrink-0`}>
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 shrink-0">
              <span className="text-white font-bold text-lg leading-none">S</span>
            </div>
            {!isCollapsed && (
              <span className="text-lg font-bold tracking-tight bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                SubManager
              </span>
            )}
          </div>
        </div>

        <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-3'} py-6 space-y-1 overflow-y-auto`}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group relative flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'} rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
                
                {/* Popover Tooltip for Collapsed State */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.name}
                    {/* Tooltip Arrow */}
                    <div className="absolute top-1/2 -left-1 -mt-1 w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45"></div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle Button */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-2 px-3'} py-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5 shrink-0" /> : <ChevronLeft className="w-5 h-5 shrink-0" />}
            {!isCollapsed && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
          <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
            </Link>
            {location.pathname !== "/dashboard" && (
              <>
                <ChevronRight className="w-4 h-4 mx-2 text-slate-300 dark:text-slate-600" />
                <span className="capitalize text-slate-900 dark:text-white font-semibold">
                  {location.pathname.split('/')[1]?.replace(/-/g, ' ')}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 pr-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:flex flex-col items-start text-left">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white leading-none">{user?.name || 'User'}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      to="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile Settings
                    </Link>
                  </div>
                  <div className="p-2 border-t border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 w-full rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
