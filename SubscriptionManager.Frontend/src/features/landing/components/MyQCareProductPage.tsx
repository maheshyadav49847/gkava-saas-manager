import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, Stethoscope, Tv, Pill, 
  PieChart, ArrowRight, CheckCircle2, Network, Shield, Smartphone, UserPlus, Zap
} from 'lucide-react';
import { GkavaLogo } from '../../../components/GkavaLogo';

export const MyQCareProductPage = () => {
  const categories = [
    {
      id: "multi-branch",
      icon: Network,
      title: "1. Multi-Branch Management",
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
      features: [
        "Manage your entire healthcare empire from a single dashboard.",
        "Global Branch Selector: Switch between different clinic locations with just one click.",
        "Centralized Database: Keep patient records, staff, and pharmacy data synchronized across all your branches."
      ]
    },
    {
      id: "doctor-desk",
      icon: Stethoscope,
      title: "2. Smart Doctor's Desk",
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-200",
      features: [
        "A dedicated, distraction-free workspace built specifically for doctors.",
        "One-Click Session Start: Doctors can mark their arrival and start their consultation shifts instantly.",
        "In-Consultation View: See exactly who is waiting outside and who is next in line without asking the receptionist.",
        "Flexible Shift Scheduling: Assign morning or evening shifts for specific days easily."
      ]
    },
    {
      id: "live-queue",
      icon: Tv,
      title: "3. Live Queue & Token System",
      color: "text-indigo-600",
      bg: "bg-indigo-50 border-indigo-200",
      features: [
        "Eliminate crowded waiting rooms and confused patients.",
        "Real-time Tracking: Front-desk can manage patient tokens live as they move from 'Waiting' to 'Completed.'",
        "Smart TV Display Mode: Cast a live, professional queue display directly to your waiting room's Smart TV so patients always know their exact turn."
      ]
    },
    {
      id: "patient-dir",
      icon: Users,
      title: "4. Centralized Patient Directory",
      color: "text-violet-600",
      bg: "bg-violet-50 border-violet-200",
      features: [
        "Never lose a patient's record again.",
        "Smart Search: Easily search for returning patients by name or phone number while adding them to the queue.",
        "Unified Records: A single, secure database for all your patients across all branches."
      ]
    },
    {
      id: "pharmacy",
      icon: Pill,
      title: "5. Integrated Pharmacy & Inventory",
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
      features: [
        "Never run out of essential medicines again.",
        "Digital Inventory: Add and manage medicine pricing, manufacturers, and stock quantities.",
        "Smart Stock Alerts: Visual color-coded indicators instantly warn you about 'Low Stock' or 'Out of Stock' medicines."
      ]
    },
    {
      id: "rbac",
      icon: Shield,
      title: "6. Role-Based Access Control (RBAC)",
      color: "text-rose-600",
      bg: "bg-rose-50 border-rose-200",
      features: [
        "Complete control over who sees what in your clinic.",
        "Custom Staff Roles: Assign specific permissions to Receptionists, Nurses, Doctors, and Admins.",
        "Data Security: Ensure that your sensitive financial and patient data is only visible to authorized personnel."
      ]
    },
    {
      id: "analytics",
      icon: PieChart,
      title: "7. Analytics & Audit Logs",
      color: "text-cyan-600",
      bg: "bg-cyan-50 border-cyan-200",
      features: [
        "Data-driven insights to help your clinic grow.",
        "Comprehensive Analytics: Track clinic performance, daily operations, and patient flow.",
        "Secure Audit Trails: Keep a strict 24/7 log of who added, edited, or deleted data inside the system for ultimate compliance."
      ]
    },
    {
      id: "mobile",
      icon: Smartphone,
      title: "8. Mobile & Tablet Friendly",
      color: "text-fuchsia-600",
      bg: "bg-fuchsia-50 border-fuchsia-200",
      features: [
        "Run your clinic on the go.",
        "Work from Anywhere: The entire dashboard is perfectly optimized for desktops, tablets, and smartphones.",
        "Doctor on the Move: Doctors can check their live queue or start sessions directly from their mobile devices."
      ]
    },
    {
      id: "solo-doctor",
      icon: UserPlus,
      title: "9. Solo Doctor Quick-Start",
      color: "text-pink-600",
      bg: "bg-pink-50 border-pink-200",
      features: [
        "No complex setups for individual practitioners.",
        "Auto-Profile Creation: Clinic owners who practice solo don't need to manage dual accounts. Sign up once, and your doctor profile is ready to go automatically."
      ]
    },
    {
      id: "fast-ui",
      icon: Zap,
      title: "10. Lightning Fast & Intuitive UI",
      color: "text-slate-700",
      bg: "bg-slate-100 border-slate-300",
      features: [
        "Built on modern technology for a frustration-free experience.",
        "Plug & Play Setup: Solo doctors can sign up and start consulting in less than a minute.",
        "No Page Reloads: Fast, drawer-based forms and popups so you never lose your context while working."
      ]
    }
  ];

  return (
    <div className="relative z-10 pb-24 font-sans bg-gray-50/50">
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 border-2 border-slate-200 shadow-xl overflow-hidden relative">
          {/* Decorative background blur */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/2">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl border-2 border-slate-200 bg-white">
                  <GkavaLogo className="h-10 w-auto" />
                </div>
                <span className="px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest">
                  Flagship Product
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                MyQCare
              </h1>
              <p className="text-xl text-slate-600 font-medium mb-8 leading-relaxed">
                The ultimate clinic management and queueing system. Built with unmatched efficiency, smart automations, and AI to elevate patient satisfaction.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/book-demo" className="px-8 py-4 bg-indigo-600 text-white rounded-full text-base font-bold hover:bg-indigo-700 transition-colors shadow-lg">
                  Book a Demo
                </Link>
                <a href="#features" className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-full text-base font-bold hover:border-indigo-600 hover:text-indigo-600 transition-colors">
                  Explore Features
                </a>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Stethoscope className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6">Clinic Overview</h3>
                  <div className="space-y-4">
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 flex justify-between items-center">
                      <span className="text-sm text-slate-300">Live Queue</span>
                      <span className="font-bold text-emerald-400">14 Waiting</span>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 flex justify-between items-center">
                      <span className="text-sm text-slate-300">Today's Revenue</span>
                      <span className="font-bold text-white">₹ 42,500</span>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 flex justify-between items-center">
                      <span className="text-sm text-slate-300">AI Prediction</span>
                      <span className="font-bold text-indigo-300">2 No-shows detected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Massive Features Grid */}
      <section id="features" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Powerful Features to Supercharge Your Clinic</h2>
          <p className="text-lg text-slate-600 font-medium">Experience a seamless, all-in-one clinic management system designed to save time, reduce chaos, and enhance patient care.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 3) * 0.1 }}
              className="bg-white rounded-3xl p-8 border-2 border-slate-200 hover:border-indigo-400 transition-colors shadow-sm flex flex-col h-full group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">{cat.title}</h3>
              </div>
              
              <ul className="space-y-4 flex-grow">
                {cat.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600 font-medium leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto text-center mt-12">
        <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">Ready to digitize your clinic?</h2>
            <p className="text-xl text-indigo-100 font-medium mb-10 max-w-2xl mx-auto">
              Join top healthcare providers using MyQCare to deliver exceptional patient experiences.
            </p>
            <Link to="/book-demo" className="inline-flex items-center justify-center px-10 py-5 bg-white text-indigo-600 rounded-full text-lg font-bold hover:bg-indigo-50 transition-colors shadow-xl">
              Schedule a Live Demo <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
};
