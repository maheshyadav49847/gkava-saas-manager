import { ArrowRight, Scale, FileText, AlertTriangle, XCircle, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export const Terms = () => {
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
            <Scale className="w-8 h-8" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4"
          >
            Terms of Service
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto"
          >
            These Terms of Service govern your use of the website and SaaS products provided by Gkava. Please read them carefully.
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
            <a href="#terms" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">1. Terms</a>
            <a href="#license" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">2. Use License</a>
            <a href="#disclaimer" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">3. Disclaimer</a>
            <a href="#limitations" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">4. Limitations</a>
            <a href="#governing-law" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">5. Governing Law</a>
          </nav>
        </div>

        {/* Policy Content */}
        <div className="w-full lg:w-3/4 space-y-12 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          
          <section id="terms" className="scroll-mt-28">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">1. Terms</h2>
            </div>
            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed space-y-4">
              <p>By accessing the website at Gkava.com or using any of our associated SaaS products (including MyQCare, DocAppointment, etc.), you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
              <p>If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>
            </div>
          </section>

          <section id="license" className="scroll-mt-28">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                <Globe className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">2. Use License</h2>
            </div>
            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed space-y-4">
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on Gkava's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Modify or copy the materials;</li>
                <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                <li>Attempt to decompile or reverse engineer any software contained on Gkava's website;</li>
                <li>Remove any copyright or other proprietary notations from the materials; or</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
              </ul>
              <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by Gkava at any time.</p>
            </div>
          </section>

          <section id="disclaimer" className="scroll-mt-28">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">3. Disclaimer</h2>
            </div>
            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed space-y-4">
              <p>The materials on Gkava's website and its software products are provided on an 'as is' basis. Gkava makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
              <p>Further, Gkava does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>
            </div>
          </section>

          <section id="limitations" className="scroll-mt-28">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                <XCircle className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">4. Limitations</h2>
            </div>
            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed space-y-4">
              <p>In no event shall Gkava or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Gkava's website, even if Gkava or a Gkava authorized representative has been notified orally or in writing of the possibility of such damage.</p>
            </div>
          </section>

          <section id="governing-law" className="scroll-mt-28 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                <Scale className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">5. Governing Law</h2>
            </div>
            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed">
              <p>These terms and conditions are governed by and construed in accordance with the applicable laws of your jurisdiction, and you irrevocably submit to the exclusive jurisdiction of the courts in that location for the resolution of any disputes.</p>
              <p className="mt-4">If you have any questions regarding these terms, please contact us at:</p>
              <a href="mailto:legal@gkava.com" className="inline-flex items-center font-semibold text-indigo-600 hover:text-indigo-700 transition-colors mt-2">
                legal@gkava.com <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};
