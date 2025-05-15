
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentLayout from "./pages/student/StudentLayout";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import InstructorLayout from "./pages/instructor/InstructorLayout";
import InstructorDashboard from "./components/dashboard/InstructorDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./components/dashboard/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          
          {/* Student routes */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<div>Student Courses</div>} />
            <Route path="lessons" element={<div>Student Lessons</div>} />
            <Route path="resources" element={<div>Student Resources</div>} />
          </Route>
          
          {/* Instructor routes */}
          <Route path="/instructor" element={<InstructorLayout />}>
            <Route index element={<InstructorDashboard />} />
            <Route path="courses" element={<div>Instructor Courses</div>} />
            <Route path="upload" element={<div>Upload Content</div>} />
            <Route path="progress" element={<div>Student Progress</div>} />
          </Route>
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="courses" element={<div>Admin Courses</div>} />
            <Route path="instructors" element={<div>Manage Instructors</div>} />
            <Route path="students" element={<div>Manage Students</div>} />
            <Route path="reports" element={<div>Reports & Analytics</div>} />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
