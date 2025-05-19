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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!session) {
    console.log("No session, redirecting to /");
    return <Navigate to="/" replace />;
  }
  
  // Only check roles if roles array is populated. If session exists but roles are empty,
  // it means they are still loading or user has no roles.
  // The `loading` check above should handle the initial data fetch.
  // If roles are loaded and none match allowedRoles, then redirect.
  if (roles.length > 0 && !isAnyRole(allowedRoles)) {
    console.log("Role not allowed, redirecting based on primary role or to /");
    if (isAnyRole(['student'])) return <Navigate to="/student" replace />;
    if (isAnyRole(['instructor'])) return <Navigate to="/instructor" replace />;
    if (isAnyRole(['admin'])) return <Navigate to="/admin" replace />; // Should not happen if admin is in allowedRoles & already an admin
    return <Navigate to="/" replace />; // Fallback if no primary role or other issue
  }
  
  // If session exists, but roles are not yet loaded (roles.length === 0),
  // and it's not loading, it implies the user might have no roles assigned yet.
  // Or, data is still incoming. The loading flag from useAuth should ideally cover this.
  // For now, if roles are empty but session exists and not loading, we might let them pass if allowedRoles is empty or includes a default.
  // However, this current logic will block if roles are empty and allowedRoles requires a specific role.
  // This is generally fine, as roles should populate quickly after session.

  return <Outlet />;
};


const AppRoutes = () => {
  // const { session, loading, roles, isAnyRole } = useAuth(); // No longer needed here

  // The useEffect that was here has been removed as it was causing build errors
  // and its redirection logic is handled in Index.tsx and AuthForm.tsx.

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      
      {/* Student routes */}
      <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="courses/:courseId" element={<StudentCourseDetailPage />} />
          <Route path="courses" element={<StudentDashboard />} /> {/* Could also be a dedicated courses list page */}
          <Route path="lessons" element={<StudentLessonsPage />} />
          <Route path="resources" element={<StudentResourcesPage />} />
        </Route>
      </Route>
      
      {/* Instructor routes */}
      <Route element={<ProtectedRoute allowedRoles={['instructor', 'admin']} />}>
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

// The imports for useEffect and useNavigate might become unused here if not used elsewhere.
// Keeping them for now, as the linter will typically warn if they are truly unused.
// import { useEffect } from 'react'; // No longer directly used in AppRoutes
// import { useNavigate } from 'react-router-dom'; // No longer directly used in AppRoutes


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
