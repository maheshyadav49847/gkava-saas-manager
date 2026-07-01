import { useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GkavaLogo } from '../components/GkavaLogo';

interface MarketingLayoutProps {
  children: ReactNode;
}

export const MarketingLayout = ({ children }: MarketingLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Products', path: '/products' },
    { name: 'Industries', path: '/industries' },
    { name: 'About', path: '/about' }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden relative">
      
      {/* Background Mesh Gradients - keeping them in layout so they persist across pages */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 pointer-events-none -z-10"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-100/40 blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-100/40 blur-[100px] pointer-events-none -z-10"></div>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          <Link to="/" className="flex items-center group transition-transform hover:scale-105 duration-300">
            <GkavaLogo className="h-8 md:h-10 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = item.path === '/' 
                ? location.pathname === '/' 
                : location.pathname.startsWith(item.path);
              return (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${isActive ? 'border-indigo-300 text-indigo-700 bg-indigo-50/50' : 'border-transparent text-slate-600 hover:text-indigo-600 hover:border-indigo-400'}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              to="/book-demo" 
              className="hidden md:inline-flex items-center justify-center px-6 py-2.5 bg-transparent border-2 border-slate-900 text-slate-900 text-sm font-bold rounded-full hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300"
            >
              Get a Quote
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-slate-600 border border-transparent hover:border-indigo-400 hover:text-indigo-600 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-4 py-6 flex flex-col gap-4">
                {navItems.map((item) => {
                  const isActive = item.path === '/' 
                    ? location.pathname === '/' 
                    : location.pathname.startsWith(item.path);
                  return (
                    <Link 
                      key={item.name} 
                      to={item.path} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-semibold border ${isActive ? 'border-indigo-300 text-indigo-700 bg-indigo-50/50' : 'border-transparent text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
                <Link 
                  to="/book-demo" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-4 flex items-center justify-center w-full px-6 py-3.5 bg-transparent border-2 border-slate-900 text-slate-900 hover:border-indigo-600 hover:text-indigo-600 text-base font-bold rounded-xl transition-colors"
                >
                  Get a Quote
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 relative overflow-hidden">
        {/* Subtle decorative glow to fill the dark space elegantly */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-16">
            
            {/* Logo & Brand - Horizontal flow */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
              <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-sm border border-white/10 flex-shrink-0">
                <GkavaLogo className="h-10 md:h-12 w-auto filter brightness-0 invert" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">SOFTWARE SOLUTIONS</span>
                <p className="text-sm font-medium text-slate-500 max-w-sm">
                  Building the next generation of scalable, integrated business operating systems.
                </p>
              </div>
            </div>

            {/* Links - Horizontal Flow */}
            <div className="flex flex-wrap items-center gap-6">
              <span className="font-bold text-white uppercase tracking-wider text-xs mr-2">Legal</span>
              <Link to="/privacy" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Terms</Link>
              <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>
              <Link to="/login" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">System Admin</Link>
            </div>

          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-slate-500 font-medium">© 2026 Gkava Software Solutions Inc. All rights reserved.</p>
            <div className="flex gap-4 text-slate-500">
              <a href="#" className="hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
