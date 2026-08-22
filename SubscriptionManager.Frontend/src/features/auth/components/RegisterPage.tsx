import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { User, Mail, Building, Phone, Loader2, AlertCircle, Check, UserPlus } from "lucide-react";
import axios from 'axios';
import { appsettings } from '../../../config/appsettings';

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('planId');
  const appId = searchParams.get('appId');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Create tenant registration logic
      await axios.post(`${appsettings.apiUrl}/auth/register`, {
        name: company || name,
        email,
        phone,
        planId,
        applicationId: appId
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F9FC]  p-4">
        <div className="w-full max-w-md bg-white  rounded-sm shadow-xl border border-[#E3E8EE]  p-8 text-center">
          <div className="w-16 h-16 bg-green-100  rounded-sm flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600 " />
          </div>
          <h2 className="text-2xl font-bold text-[#0A2540]  mb-2">Registration Successful!</h2>
          <p className="text-[#425466] mb-6">Your account has been created. Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F9FC]  p-4">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-500/10 to-transparent  pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-white  rounded-sm shadow-xl border border-[#E3E8EE]  p-8 relative z-10 my-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-sm flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/10 border border-[#E3E8EE] overflow-hidden">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-[#0A2540]  tracking-tight">Create an Account</h1>
          <p className="text-[#425466] mt-2 text-sm">Register to subscribe and manage your SaaS services.</p>
          {planId && <p className="text-[#0A2540] font-medium text-sm mt-2">Selected Plan Ready</p>}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-sm bg-rose-50 border border-rose-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#425466]  mb-1.5">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#F6F9FC]  border border-[#E3E8EE]  rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-[#0A2540] "
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#425466]  mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#F6F9FC]  border border-[#E3E8EE]  rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-[#0A2540] "
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#425466]  mb-1.5">Company Name (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#F6F9FC]  border border-[#E3E8EE]  rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-[#0A2540] "
                placeholder="Acme Corp"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#425466]  mb-1.5">Phone (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#F6F9FC]  border border-[#E3E8EE]  rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-[#0A2540] "
                placeholder="+1 555-0123"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-[#635BFF] hover:bg-[#0A2540] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500/20 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Registering...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2"><UserPlus className="w-4 h-4" /> Create Account</span>
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-sm text-[#425466]">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#0A2540] hover:text-[#425466]">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
