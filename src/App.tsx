import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";
import ExperienceDetail from "./pages/ExperienceDetail.tsx";
import HostLayout from "./components/host/HostLayout.tsx";
import HostDashboard from "./pages/host/HostDashboard.tsx";
import HostNewExperience from "./pages/host/HostNewExperience.tsx";
import HostExperiences from "./pages/host/HostExperiences.tsx";
import HostProfile from "./pages/host/HostProfile.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/entrar" element={<Auth />} />
          <Route path="/experiencia/:id" element={<ExperienceDetail />} />

          {/* Host Panel */}
          <Route path="/hospedeiro" element={<HostLayout />}>
            <Route index element={<HostDashboard />} />
            <Route path="nova" element={<HostNewExperience />} />
            <Route path="experiencias" element={<HostExperiences />} />
            <Route path="perfil" element={<HostProfile />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
