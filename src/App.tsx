import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ExperienceDetail from "./pages/ExperienceDetail";
import Experiencias from "./pages/Experiencias";

// Host
import HostLayout from "./components/host/HostLayout";
import HostDashboard from "./pages/host/HostDashboard";
import HostNewExperience from "./pages/host/HostNewExperience";
import HostExperiences from "./pages/host/HostExperiences";
import HostProfile from "./pages/host/HostProfile";
import HostExperienceBuilding from "./pages/host/HostExperienceBuilding";
import HostBookings from "./pages/host/HostBookings";
import HostFinancial from "./pages/host/HostFinancial";

// Tourist
import TouristLayout from "./components/tourist/TouristLayout";
import TouristDashboard from "./pages/tourist/TouristDashboard";
import TouristBookings from "./pages/tourist/TouristBookings";
import TouristFavorites from "./pages/tourist/TouristFavorites";
import TouristFinancial from "./pages/tourist/TouristFinancial";

// Admin
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminExperiences from "./pages/admin/AdminExperiences";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminFinancial from "./pages/admin/AdminFinancial";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/entrar" element={<Auth />} />
            <Route path="/experiencias" element={<Experiencias />} />
            <Route path="/experiencia/:id" element={<ExperienceDetail />} />

            {/* Legacy redirect */}
            <Route path="/minhas-reservas" element={<Navigate to="/turista/reservas" replace />} />

            {/* Tourist Panel */}
            <Route
              path="/turista"
              element={
                <ProtectedRoute>
                  <TouristLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<TouristDashboard />} />
              <Route path="reservas" element={<TouristBookings />} />
              <Route path="favoritos" element={<TouristFavorites />} />
              <Route path="financeiro" element={<TouristFinancial />} />
            </Route>

            {/* Host Panel */}
            <Route
              path="/hospedeiro"
              element={
                <ProtectedRoute requiredRole="hospedeiro">
                  <HostLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<HostDashboard />} />
              <Route path="reservas" element={<HostBookings />} />
              <Route path="nova" element={<HostNewExperience />} />
              <Route path="experiencias" element={<HostExperiences />} />
              <Route path="financeiro" element={<HostFinancial />} />
              <Route path="perfil" element={<HostProfile />} />
              <Route path="construcao" element={<HostExperienceBuilding />} />
            </Route>

            {/* Admin Panel */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="experiencias" element={<AdminExperiences />} />
              <Route path="usuarios" element={<AdminUsers />} />
              <Route path="financeiro" element={<AdminFinancial />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
