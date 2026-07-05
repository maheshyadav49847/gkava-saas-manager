import { motion } from 'framer-motion';
import { ArrowRight, Network, Stethoscope, Briefcase } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import { GkavaLogo } from '../../../components/GkavaLogo';
import { useWebsiteConfigStore } from '../store/useWebsiteConfigStore';

export const ProductsPage = () => {
  const { config } = useWebsiteConfigStore();
  
  // Deduplicate products based on title, prioritizing user-saved ones (with applicationId)
  const uniqueProductsMap = new Map();
  (config.products.items || []).forEach((p: any) => {
    // Only show products that are linked to a real application from the backend
    if (!p.applicationId) return;

    const key = p.applicationId; // Deduplicate by application ID
    uniqueProductsMap.set(key, p);
  });
  
  const products = Array.from(uniqueProductsMap.values()).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

  return (
    <div className="relative z-10 pb-24 font-sans bg-gray-50/30">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-8 border border-indigo-100"
        >
          Product Catalog
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]"
        >
          The Gkava <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Ecosystem</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed mb-10"
        >
          A suite of foundational, highly scalable SaaS products designed to automate workflows and unify data across your entire organization.
        </motion.p>
      </section>

      {/* Main Products List */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto space-y-12 mb-24">
        
        {products.map((product: any, idx: number) => {
          const isReverse = idx % 2 !== 0;
          const Icon = product.icon && (LucideIcons as any)[product.icon] ? (LucideIcons as any)[product.icon] : (idx === 0 ? Stethoscope : Network);
          const slug = product.title ? product.title.toLowerCase().replace(/\s+/g, '-') : '';
          const featureCount = product.features?.length || 0;

          return (
            <motion.div 
              key={product.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-slate-300 transition-all flex flex-col ${isReverse ? 'md:flex-row-reverse' : 'md:flex-row'} group`}
            >
              <div className={`p-12 md:w-1/2 flex flex-col justify-center border-b md:border-b-0 ${isReverse ? 'md:border-l' : 'md:border-r'} border-slate-100`}>
                <div className="flex items-center gap-4 mb-6">
                  {product.imageUrl ? (
                    <div className="w-10 h-10 rounded overflow-hidden border border-slate-100">
                      <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl border-2 border-slate-100 bg-white shadow-sm">
                      <GkavaLogo className="h-8 w-auto" />
                    </div>
                  )}
                  {product.badge && (
                    <span className={`px-3 py-1 ${product.isReady ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'} text-[10px] font-bold uppercase tracking-widest rounded-full`}>
                      {product.badge}
                    </span>
                  )}
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{product.title}</h2>
                <p className="text-slate-600 font-medium mb-8 text-lg leading-relaxed">
                  {product.desc}
                </p>
                <div>
                  {product.isReady ? (
                    <Link to={`/products/${slug}`} className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-full text-base font-bold hover:bg-indigo-600 transition-colors duration-300">
                      Explore {product.title} <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  ) : (
                    <button disabled className="inline-flex items-center justify-center px-8 py-4 bg-slate-100 text-slate-400 rounded-full text-base font-bold cursor-not-allowed">
                      Early Access Full
                    </button>
                  )}
                </div>
              </div>
              <div className="p-12 md:w-1/2 bg-slate-50 flex flex-col justify-center items-center">
                <div className={`w-32 h-32 bg-white rounded-full border-4 ${product.isReady ? 'border-indigo-100' : 'border-slate-100'} flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500`}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} className="w-20 h-20 object-contain" />
                  ) : (
                    <Icon className={`w-16 h-16 ${product.isReady ? 'text-indigo-500' : 'text-slate-400'}`} />
                  )}
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4 w-full text-center">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <span className="block font-black text-2xl text-slate-900">{featureCount}</span>
                      <span className="text-xs font-bold text-slate-500 uppercase">Core Modules</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <span className="block font-black text-2xl text-slate-900">AI</span>
                      <span className="text-xs font-bold text-slate-500 uppercase">Powered</span>
                    </div>
                </div>
              </div>
            </motion.div>
          );
        })}

      </section>

      {/* Embedded Custom Solutions Banner */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
          <div className="relative z-10 max-w-2xl mb-8 md:mb-0">
            <h2 className="text-3xl font-black text-white mb-4">Don't see what you need?</h2>
            <p className="text-slate-400 font-medium text-lg">
              We engineer custom software systems tailored specifically for your unique operational requirements.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <Link to="/solutions" className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 rounded-full text-base font-bold hover:bg-indigo-50 transition-colors shadow-lg">
              View Custom Solutions <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
