import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWebsiteConfigStore } from '../store/useWebsiteConfigStore';

export const PrivacyPolicy = () => {
  const { config } = useWebsiteConfigStore();
  const { privacyPolicy } = config.legal;

  return (
    <div className="relative z-10 pb-24">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-6 text-indigo-600"
          >
            <Shield className="w-8 h-8" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4"
          >
            {privacyPolicy.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-medium text-indigo-600 mt-6"
          >
            Last Updated: {privacyPolicy.lastUpdated}
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16 flex flex-col items-center">
        <div className="w-full lg:w-3/4 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 prose prose-indigo max-w-none text-gray-600 leading-relaxed">
          {privacyPolicy.sections && privacyPolicy.sections.map((section) => (
            <div key={section.id} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
