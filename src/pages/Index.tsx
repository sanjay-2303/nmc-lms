
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
// Removed BookOpen, Video, FileText as they are no longer used here

const Index = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="w-full py-4 px-6 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-lms-blue rounded-full flex items-center justify-center">
              <span className="text-white font-bold">NM</span>
            </div>
            <span className="text-xl font-bold text-lms-darkBlue">
              National Management College
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-lms-darkBlue mb-4">
              Learning Management System
            </h1>
            <h2 className="text-2xl sm:text-3xl font-medium text-lms-blue mb-6">
              For CA & CMA Courses
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Access your course materials, watch lectures, and track your progress
              through our comprehensive learning platform designed specifically for
              CA and CMA students.
            </p>
            {/* Removed feature section, adding illustration placeholder */}
            <div className="hidden md:flex justify-center items-center mt-8">
              <img 
                src="/lovable-uploads/photo-1488590528505-98d2b5aba04b.jpeg" 
                alt="LMS Illustration" 
                className="rounded-lg shadow-md max-w-md w-full h-auto object-cover"
              />
            </div>
          </div>

          <div>
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="mb-6 text-center">
                  <h3 className="text-2xl font-bold text-lms-darkBlue">Log In</h3>
                  <p className="text-gray-500">Access your account</p>
                </div>
                <LoginForm onRoleSelect={setUserRole} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-lms-darkBlue text-white py-6 px-4">
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

// No icons are imported from lucide-react directly in this file anymore.
