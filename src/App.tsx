import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SleepPage from "./pages/SleepPage";
import BottlesPage from "./pages/BottlesPage";
import DiapersPage from "./pages/DiapersPage";
import NursingPage from "./pages/NursingPage";
import PumpingPage from "./pages/PumpingPage";
import DoctorPage from "./pages/DoctorPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/sleep" replace />} />
          <Route path="/sleep" element={<SleepPage />} />
          <Route path="/bottles" element={<BottlesPage />} />
          <Route path="/diapers" element={<DiapersPage />} />
          <Route path="/nursing" element={<NursingPage />} />
          <Route path="/pumping" element={<PumpingPage />} />
          <Route path="/doctor" element={<DoctorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;