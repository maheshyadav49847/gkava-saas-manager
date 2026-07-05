import { motion } from 'framer-motion';
import { Shield, Target, Zap, HeartHandshake, ArrowRight, Code2, Rocket } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWebsiteConfigStore } from '../store/useWebsiteConfigStore';

export const AboutPage = () => {
  const { config } = useWebsiteConfigStore();
  const { hero, mission, vision, values, cta } = config.about;

  return (
    <div className="relative z-10 pb-24 font-sans bg-gray-50/30">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-8 border border-indigo-100"
        >
          {hero.tagline}
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]"
        >
          {hero.title} <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">{hero.titleHighlight}</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed mb-10"
        >
          {hero.subtitle}
        </motion.p>
      </section>

      {/* Vision & Mission */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Target className="w-48 h-48 text-white" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-white mb-6">{mission.title}</h2>
              <p className="text-slate-300 font-medium text-lg leading-relaxed">
                {mission.desc}
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white border-2 border-slate-200 rounded-3xl p-10 md:p-14 shadow-lg relative overflow-hidden group hover:border-indigo-400 transition-colors"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <Rocket className="w-48 h-48 text-indigo-900" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-slate-900 mb-6">{vision.title}</h2>
              <p className="text-slate-600 font-medium text-lg leading-relaxed">
                {vision.desc}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{values.title}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.items.map((val, idx) => {
            const iconName = val.icon || ['Zap', 'Shield', 'Code2', 'HeartHandshake'][idx % 4];
            const Icon = (LucideIcons as any)[iconName] || LucideIcons.Zap;
            return (
              <motion.div 
                key={val.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className="bg-white rounded-3xl p-8 border-2 border-slate-200 hover:border-indigo-400 transition-all shadow-sm hover:shadow-md text-center flex flex-col items-center group"
              >
                <div className="w-16 h-16 rounded-full border-2 border-indigo-100 bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 overflow-hidden p-2">
                  {val.imageUrl ? <img src={val.imageUrl} alt="" className="w-full h-full object-contain rounded-full" /> : <Icon className="w-8 h-8" />}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">{val.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="bg-indigo-50 border-2 border-indigo-100 rounded-3xl p-12 md:p-16 relative overflow-hidden">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 relative z-10">{cta.title}</h2>
          <p className="text-lg text-slate-600 font-medium mb-10 max-w-2xl mx-auto relative z-10">
            {cta.subtitle}
          </p>
          <Link to="/book-demo" className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-full text-base font-bold hover:bg-indigo-700 transition-colors shadow-lg relative z-10">
            {cta.buttonText} <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};
