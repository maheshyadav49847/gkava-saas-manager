import { motion } from 'framer-motion';
import { ArrowRight, Network, Stethoscope, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GkavaLogo } from '../../../components/GkavaLogo';

export const ProductsPage = () => {
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
        
        {/* Product 1: MyQCare (Flagship) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-lg hover:border-indigo-400 hover:shadow-indigo-100/50 transition-all flex flex-col md:flex-row group"
        >
          <div className="p-12 md:w-1/2 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl border-2 border-slate-100 bg-white shadow-sm">
                <GkavaLogo className="h-8 w-auto" />
              </div>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-full">Flagship</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">MyQCare</h2>
            <p className="text-slate-600 font-medium mb-8 text-lg leading-relaxed">
              The ultimate clinic management and intelligent queueing system. Elevate patient satisfaction with deep WhatsApp integration, AI predictions, and automated billing.
            </p>
            <div>
              <Link to="/products/myqcare" className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-full text-base font-bold hover:bg-indigo-600 transition-colors duration-300">
                Explore MyQCare <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
          <div className="p-12 md:w-1/2 bg-slate-50 flex flex-col justify-center items-center">
             <div className="w-32 h-32 bg-white rounded-full border-4 border-indigo-100 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
               <Stethoscope className="w-16 h-16 text-indigo-500" />
             </div>
             <div className="mt-8 grid grid-cols-2 gap-4 w-full text-center">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><span className="block font-black text-2xl text-slate-900">11</span><span className="text-xs font-bold text-slate-500 uppercase">Core Modules</span></div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><span className="block font-black text-2xl text-slate-900">AI</span><span className="text-xs font-bold text-slate-500 uppercase">Powered</span></div>
             </div>
          </div>
        </motion.div>

        {/* Product 2: CRM */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-slate-300 transition-all flex flex-col md:flex-row-reverse group"
        >
          <div className="p-12 md:w-1/2 flex flex-col justify-center border-b md:border-b-0 md:border-l border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Coming Soon</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Gkava CRM</h2>
            <p className="text-slate-600 font-medium mb-8 text-lg leading-relaxed">
              Advanced customer relationship management. Intelligent workflows, seamless API connections, and predictive insights to supercharge your sales team.
            </p>
            <div>
              <button disabled className="inline-flex items-center justify-center px-8 py-4 bg-slate-100 text-slate-400 rounded-full text-base font-bold cursor-not-allowed">
                Early Access Full
              </button>
            </div>
          </div>
          <div className="p-12 md:w-1/2 bg-slate-50 flex flex-col justify-center items-center">
             <div className="w-32 h-32 bg-white rounded-full border-4 border-slate-100 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
               <Network className="w-16 h-16 text-slate-400" />
             </div>
          </div>
        </motion.div>

        {/* Product 3: Finance */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-slate-300 transition-all flex flex-col md:flex-row group"
        >
          <div className="p-12 md:w-1/2 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-full">In Development</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Gkava Finance</h2>
            <p className="text-slate-600 font-medium mb-8 text-lg leading-relaxed">
              Enterprise ledger and real-time financial tracking. Designed for scale, security, and global compliance across multiple jurisdictions.
            </p>
            <div>
              <button disabled className="inline-flex items-center justify-center px-8 py-4 bg-slate-100 text-slate-400 rounded-full text-base font-bold cursor-not-allowed">
                Join Waitlist
              </button>
            </div>
          </div>
          <div className="p-12 md:w-1/2 bg-slate-50 flex flex-col justify-center items-center">
             <div className="w-32 h-32 bg-white rounded-full border-4 border-slate-100 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
               <Briefcase className="w-16 h-16 text-slate-400" />
             </div>
          </div>
        </motion.div>

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
