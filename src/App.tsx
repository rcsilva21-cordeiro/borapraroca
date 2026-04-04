import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";
import ExperienceDetail from "./pages/ExperienceDetail.tsx";
import MinhasReservas from "./pages/MinhasReservas.tsx";
import HostLayout from "./components/host/HostLayout.tsx";
import HostDashboard from "./pages/host/HostDashboard.tsx";
import HostNewExperience from "./pages/host/HostNewExperience.tsx";
import HostExperiences from "./pages/host/HostExperiences.tsx";
import HostProfile from "./pages/host/HostProfile.tsx";
import HostExperienceBuilding from "./pages/host/HostExperienceBuilding.tsx";
import HostBookings from "./pages/host/HostBookings.tsx";

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
            <Route path="/experiencia/:id" element={<ExperienceDetail />} />
            <Route
              path="/minhas-reservas"
              element={
                <ProtectedRoute>
                  <MinhasReservas />
                </ProtectedRoute>
              }
            />

            {/* Host Panel — requires hospedeiro role */}
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
              <Route path="perfil" element={<HostProfile />} />
              <Route path="construcao" element={<HostExperienceBuilding />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
