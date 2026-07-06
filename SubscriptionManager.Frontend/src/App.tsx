import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import { ApplicationList } from "./features/applications";
import { Dashboard } from "./features/dashboard";
import { PlansList } from "./features/plans";
import { TenantsList } from "./features/tenants";
import { CouponsList } from "./features/coupons";
import { LoginPage } from "./features/auth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Settings } from "./features/settings";
import { AuthProvider } from "./contexts/AuthContext";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Standalone Route without MarketingLayout */}
      <Route path="/login" element={<LoginPage />} />
      
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
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
