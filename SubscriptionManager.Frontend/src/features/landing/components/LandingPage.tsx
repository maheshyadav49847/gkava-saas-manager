import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Cloud, Network, ShieldCheck, Zap, Server, Globe2, Cpu, ChevronRight, Stethoscope, Briefcase, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-10 pb-28 lg:pt-16 lg:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">
            
            {/* Left Content */}
            <div className="w-full lg:w-[55%] text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-transparent border-2 border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm"
              >
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
                Gkava Software Solutions
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-[4.5rem] font-black tracking-tighter text-slate-900 mb-8 leading-[1.05]"
              >
                We Build Software <br className="hidden lg:block"/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600">
                  That Runs Your Business.
                </span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium"
              >
                From intelligent SaaS platforms like MyQCare to bespoke enterprise systems, we engineer scalable technology that drives efficiency and growth.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Link to="/solutions" className="w-full sm:w-auto px-8 py-4 bg-slate-900 border-2 border-slate-900 text-white rounded-full text-base font-bold hover:bg-slate-800 hover:border-slate-800 transition-all duration-300 flex items-center justify-center gap-2 group">
                  Custom Engineering
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/products" className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-slate-300 text-slate-700 rounded-full text-base font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300 flex items-center justify-center">
                  Explore Ecosystem
                </Link>
              </motion.div>
            </div>

            {/* Right Content - Premium Glass Dashboard Mockup */}
            <div className="w-full lg:w-[45%] flex justify-center lg:justify-end perspective-[1000px]">
              <motion.div 
                initial={{ opacity: 0, rotateY: 15, rotateX: 5, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, rotateY: -5, rotateX: 5, scale: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 50 }}
                className="relative w-full max-w-lg"
              >
                {/* Main Dashboard Card */}
                <div className="relative bg-white/90 backdrop-blur-2xl rounded-2xl border-2 border-slate-200 p-6 overflow-hidden shadow-xl shadow-indigo-100/30 hover:border-indigo-400 transition-colors duration-300">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
                  
                  <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center text-indigo-600">
                        <Server className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Infrastructure Health</h3>
                        <p className="text-xs font-medium text-slate-500">All systems operational</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-transparent rounded-xl p-4 border-2 border-slate-200">
                      <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Requests / sec</p>
                      <p className="text-2xl font-black text-slate-900">42,891</p>
                      <div className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        99.99% Uptime
                      </div>
                    </div>
                    <div className="bg-transparent rounded-xl p-4 border-2 border-slate-200">
                      <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Latency</p>
                      <p className="text-2xl font-black text-slate-900">12ms</p>
                      <div className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        Optimized
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-32 bg-transparent rounded-xl border-2 border-slate-200 relative overflow-hidden flex items-end">
                    {/* Fake Chart */}
                    <svg className="w-full h-24 text-indigo-200" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
                      <path d="M0 100V50 Q10 40 20 60 T40 40 T60 70 T80 30 T100 20V100Z" fill="currentColor" fillOpacity="0.5" />
                      <path d="M0 50 Q10 40 20 60 T40 40 T60 70 T80 30 T100 20" stroke="var(--color-indigo-500)" strokeWidth="3" fill="none" className="text-indigo-500" />
                    </svg>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 bg-white rounded-xl p-4 border-2 border-slate-200 flex items-center gap-3 backdrop-blur-md shadow-lg"
                >
                  <div className="w-8 h-8 rounded-full border-2 border-emerald-200 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Secure</p>
                    <p className="text-[10px] font-semibold text-slate-500">Enterprise grade</p>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [10, -10, 10] }} 
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 border-2 border-slate-200 flex items-center gap-3 backdrop-blur-md shadow-lg"
                >
                  <div className="w-8 h-8 rounded-full border-2 border-violet-200 flex items-center justify-center text-violet-600">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Lightning Fast</p>
                    <p className="text-[10px] font-semibold text-slate-500">Zero latency</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Trusted Strip */}
      <section className="py-12 border-y border-slate-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">Empowering industries worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-12 text-slate-400">
            <div className="flex items-center gap-2 font-bold text-lg"><Stethoscope className="w-6 h-6"/> Healthcare</div>
            <div className="flex items-center gap-2 font-bold text-lg"><Briefcase className="w-6 h-6"/> Enterprise</div>
            <div className="flex items-center gap-2 font-bold text-lg"><Building2 className="w-6 h-6"/> Real Estate</div>
            <div className="flex items-center gap-2 font-bold text-lg"><Globe2 className="w-6 h-6"/> Global Retail</div>
          </div>
        </div>
      </section>

      {/* The Ecosystem Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Our Ecosystem</h3>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Purpose-built platforms.</h2>
              <p className="mt-4 text-lg text-slate-600 font-medium">Ready-to-deploy SaaS products engineered to solve complex operational challenges out of the box.</p>
            </div>
            <Link to="/products" className="inline-flex items-center gap-2 font-bold text-indigo-600 hover:text-indigo-800 transition-colors group">
              View all products <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "MyQCare",
                desc: "The ultimate clinic management and queueing system. Deep WhatsApp integration, automated billing, and smart analytics.",
                tag: "Healthcare",
                link: "/products/myqcare",
                icon: Stethoscope
              },
              {
                title: "Gkava CRM",
                desc: "Advanced customer relationship management. Intelligent workflows, seamless API connections, and predictive insights.",
                tag: "Coming Soon",
                link: "/products",
                icon: Network
              },
              {
                title: "Gkava Finance",
                desc: "Enterprise ledger and real-time financial tracking. Designed for scale, security, and global compliance.",
                tag: "Coming Soon",
                link: "/products",
                icon: Cloud
              }
            ].map((product, idx) => (
              <Link key={idx} to={product.link} className="block group">
                <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 rounded-2xl border-2 border-indigo-100 bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <product.icon className="w-7 h-7" />
                    </div>
                    <span className="px-3 py-1 border-2 border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {product.tag}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{product.title}</h3>
                  <p className="text-slate-600 font-medium mb-8 flex-grow">{product.desc}</p>
                  <div className="flex items-center text-indigo-600 font-bold text-sm">
                    Explore Platform <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Engineering Section */}
      <section className="py-24 relative bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Custom Engineering</h3>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Need something unique?</h2>
            <p className="mt-4 text-lg text-slate-600 font-medium">We don't just sell products. We partner with enterprises to architect, develop, and scale bespoke software solutions from the ground up.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Cloud, title: "Cloud Native", desc: "Built on AWS/Azure for infinite scale and zero downtime." },
              { icon: Cpu, title: "AI & Machine Learning", desc: "Integrate predictive models and LLMs into your workflows." },
              { icon: Code2, title: "Microservices", desc: "Decoupled, agile, and resilient system architectures." },
              { icon: ShieldCheck, title: "Enterprise Security", desc: "SOC2 compliant standards and end-to-end encryption." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border-2 border-slate-200 text-center hover:border-indigo-400 transition-colors shadow-sm">
                <div className="w-12 h-12 mx-auto rounded-xl border-2 border-slate-100 flex items-center justify-center text-slate-600 mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-500 font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/solutions" className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-slate-900 text-slate-900 rounded-full text-base font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300">
              View Custom Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-8">
            Ready to scale your business?
          </h2>
          <p className="text-xl text-slate-600 font-medium mb-10 max-w-2xl mx-auto">
            Whether you need our ready-made ecosystem or a custom-built platform, Gkava is your technology partner.
          </p>
          <Link to="/book-demo" className="inline-flex items-center justify-center px-10 py-5 bg-indigo-600 border-2 border-indigo-600 text-white rounded-full text-lg font-bold hover:bg-indigo-700 hover:border-indigo-700 transition-all duration-300 shadow-xl shadow-indigo-200">
            Let's Talk
          </Link>
        </div>
      </section>
    </>
  );
};
