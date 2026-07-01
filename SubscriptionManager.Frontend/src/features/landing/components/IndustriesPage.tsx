import { motion } from 'framer-motion';
import { Stethoscope, Building2, GraduationCap, Briefcase, ShoppingBag, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const IndustriesPage = () => {
  const industries = [
    { 
      icon: Stethoscope, 
      title: "Healthcare", 
      desc: "HIPAA-compliant patient management, intelligent EMRs, and automated queueing for clinics and hospitals.",
      features: ["Patient Portals", "Telemedicine Integration", "Automated Billing"]
    },
    { 
      icon: Briefcase, 
      title: "Enterprise & Corporate", 
      desc: "Custom ERP solutions, intelligent HR workflows, and comprehensive data analytics to run modern corporations.",
      features: ["Resource Planning", "Employee Portals", "Data Lakes"]
    },
    { 
      icon: ShoppingBag, 
      title: "Retail & E-commerce", 
      desc: "High-throughput inventory management, multi-channel sales integrations, and customer loyalty CRMs.",
      features: ["Omnichannel Sync", "Inventory Tracking", "Loyalty Programs"]
    },
    { 
      icon: Building2, 
      title: "Real Estate", 
      desc: "End-to-end property management, tenant life-cycle tracking, and automated lease processing systems.",
      features: ["Tenant Portals", "Lease Automation", "Maintenance Ticketing"]
    },
    { 
      icon: Truck, 
      title: "Logistics & Supply", 
      desc: "Real-time fleet tracking, intelligent routing algorithms, and warehouse management systems.",
      features: ["Fleet Tracking", "Route Optimization", "Vendor Portals"]
    },
    { 
      icon: GraduationCap, 
      title: "Education & EdTech", 
      desc: "Scalable learning management systems (LMS), student portals, and administrative automation.",
      features: ["Virtual Classrooms", "Student Dashboards", "Fee Management"]
    }
  ];

  return (
    <div className="relative z-10 pb-24 font-sans bg-gray-50/30">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-8 border border-indigo-100"
        >
          Industries We Serve
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]"
        >
          Built for <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Every Industry.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed mb-10"
        >
          We engineer domain-specific software solutions that understand the complex regulatory, operational, and scaling requirements of your sector.
        </motion.p>
      </section>

      {/* Industries Grid */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 3) * 0.1 }}
              className="bg-white rounded-3xl p-8 border-2 border-slate-200 hover:border-indigo-400 transition-all shadow-sm hover:shadow-lg flex flex-col group"
            >
              <div className="w-14 h-14 rounded-2xl border-2 border-slate-100 flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed font-medium mb-6 flex-grow">{item.desc}</p>
              
              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Key Capabilities</h4>
                <ul className="space-y-3">
                  {item.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="text-sm text-slate-700 font-semibold">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
          <div className="relative z-10 max-w-2xl mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Need a specialized solution?</h2>
            <p className="text-slate-400 font-medium text-lg">
              Our engineering team can architect a bespoke platform designed specifically for your industry's unique challenges.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <Link to="/book-demo" className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-full text-base font-bold hover:bg-indigo-500 transition-colors shadow-lg">
              Talk to an Expert <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
