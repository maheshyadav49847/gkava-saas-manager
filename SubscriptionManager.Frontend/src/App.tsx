import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardLayout from "./layouts/DashboardLayout";
import { ApplicationList } from "./features/applications";
import { Dashboard } from "./features/dashboard";
import { PlansList } from "./features/plans";
import { TenantsList } from "./features/tenants";
import { CouponsList } from "./features/coupons";
import { LoginPage, RegisterPage } from "./features/auth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Settings } from "./features/settings";
import { AuthProvider } from "./contexts/AuthContext";
import { TeamMembersList } from "./features/team-members";
import { AuditLogsList } from "./features/audit-logs/components/AuditLogsList";

export function AppRoutes() {
  return (
    <Routes>
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Standalone Route */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected App Routes */}
      <Route element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/applications" element={<ApplicationList />} />
        <Route path="/plans" element={<PlansList />} />
        <Route path="/tenants" element={<TenantsList />} />
        <Route path="/coupons" element={<CouponsList />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/team-members" element={<TeamMembersList />} />
        <Route path="/audit-logs" element={<AuditLogsList />} />
      </Route>
    </Routes>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
