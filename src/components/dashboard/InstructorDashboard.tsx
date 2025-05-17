import { useState } from "react";
import PageHeader from "../ui/PageHeader";
import CourseCard from "../course/CourseCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Video, Plus, UploadCloud } from "lucide-react";
import { toast } from "sonner";

const InstructorDashboard = () => {
  // Mock data for the instructor dashboard
  const [courses] = useState([
    {
      id: "ca-foundation-2025",
      title: "CA Foundation Batch 2025",
      type: "CA",
      totalModules: 4,
      totalLessons: 45, // Updated to be more representative
      path: "/instructor/courses", // Updated path to general courses page
    },
    {
      id: "cma-inter-crash",
      title: "CMA Inter Group I Crash Course",
      type: "CMA",
      totalModules: 3,
      totalLessons: 30, // Updated to be more representative
      path: "/instructor/courses", // Updated path to general courses page
    },
  ]);

  const [recentUploads] = useState([
    { title: "Accounting Basics", course: "CA Foundation", date: "Today" },
    { title: "Business Economics", course: "CA Foundation", date: "Yesterday" },
  ]);

  const handleUploadVideoClick = () => {
    // Placeholder for navigation or modal for video upload
    // This will navigate to the /instructor/upload page for now
    // In a real app, this might open a modal or a dedicated upload UI component.
    // For now, let's assume there's an upload page route as defined in App.tsx
    window.location.href = "/instructor/upload"; 
    toast.info("Video upload functionality requires backend setup for file storage.");
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Instructor Dashboard"
        subtitle="Manage your courses and student progress"
        action={
          <Button 
            className="bg-lms-blue hover:bg-lms-darkBlue"
            onClick={handleUploadVideoClick}
          >
            <UploadCloud className="mr-1 h-4 w-4" /> Upload New Video
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-lms-blue" />
              <span>My Courses</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-lms-darkBlue">{courses.length}</div>
            <p className="text-sm text-gray-500">Active courses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Video className="h-5 w-5 text-lms-red" />
              <span>Content</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-lms-darkBlue">42</div>
            <p className="text-sm text-gray-500">Total videos uploaded</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-lms-blue" />
              <span>Students</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-lms-darkBlue">156</div>
            <p className="text-sm text-gray-500">Enrolled students</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-lms-darkBlue mb-4">My Courses</h2>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You have not created any courses yet.</p>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recentUploads.map((upload, i) => (
                  <li key={i} className="border-b pb-3 last:border-0">
                    <p className="font-medium">{upload.title}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{upload.course}</span>
                      <span className="text-gray-500">{upload.date}</span>
                    </div>
                  </li>
                ))}
              </ul>
              
              <Button variant="outline" className="w-full mt-4" onClick={() => toast.info("This would show all uploads.")}>
                View All Uploads
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
