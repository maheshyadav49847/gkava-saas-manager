import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import { MarketingLayout } from "./layouts/MarketingLayout";
import { ApplicationList } from "./features/applications";
import { Dashboard } from "./features/dashboard";
import { PlansList } from "./features/plans";
import { TenantsList } from "./features/tenants";
import { CouponsList } from "./features/coupons";
import { LoginPage } from "./features/auth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Settings } from "./features/settings";
import { LandingPage, PrivacyPolicy, Terms, BookDemo, AboutPage, ProductsPage, GenericProductPage, WebsiteBuilder, CheckoutPage } from "./features/landing";
import { AuthProvider } from "./contexts/AuthContext";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Marketing Routes */}
      <Route element={<MarketingLayout><Outlet /></MarketingLayout>}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<GenericProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/book-demo" element={<BookDemo />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      {/* Standalone Route without MarketingLayout */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected App Routes */}
      <Route element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/website-builder" element={<WebsiteBuilder />} />
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
