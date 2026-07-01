import { useState, useEffect } from "react";
import { Activity, Users, CreditCard, ArrowUpRight, Clock, Box } from "lucide-react";
import { getDashboardStats } from "../api";
import { DashboardStats } from "../types";

const StatCard = ({ title, value, icon: Icon, trend, isLoading }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
        <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
      </div>
      {trend && !isLoading && (
        <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">
          <ArrowUpRight className="w-3 h-3 mr-1" /> {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
    {isLoading ? (
      <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mt-1"></div>
    ) : (
      <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
    )}
  </div>
);

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(data => {
        setStats(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard stats", err);
        setIsLoading(false);
      });
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mins ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening across all your SaaS apps today.</p>
        </div>
        <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg font-medium shadow-sm hover:opacity-90 transition-opacity">
          Download Report
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Active Subscriptions" 
          value={stats?.activeSubscriptionsCount ?? 0} 
          icon={Activity} 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Total Revenue (MRR)" 
          value={formatCurrency(stats?.totalRevenue ?? 0)} 
          icon={CreditCard} 
          isLoading={isLoading} 
        />
        <StatCard 
          title="New Tenants (30d)" 
          value={stats?.newTenantsCount ?? 0} 
          icon={Users} 
          isLoading={isLoading} 
        />
      </div>

      <div className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Recent Activity</h3>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 p-4 border border-slate-100 dark:border-slate-800/50 rounded-xl animate-pulse">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : stats?.recentActivities?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/50">
            <Box className="w-10 h-10 text-slate-400 mb-3" />
            <p className="text-slate-500">No recent activity found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats?.recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start gap-4 p-4 border border-slate-100 dark:border-slate-800/50 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {activity.description}
                  </p>
                  <div className="flex items-center text-xs text-slate-500 mt-1">
                    <Clock className="w-3.5 h-3.5 mr-1" />
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
};
