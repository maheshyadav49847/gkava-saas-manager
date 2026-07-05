import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { CheckCircle2, Star, Shield, ArrowRight } from 'lucide-react';
import { GkavaLogo } from '../../../components/GkavaLogo';
import { useWebsiteConfigStore } from '../store/useWebsiteConfigStore';
import { LivePricing } from './LivePricing';
import { useEffect, useState } from 'react';
import { getApplications } from '../../applications/api/getApplications';

export const GenericProductPage = () => {
  const { slug } = useParams();
  const { config } = useWebsiteConfigStore();
  const [app, setApp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getApplications()
      .then(apps => {
        const found = apps.find((a: any) => a.name.toLowerCase().replace(/\s+/g, '-') === slug);
        setApp(found);
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) return <div className="py-24 text-center text-slate-500 font-bold animate-pulse">Loading product...</div>;
  if (!app) return <div className="py-24 text-center text-slate-500 font-bold">Product not found.</div>;

  let productConfig = config.products.items.find(i => i.applicationId === app.id);
  if (!productConfig) {
    productConfig = config.products.items.find(i => {
      const mappedTitle = i.title.toLowerCase().includes('myqcare') ? 'MyQCare' : i.title;
      return app.name.toLowerCase().includes(mappedTitle.toLowerCase());
    });
  }
  productConfig = productConfig || {} as any;
  const applicationId = app.id;

  const colorPalette = [
    { color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
    { color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
    { color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-200" },
    { color: "text-violet-600", bg: "bg-violet-50 border-violet-200" },
    { color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
    { color: "text-rose-600", bg: "bg-rose-50 border-rose-200" },
    { color: "text-cyan-600", bg: "bg-cyan-50 border-cyan-200" },
    { color: "text-fuchsia-600", bg: "bg-fuchsia-50 border-fuchsia-200" },
    { color: "text-pink-600", bg: "bg-pink-50 border-pink-200" },
    { color: "text-sky-600", bg: "bg-sky-50 border-sky-200" }
  ];

  const defaultMyQCareFeatures = [
    {
      id: "multi-branch", icon: "Network", title: "1. Multi-Branch Management",
      desc: "Manage your entire healthcare empire from a single dashboard.\nGlobal Branch Selector: Switch between different clinic locations with just one click.\nCentralized Database: Keep patient records, staff, and pharmacy data synchronized across all your branches."
    },
    {
      id: "doctor-desk", icon: "Stethoscope", title: "2. Smart Doctor's Desk",
      desc: "A dedicated, distraction-free workspace built specifically for doctors.\nOne-Click Session Start: Doctors can mark their arrival and start their consultation shifts instantly.\nIn-Consultation View: See exactly who is waiting outside and who is next in line without asking the receptionist.\nFlexible Shift Scheduling: Assign morning or evening shifts for specific days easily."
    },
    {
      id: "live-queue", icon: "Tv", title: "3. Live Queue & Token System",
      desc: "Eliminate crowded waiting rooms and confused patients.\nReal-time Tracking: Front-desk can manage patient tokens live as they move from 'Waiting' to 'Completed.'\nSmart TV Display Mode: Cast a live, professional queue display directly to your waiting room's Smart TV so patients always know their exact turn."
    },
    {
      id: "patient-dir", icon: "Users", title: "4. Centralized Patient Directory",
      desc: "Never lose a patient's record again.\nSmart Search: Easily search for returning patients by name or phone number while adding them to the queue.\nUnified Records: A single, secure database for all your patients across all branches."
    },
    {
      id: "pharmacy", icon: "Pill", title: "5. Integrated Pharmacy & Inventory",
      desc: "Never run out of essential medicines again.\nDigital Inventory: Add and manage medicine pricing, manufacturers, and stock quantities.\nSmart Stock Alerts: Visual color-coded indicators instantly warn you about 'Low Stock' or 'Out of Stock' medicines."
    },
    {
      id: "rbac", icon: "Shield", title: "6. Role-Based Access Control (RBAC)",
      desc: "Complete control over who sees what in your clinic.\nCustom Staff Roles: Assign specific permissions to Receptionists, Nurses, Doctors, and Admins.\nData Security: Ensure that your sensitive financial and patient data is only visible to authorized personnel."
    },
    {
      id: "analytics", icon: "PieChart", title: "7. Analytics & Audit Logs",
      desc: "Data-driven insights to help your clinic grow.\nComprehensive Analytics: Track clinic performance, daily operations, and patient flow.\nSecure Audit Trails: Keep a strict 24/7 log of who added, edited, or deleted data inside the system for ultimate compliance."
    },
    {
      id: "mobile", icon: "Smartphone", title: "8. Mobile & Tablet Friendly",
      desc: "Run your clinic on the go.\nWork from Anywhere: The entire dashboard is perfectly optimized for desktops, tablets, and smartphones.\nDoctor on the Move: Doctors can check their live queue or start sessions directly from their mobile devices."
    },
    {
      id: "solo-doctor", icon: "UserPlus", title: "9. Solo Doctor Quick-Start",
      desc: "No complex setups for individual practitioners.\nAuto-Profile Creation: Clinic owners who practice solo don't need to manage dual accounts. Sign up once, and your doctor profile is ready to go automatically."
    },
    {
      id: "fast-ui", icon: "Zap", title: "10. Lightning Fast & Intuitive UI",
      desc: "Built on modern technology for a frustration-free experience.\nPlug & Play Setup: Solo doctors can sign up and start consulting in less than a minute.\nNo Page Reloads: Fast, drawer-based forms and popups so you never lose your context while working."
    }
  ];

  const rawFeatures = productConfig.features?.length > 0 
    ? productConfig.features 
    : (app.name.toLowerCase().includes('myqcare') ? defaultMyQCareFeatures : []);

  const categories = rawFeatures.map((feat: any, idx: number) => {
    const palette = colorPalette[idx % colorPalette.length];
    
    let bulletPoints = [];
    if (Array.isArray(feat.bulletPoints) && feat.bulletPoints.length > 0) {
      bulletPoints = feat.bulletPoints;
    } else if (feat.desc) {
      bulletPoints = feat.desc.split('\n').filter((l: string) => l.trim() !== '');
    }

    return {
      id: feat.id || idx.toString(),
      iconName: feat.icon || 'Star',
      imageUrl: feat.imageUrl || '',
      title: feat.title || `Module ${idx + 1}`,
      description: feat.description || '',
      color: palette.color,
      bg: palette.bg,
      features: bulletPoints.length > 0 ? bulletPoints : ["No detailed features provided."]
    };
  });


  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 border-2 border-slate-200 shadow-xl overflow-hidden relative">
          {/* Decorative background blur */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/2">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center border-slate-200 bg-white overflow-hidden shrink-0 shadow-sm">
                  {productConfig.imageUrl ? (
                    <img src={productConfig.imageUrl} alt={productConfig.title || app.name} className="w-full h-full object-cover" />
                  ) : (
                    (() => {
                      const Icon = productConfig.icon ? (LucideIcons as any)[productConfig.icon] : null;
                      return Icon ? <Icon className="w-8 h-8 text-indigo-600" /> : <GkavaLogo className="h-10 w-auto" />;
                    })()
                  )}
                </div>
                <span className="px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest">
                  {productConfig.badge || "Flagship Product"}
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                {productConfig.title || app.name}
              </h1>
              <p className="text-xl text-slate-600 font-medium mb-8 leading-relaxed">
                {productConfig.desc || app.description || "The ultimate application for your business. Built with unmatched efficiency and smart automations."}
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
                  <Shield className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6">Platform Highlights</h3>
                  <div className="space-y-4">
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 flex justify-between items-center">
                      <span className="text-sm text-slate-300">Scalability</span>
                      <span className="font-bold text-emerald-400">Enterprise Ready</span>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 flex justify-between items-center">
                      <span className="text-sm text-slate-300">Cloud Hosted</span>
                      <span className="font-bold text-white">99.9% Uptime</span>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 flex justify-between items-center">
                      <span className="text-sm text-slate-300">Data Security</span>
                      <span className="font-bold text-indigo-300">End-to-End Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Pricing Section */}
      {applicationId && (
        <LivePricing applicationId={applicationId} />
      )}

      {/* Massive Features Grid */}
      <section id="features" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Powerful Modules to Supercharge Your Workflow</h2>
          <p className="text-lg text-slate-600 font-medium">Experience a seamless, all-in-one system designed to save time, reduce chaos, and enhance productivity.</p>
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
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform shrink-0 overflow-hidden`}>
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.title} className="w-full h-full object-cover" />
                  ) : (
                    (() => {
                      const Icon = (LucideIcons as any)[cat.iconName] || Star;
                      return <Icon className="w-7 h-7" />;
                    })()
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">{cat.title}</h3>
              </div>
              
              {cat.description && (
                <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">
                  {cat.description}
                </p>
              )}
              
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
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">Ready to digitize your workflow?</h2>
            <p className="text-xl text-indigo-100 font-medium mb-10 max-w-2xl mx-auto">
              Join top companies using {app.name} to deliver exceptional experiences and scale effortlessly.
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
