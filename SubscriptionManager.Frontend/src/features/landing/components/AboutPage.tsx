import { motion } from 'framer-motion';
import { Shield, Target, Zap, HeartHandshake, ArrowRight, Code2, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
  return (
    <div className="relative z-10 pb-24 font-sans bg-gray-50/30">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-8 border border-indigo-100"
        >
          Our Story
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]"
        >
          Engineering the <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Future</span> of Business.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed mb-10"
        >
          Gkava Software Solutions is on a mission to eliminate operational friction. We build foundational, highly scalable software infrastructure that powers the next generation of agile enterprises.
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
              <h2 className="text-3xl font-black text-white mb-6">Our Mission</h2>
              <p className="text-slate-300 font-medium text-lg leading-relaxed">
                To democratize enterprise-grade technology. We believe that every business, regardless of size, deserves access to intelligent, secure, and beautiful software that scales with their ambition.
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
              <h2 className="text-3xl font-black text-slate-900 mb-6">Our Vision</h2>
              <p className="text-slate-600 font-medium text-lg leading-relaxed">
                To become the default operating system for modern business management globally. From custom engineering to our flagship SaaS products, we are building the digital backbone of tomorrow's economy.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Our Core Values</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Zap, title: "Performance First", desc: "Speed is a feature. We engineer systems that respond in milliseconds." },
            { icon: Shield, title: "Uncompromising Security", desc: "Bank-grade encryption and privacy-by-design in everything we build." },
            { icon: Code2, title: "Engineering Excellence", desc: "Clean code, robust architecture, and rigorous testing methodologies." },
            { icon: HeartHandshake, title: "Client Partnership", desc: "We don't just write code; we partner in our clients' success." }
          ].map((val, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="bg-white rounded-3xl p-8 border-2 border-slate-200 hover:border-indigo-400 transition-all shadow-sm hover:shadow-md text-center flex flex-col items-center group"
            >
              <div className="w-16 h-16 rounded-full border-2 border-indigo-100 bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <val.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="bg-indigo-50 border-2 border-indigo-100 rounded-3xl p-12 md:p-16 relative overflow-hidden">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 relative z-10">Ready to build the future?</h2>
          <p className="text-lg text-slate-600 font-medium mb-10 max-w-2xl mx-auto relative z-10">
            Whether you're looking for a bespoke software solution or want to implement our flagship products, our team is ready to help.
          </p>
          <Link to="/book-demo" className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-full text-base font-bold hover:bg-indigo-700 transition-colors shadow-lg relative z-10">
            Get in Touch <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};
