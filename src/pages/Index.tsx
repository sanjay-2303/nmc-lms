import { Card, CardContent } from "@/components/ui/card";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const { session, loading, roles, isAnyRole } = useAuth();

  // Redirect if user is already logged in and roles are determined
  if (!loading && session && roles.length > 0) {
    if (isAnyRole(['admin'])) return <Navigate to="/admin" replace />;
    if (isAnyRole(['instructor'])) return <Navigate to="/instructor" replace />;
    if (isAnyRole(['student'])) return <Navigate to="/student" replace />;
  }
  
  // Show loading or a placeholder while auth state is being determined
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If session exists but roles are not yet loaded, this might flash the login form.
  // The AuthForm itself has a redirect logic too.
  // This page should only show login if not authenticated.

  return (
    <div 
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('https://nmcauditingcollege.com/wp-content/uploads/2019/04/Kiki-PixTeller.png')" }}
    >
      {/* Header */}
      <header className="w-full py-4 px-6 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-lms-blue rounded-full flex items-center justify-center">
              <span className="text-white font-bold">NM</span>
            </div>
            <span className="text-xl font-bold text-lms-darkBlue">
              National Management College
            </span>
          </div>
          {/* Potentially add a Sign Out button here if user is logged in, or manage in layouts */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          {/* Text content section with a semi-transparent background for readability */}
          <div className="text-center md:text-left p-6 bg-white/70 backdrop-blur-sm rounded-lg">
            <h1 className="text-4xl sm:text-5xl font-bold text-lms-darkBlue mb-4">
              Learning Management System
            </h1>
            <h2 className="text-2xl sm:text-3xl font-medium text-lms-blue mb-6">
              For CA & CMA Courses
            </h2>
            <p className="text-gray-700 mb-8 text-lg">
              Access your course materials, watch lectures, and track your progress
              through our comprehensive learning platform designed specifically for
              CA and CMA students.
            </p>
          </div>

          <div>
            <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="mb-6 text-center">
                  <h3 className="text-2xl font-bold text-lms-darkBlue">Log In / Sign Up</h3>
                  <p className="text-gray-500">Access your account or create a new one</p>
                </div>
                <AuthForm /> {/* Use the new AuthForm */}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-lms-darkBlue/90 text-white py-6 px-4 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-medium">National Management College</p>
          <p className="text-sm opacity-80 mt-1">
            Thudupathi, Perundurai, Erode District, Tamil Nadu, India
          </p>
          <p className="text-xs opacity-60 mt-4">
            © {new Date().getFullYear()} National Management College. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
