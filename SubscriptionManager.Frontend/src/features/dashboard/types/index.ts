export interface RecentActivity {
  id: string;
  activityType: string;
  description: string;
  timestamp: string;
}

export interface DashboardStats {
  totalRevenue: number;
  activeSubscriptionsCount: number;
  newTenantsCount: number;
  recentActivities: RecentActivity[];
}
