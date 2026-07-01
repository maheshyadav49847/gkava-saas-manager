import { ArrowRight, Shield, Database, Lock, UserCheck, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export const PrivacyPolicy = () => {
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
            Privacy Policy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto"
          >
            We believe that privacy is a fundamental human right. Here is our transparent guide on how we handle your data at Gkava.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-medium text-indigo-600 mt-6"
          >
            Last Updated: June 2026
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Sticky Sidebar Navigation */}
        <div className="hidden lg:block w-1/4 sticky top-28">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Contents</h3>
          <nav className="flex flex-col gap-3">
            <a href="#info-collect" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Information We Collect</a>
            <a href="#how-we-use" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">How We Use Your Info</a>
            <a href="#sharing" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Sharing of Information</a>
            <a href="#security" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Security Standards</a>
            <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Contact Us</a>
          </nav>
        </div>

        {/* Policy Content */}
        <div className="w-full lg:w-3/4 space-y-12 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          
          <section id="info-collect" className="scroll-mt-28">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Information We Collect</h2>
            </div>
            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed space-y-4">
              <p>When you use Gkava's suite of SaaS products, we may collect information you provide directly to us. This includes your name, email address, billing information, and any organization details you use to configure your workspace.</p>
              <p>We also automatically collect certain technical information about your device and usage of our services to ensure optimal performance and security. This may include IP addresses, browser types, and interaction metrics.</p>
            </div>
          </section>

          <section id="how-we-use" className="scroll-mt-28">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">How We Use Your Information</h2>
            </div>
            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed space-y-4">
              <p>We use the information we collect strictly to operate, maintain, and provide the features and functionality of Gkava's products. This includes:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Authenticating your access to our systems.</li>
                <li>Processing transactions and sending related information like invoices.</li>
                <li>Sending technical notices, updates, security alerts, and support messages.</li>
                <li>Monitoring and analyzing trends, usage, and activities in connection with our services.</li>
              </ul>
            </div>
          </section>

          <section id="sharing" className="scroll-mt-28">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Sharing of Your Information</h2>
            </div>
            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed space-y-4">
              <p>We take your privacy seriously. <strong>We do not sell, rent, or lease your personally identifiable information to third parties.</strong></p>
              <p>We may share your information only in the following circumstances: with your consent, with trusted third-party service providers (like payment processors) who assist us in operating our platform, or when required by law to comply with a valid legal process.</p>
            </div>
          </section>

          <section id="security" className="scroll-mt-28">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Security Standards</h2>
            </div>
            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed space-y-4">
              <p>We implement enterprise-grade security measures to protect your information. This includes encryption of data in transit and at rest, regular security audits, and strict access controls for our infrastructure.</p>
              <p>However, please be aware that no method of transmission over the internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>
            </div>
          </section>

          <section id="contact" className="scroll-mt-28 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Contact Us</h2>
            </div>
            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed">
              <p>If you have any questions or concerns about this Privacy Policy, please don't hesitate to reach out to our privacy team.</p>
              <a href="mailto:privacy@gkava.com" className="inline-flex items-center font-semibold text-indigo-600 hover:text-indigo-700 transition-colors mt-2">
                privacy@gkava.com <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};
