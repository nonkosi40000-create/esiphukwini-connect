import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ChatWidget } from "@/components/ChatWidget";
import Index from "./pages/Index";
import About from "./pages/About";
import Academics from "./pages/Academics";
import Register from "./pages/Register";
import PastPapers from "./pages/PastPapers";
import ParentPortal from "./pages/ParentPortal";
import Auth from "./pages/Auth";
import Pending from "./pages/Pending";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApplications from "./pages/admin/AdminApplications";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import PrincipalDashboard from "./pages/principal/PrincipalDashboard";
import GradeHeadDashboard from "./pages/grade-head/GradeHeadDashboard";
import SGBDashboard from "./pages/sgb/SGBDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import Gallery from "./pages/Gallery";

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
            <Route path="/about" element={<About />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/register" element={<Register />} />
            <Route path="/past-papers" element={<PastPapers />} />
            <Route path="/parent-portal" element={<ParentPortal />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/pending" element={<Pending />} />
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            {/* Teacher Routes */}
            <Route path="/teacher" element={<TeacherDashboard />} />
            {/* Principal Routes */}
            <Route path="/principal" element={<PrincipalDashboard />} />
            {/* Grade Head Routes */}
            <Route path="/grade-head" element={<GradeHeadDashboard />} />
            {/* SGB Routes */}
            <Route path="/sgb" element={<SGBDashboard />} />
            {/* Student Routes */}
            <Route path="/student" element={<StudentDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatWidget />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
