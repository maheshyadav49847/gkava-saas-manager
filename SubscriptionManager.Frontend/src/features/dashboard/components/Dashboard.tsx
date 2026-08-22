import { useQuery } from "@tanstack/react-query";
import { Activity, Users, CreditCard, ArrowUpRight, Clock, Box, AlertCircle } from "lucide-react";
import { getDashboardStats } from "../api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#4f46e5', '#0ea5e9', '#8b5cf6'];

const StatCard = ({ title, value, icon: Icon, trend, isLoading }: any) => (
  <div className="bg-white p-6 rounded-sm border border-[#EAEAEA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 bg-[#F6F9FC] border border-[#E3E8EE] rounded">
        <Icon className="w-5 h-5 text-[#425466]" />
      </div>
      {trend && !isLoading && (
        <span className="flex items-center text-[12px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
          <ArrowUpRight className="w-3 h-3 mr-0.5" /> {trend}
        </span>
      )}
    </div>
    
    {isLoading ? (
      <div className="space-y-2">
        <div className="h-8 w-2/3 bg-slate-100 rounded animate-pulse"></div>
        <div className="h-4 w-1/3 bg-[#F6F9FC] rounded animate-pulse"></div>
      </div>
    ) : (
      <div>
        <h4 className="text-[13px] font-medium text-[#425466] mb-1">{title}</h4>
        <div className="text-3xl font-semibold tracking-tight text-[#0A2540]">{value}</div>
      </div>
    )}
  </div>
);

export function Dashboard() {
  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
    refetchInterval: 60000,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-rose-200 rounded-sm bg-rose-50">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h3 className="text-lg font-semibold text-rose-900">Failed to load dashboard</h3>
        <p className="text-rose-600 mt-1 max-w-sm">{(error as any)?.message || 'An unexpected error occurred while fetching your data.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white rounded shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E3E8EE] text-[#635BFF] shrink-0">
          <Activity className="w-6 h-6" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0A2540]">Overview</h1>
          <p className="text-[14px] text-[#425466] mt-1">Track your business metrics and recent activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Monthly Recurring Revenue" 
          value={isLoading ? null : formatCurrency(stats?.totalRevenue || 0)} 
          icon={CreditCard} 
          trend="12.5%" 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Active Subscriptions" 
          value={isLoading ? null : stats?.activeSubscriptionsCount.toLocaleString()} 
          icon={Activity} 
          trend="8.2%" 
          isLoading={isLoading} 
        />
        <StatCard 
          title="New Tenants (30d)" 
          value={isLoading ? null : stats?.newTenantsCount.toLocaleString()} 
          icon={Users} 
          trend="4.1%" 
          isLoading={isLoading} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MRR Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-sm border border-[#EAEAEA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[15px] font-semibold tracking-tight text-[#0A2540]">MRR Growth (12 Months)</h3>
            <span className="text-[12px] font-medium px-2.5 py-1 bg-[#F6F9FC] text-[#425466] rounded border border-[#E3E8EE]">Trailing</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.mrrHistory || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} tickFormatter={(val) => `₹${val / 1000}k`} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #EAEAEA', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  formatter={(value: any) => [formatCurrency(Number(value) || 0), 'MRR']}
                  labelStyle={{ color: '#64748B', fontWeight: 500, marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="mrr" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMrr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-sm border border-[#EAEAEA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col">
          <h3 className="text-[15px] font-semibold tracking-tight text-[#0A2540] mb-2">Subscription Distribution</h3>
          <p className="text-[13px] text-[#425466] mb-6">Breakdown of active users by plan</p>
          <div className="flex-1 min-h-[220px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.subscriptionDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {(stats?.subscriptionDistribution || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #EAEAEA', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  itemStyle={{ fontWeight: 600, color: '#0F172A' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '13px', color: '#64748B', paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-sm border border-[#EAEAEA] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <h3 className="text-[15px] font-semibold tracking-tight text-[#0A2540] mb-6">Recent Activity</h3>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0 animate-pulse">
                <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-slate-100 rounded"></div>
                  <div className="h-3 w-1/4 bg-[#F6F9FC] rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (!stats?.recentActivities || stats.recentActivities.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-[#E3E8EE] rounded bg-[#F6F9FC]">
            <Box className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-[14px] text-[#425466] font-medium">No recent activity found.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {stats?.recentActivities?.map(activity => (
              <div key={activity.id} className="flex items-start gap-4 p-3 -mx-3 rounded hover:bg-[#F6F9FC] transition-colors">
                <div className="w-10 h-10 bg-[#F6F9FC] text-[#0A2540] rounded-full flex items-center justify-center shrink-0 border border-[#E3E8EE]/50">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[14px] font-medium text-[#425466] truncate">
                    {activity.description}
                  </p>
                  <div className="flex items-center text-[12px] text-slate-400 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {timeAgo(activity.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
