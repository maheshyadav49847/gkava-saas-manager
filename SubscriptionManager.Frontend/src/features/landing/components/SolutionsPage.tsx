import { motion } from 'framer-motion';
import { Server, Shield, Code2, Database, Cpu, ArrowRight, Blocks } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SolutionsPage = () => {
  return (
    <div className="relative z-10 pb-24">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-8 border border-indigo-100"
        >
          Gkava Custom Engineering
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]"
        >
          Bespoke Software <br className="hidden md:block"/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            For Complex Challenges.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed mb-10"
        >
          We don't just write code; we partner with enterprises to architect, develop, and scale custom software systems that become the backbone of your operations.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/book-demo" className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-full text-base font-bold hover:bg-indigo-600 transition-colors duration-300 shadow-lg hover:shadow-indigo-500/25">
            Discuss Your Project
          </Link>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Core Capabilities</h2>
          <p className="mt-4 text-lg text-slate-600 font-medium max-w-2xl">End-to-end software engineering services tailored to your organizational needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              icon: Blocks, 
              title: "Enterprise Architecture", 
              desc: "We design resilient, scalable systems using microservices and event-driven architectures to handle massive scale." 
            },
            { 
              icon: Server, 
              title: "Cloud Native Development", 
              desc: "Build and deploy on AWS, Azure, or GCP. We leverage serverless computing and containers for ultimate flexibility." 
            },
            { 
              icon: Database, 
              title: "Data & Analytics", 
              desc: "Data pipelines, warehousing, and real-time analytics to turn your raw data into actionable business intelligence." 
            },
            { 
              icon: Cpu, 
              title: "AI & Machine Learning", 
              desc: "Integrate predictive models, LLMs, and intelligent automation directly into your custom software workflows." 
            },
            { 
              icon: Code2, 
              title: "Legacy Modernization", 
              desc: "Safely migrate and refactor aging monoliths into modern, maintainable, and high-performance tech stacks." 
            },
            { 
              icon: Shield, 
              title: "Security & Compliance", 
              desc: "Security by design. We build HIPAA, SOC2, and GDPR compliant systems with end-to-end encryption." 
            }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="bg-white border-2 border-slate-200 p-8 rounded-3xl hover:border-indigo-400 transition-all group shadow-sm hover:shadow-lg"
            >
              <div className="w-14 h-14 rounded-2xl border-2 border-slate-100 flex items-center justify-center text-slate-600 mb-6 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Process */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200 mt-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">How We Deliver</h2>
          <p className="mt-4 text-lg text-slate-600 font-medium">A proven engineering methodology focused on transparency and results.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Discovery", desc: "Deep dive into your business logic, bottlenecks, and technical requirements." },
            { step: "02", title: "Architecture", desc: "Designing the system blueprints, selecting the right stack, and proving concepts." },
            { step: "03", title: "Execution", desc: "Agile sprints, rigorous testing, and continuous integration of the solution." },
            { step: "04", title: "Scale", desc: "Deployment, monitoring, maintenance, and scaling the infrastructure as you grow." }
          ].map((phase, idx) => (
            <div key={idx} className="relative">
              <div className="text-6xl font-black text-indigo-200 mb-4">{phase.step}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 relative z-10">{phase.title}</h3>
              <p className="text-slate-600 font-medium text-sm">{phase.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center bg-indigo-50 rounded-3xl border-2 border-indigo-100 mt-12">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-6">Ready to build your platform?</h2>
        <p className="text-lg text-slate-600 font-medium mb-10 max-w-2xl mx-auto">
          Schedule a technical discovery call with our lead engineers to map out your custom software solution.
        </p>
        <Link to="/book-demo" className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-full text-base font-bold hover:bg-indigo-700 transition-colors shadow-lg">
          Book Discovery Call <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </section>

    </div>
  );
};
