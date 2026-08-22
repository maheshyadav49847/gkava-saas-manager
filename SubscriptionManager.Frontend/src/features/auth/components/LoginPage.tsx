import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { loginApi } from '../api';
import { Lock, Mail, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginApi({ email, password });
      login(response);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F9FC]  p-4">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-500/10 to-transparent  pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-white  rounded shadow-xl shadow-indigo-100/20  border border-[#E3E8EE]  p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-sm flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/10 border border-[#E3E8EE] overflow-hidden">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-[#0A2540]  tracking-tight">Welcome Back</h1>
          <p className="text-[#425466] mt-2 text-sm">Sign in to gkava-saas-manager</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded bg-rose-50 border border-rose-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full pl-11 pr-4 py-2.5 bg-[#F6F9FC]  border border-[#E3E8EE]  rounded focus:outline-none focus:ring-0 focus:border-[#E3E8EE] text-[#0A2540]  transition-all"
                placeholder="admin@gkava.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#425466]  mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#F6F9FC]  border border-[#E3E8EE]  rounded focus:outline-none focus:ring-0 focus:border-[#E3E8EE] text-[#0A2540]  transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-[#635BFF] hover:bg-[#0A2540] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">Sign in to Dashboard <ArrowRight className="w-4 h-4" /></span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
