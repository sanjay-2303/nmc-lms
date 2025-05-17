
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

// Import new page components
import AdminManageCoursesPage from "./pages/admin/AdminManageCoursesPage";
import AdminManageInstructorsPage from "./pages/admin/AdminManageInstructorsPage";
import AdminManageStudentsPage from "./pages/admin/AdminManageStudentsPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";

import StudentCourseDetailPage from "./pages/student/StudentCourseDetailPage";
import StudentLessonsPage from "./pages/student/StudentLessonsPage";
import StudentResourcesPage from "./pages/student/StudentResourcesPage";

import InstructorCoursesPage from "./pages/instructor/InstructorCoursesPage";
import InstructorUploadPage from "./pages/instructor/InstructorUploadPage";
import InstructorStudentProgressPage from "./pages/instructor/InstructorStudentProgressPage";


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
            <Route path="courses/:courseId" element={<StudentCourseDetailPage />} /> {/* For individual course view */}
            <Route path="courses" element={<StudentDashboard />} /> {/* Fallback or general courses overview if needed, currently dashboard shows courses */}
            <Route path="lessons" element={<StudentLessonsPage />} />
            <Route path="resources" element={<StudentResourcesPage />} />
          </Route>
          
          {/* Instructor routes */}
          <Route path="/instructor" element={<InstructorLayout />}>
            <Route index element={<InstructorDashboard />} />
            <Route path="courses" element={<InstructorCoursesPage />} />
            <Route path="upload" element={<InstructorUploadPage />} />
            <Route path="progress" element={<InstructorStudentProgressPage />} />
          </Route>
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="courses" element={<AdminManageCoursesPage />} />
            <Route path="instructors" element={<AdminManageInstructorsPage />} />
            <Route path="students" element={<AdminManageStudentsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
