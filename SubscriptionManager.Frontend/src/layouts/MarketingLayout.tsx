import { useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GkavaLogo } from '../components/GkavaLogo';
import { useCartStore } from '../features/landing/store/useCartStore';
import { useWebsiteConfigStore } from '../features/landing/store/useWebsiteConfigStore';
import { useEffect } from 'react';

interface MarketingLayoutProps {
  children: ReactNode;
}

export const MarketingLayout = ({ children }: MarketingLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const cartItems = useCartStore(state => state.items);
  const fetchConfig = useWebsiteConfigStore(state => state.fetchConfig);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden relative">
      
      {/* Background Mesh Gradients - keeping them in layout so they persist across pages */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 pointer-events-none -z-10"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-100/40 blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-100/40 blur-[100px] pointer-events-none -z-10"></div>

      <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
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
            {cartItems.length > 0 && (
              <Link to="/checkout" className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              </Link>
            )}



            <button 
              className="lg:hidden p-2 -mr-2 text-slate-600 hover:text-indigo-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

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
                <div className="h-px bg-slate-200/50 my-2"></div>


              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 relative z-10 pt-20">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <GkavaLogo className="h-8 w-auto text-white mb-6" />
              <p className="text-slate-400 font-medium max-w-sm">
                Empowering businesses with enterprise-grade solutions. Built for scale, designed for simplicity.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Platform</h4>
              <ul className="space-y-3 font-medium text-slate-400">
                <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-3 font-medium text-slate-400">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-sm text-slate-500 font-medium text-center md:text-left flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} Gkava. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
