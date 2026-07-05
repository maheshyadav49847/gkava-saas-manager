import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, CalendarCheck, ShieldCheck, Send } from 'lucide-react';
import { useWebsiteConfigStore } from '../store/useWebsiteConfigStore';

export const BookDemo = () => {
  const { config } = useWebsiteConfigStore();
  const { hero } = config.bookDemo;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="relative z-10 flex flex-col font-sans">
      
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-gray-100">
          
          {/* Left Side: Value Proposition */}
          <div className="lg:w-5/12 bg-[#4F46E5] p-10 md:p-16 flex flex-col justify-between relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-900 opacity-20 blur-3xl"></div>

            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
                {hero.title}
              </h1>
              <p className="text-indigo-100 text-lg mb-10 leading-relaxed">
                {hero.subtitle}
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-400/20 rounded-full p-2 mt-1">
                    <Clock className="w-5 h-5 text-indigo-100" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-white font-bold text-lg">Save Countless Hours</h3>
                    <p className="text-indigo-200 mt-1">Automate routine tasks so your team can focus on what truly matters.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-400/20 rounded-full p-2 mt-1">
                    <CalendarCheck className="w-5 h-5 text-indigo-100" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-white font-bold text-lg">Seamless Onboarding</h3>
                    <p className="text-indigo-200 mt-1">Our products are designed for rapid deployment and ease of use.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-400/20 rounded-full p-2 mt-1">
                    <ShieldCheck className="w-5 h-5 text-indigo-100" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-white font-bold text-lg">Secure & Compliant</h3>
                    <p className="text-indigo-200 mt-1">Enterprise-grade security for your data and patient records.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-indigo-400/30 relative z-10">
              <p className="text-indigo-200 text-sm italic">
                "Implementing Gkava's software was the best decision for our operations this year. Everything is just smoother."
              </p>
              <div className="mt-3 flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                  CEO
                </div>
                <div className="ml-3">
                  <p className="text-white text-sm font-semibold">Alex Thompson</p>
                  <p className="text-indigo-300 text-xs">Tech Forward Inc.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:w-7/12 p-10 md:p-16 flex flex-col justify-center bg-white">
            
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Request Received!</h2>
                <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                  Thank you for your interest in Gkava. One of our product specialists will contact you shortly to schedule your personalized demo.
                </p>
                <Link to="/" className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-md">
                  Return to Homepage
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="mb-10">
                  <h2 className="text-3xl font-extrabold text-gray-900">Book your free demo</h2>
                  <p className="text-gray-500 mt-2 text-lg">Fill out the details below and we'll be in touch instantly.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">First Name</label>
                      <input type="text" id="firstName" required className="mt-2 block w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm" placeholder="John" />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">Last Name</label>
                      <input type="text" id="lastName" required className="mt-2 block w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm" placeholder="Doe" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Work Email</label>
                    <input type="email" id="email" required className="mt-2 block w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm" placeholder="john@yourclinic.com" />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Phone Number</label>
                    <input type="tel" id="phone" required className="mt-2 block w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm" placeholder="+91 98765 43210" />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-gray-700">Company / Organization Name</label>
                    <input type="text" id="company" required className="mt-2 block w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm" placeholder="Acme Corp" />
                  </div>

                  <div>
                    <label htmlFor="product" className="block text-sm font-semibold text-gray-700">Product of Interest</label>
                    <select id="product" required defaultValue="" className="mt-2 block w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm bg-white">
                      <option value="" disabled>Select a product...</option>
                      {config.products.items.map(product => (
                        <option key={product.id} value={product.id}>{product.title}</option>
                      ))}
                      <option value="other">Other / General Inquiry</option>
                    </select>
                  </div>
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white transition-all ${
                        isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/25 hover:-translate-y-0.5'
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Request Demo
                          <Send className="w-5 h-5 ml-2" />
                        </span>
                      )}
                    </button>
                  </div>
                  <p className="text-center text-xs text-gray-500 mt-4">
                    By submitting this form, you agree to our Privacy Policy and Terms of Service.
                  </p>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* FAQ Section */}
      {config.bookDemo.faq && config.bookDemo.faq.length > 0 && (
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {config.bookDemo.faq.map((item, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
