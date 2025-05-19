import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import { AuthProvider, useAuth, AppRole } from "./contexts/AuthContext";

import StudentLayout from "./pages/student/StudentLayout";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import StudentCourseDetailPage from "./pages/student/StudentCourseDetailPage";
import StudentLessonsPage from "./pages/student/StudentLessonsPage";
import StudentResourcesPage from "./pages/student/StudentResourcesPage";

import InstructorLayout from "./pages/instructor/InstructorLayout";
import InstructorDashboard from "./components/dashboard/InstructorDashboard";
import InstructorCoursesPage from "./pages/instructor/InstructorCoursesPage";
import InstructorUploadPage from "./pages/instructor/InstructorUploadPage";
import InstructorStudentProgressPage from "./pages/instructor/InstructorStudentProgressPage";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import AdminManageCoursesPage from "./pages/admin/AdminManageCoursesPage";
import AdminManageInstructorsPage from "./pages/admin/AdminManageInstructorsPage";
import AdminManageStudentsPage from "./pages/admin/AdminManageStudentsPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  allowedRoles: AppRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { session, loading, isAnyRole, roles } = useAuth();
  
  console.log("ProtectedRoute Check: loading:", loading, "session:", !!session, "roles:", roles, "allowed:", allowedRoles);

  if (loading) {
    // You can return a loading spinner here if you want
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!session) {
    console.log("No session, redirecting to /");
    return <Navigate to="/" replace />;
  }

  if (roles.length > 0 && !isAnyRole(allowedRoles)) {
    console.log("Role not allowed, redirecting to /unauthorized or / based on primary role");
    // Redirect to a generic unauthorized page or based on primary role to their dashboard
    if (isAnyRole(['student'])) return <Navigate to="/student" replace />;
    if (isAnyRole(['instructor'])) return <Navigate to="/instructor" replace />;
    if (isAnyRole(['admin'])) return <Navigate to="/admin" replace />; // Should not happen if admin is in allowedRoles
    return <Navigate to="/" replace />; // Fallback if no primary role matches
  }
  
  // If roles are not yet loaded but session exists, it might still show Outlet briefly.
  // This can be improved by ensuring roles are loaded before rendering Outlet or showing loader.
  // For now, the check `roles.length > 0` handles cases where roles are fetched.
  // If `isAnyRole` is true, it means roles are loaded and match.
  // If `roles.length === 0` and `session` exists, it means roles are still being fetched or user has no roles.
  // The initial `loading` state from `useAuth` should cover the very first load.

  return <Outlet />;
};


const AppRoutes = () => {
  const { session, loading, roles, isAnyRole } = useAuth();

  // This effect redirects logged-in users from the Index page
  useEffect(() => {
    if (!loading && session && window.location.pathname === '/') {
      if (isAnyRole(['admin'])) {
        navigate('/admin');
      } else if (isAnyRole(['instructor'])) {
        navigate('/instructor');
      } else if (isAnyRole(['student'])) {
        navigate('/student');
      }
    }
  }, [session, loading, roles, isAnyRole, navigate]); // Added navigate and isAnyRole
  // It seems navigate is not defined here. Let's remove this useEffect from App.tsx.
  // The redirection logic is better handled in the Index page itself or within AuthForm after login.
  // AuthForm already has a redirect useEffect.

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      
      {/* Student routes */}
      <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}> {/* Admin can also access student routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="courses/:courseId" element={<StudentCourseDetailPage />} />
          <Route path="courses" element={<StudentDashboard />} />
          <Route path="lessons" element={<StudentLessonsPage />} />
          <Route path="resources" element={<StudentResourcesPage />} />
        </Route>
      </Route>
      
      {/* Instructor routes */}
      <Route element={<ProtectedRoute allowedRoles={['instructor', 'admin']} />}> {/* Admin can also access instructor routes */}
        <Route path="/instructor" element={<InstructorLayout />}>
          <Route index element={<InstructorDashboard />} />
          <Route path="courses" element={<InstructorCoursesPage />} />
          <Route path="upload" element={<InstructorUploadPage />} />
          <Route path="progress" element={<InstructorStudentProgressPage />} />
        </Route>
      </Route>
      
      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<AdminManageCoursesPage />} />
          <Route path="instructors" element={<AdminManageInstructorsPage />} />
          <Route path="students" element={<AdminManageStudentsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
        </Route>
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Need to import navigate for the useEffect if we keep it.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
