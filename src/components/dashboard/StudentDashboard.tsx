
import { useState } from "react";
import PageHeader from "../ui/PageHeader";
import CourseCard from "../course/CourseCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar } from "lucide-react";

const StudentDashboard = () => {
  // Mock data for the student dashboard
  const [courses] = useState([
    {
      id: "ca-foundation",
      title: "CA Foundation",
      type: "CA",
      totalModules: 4,
      totalLessons: 24,
      progress: 65,
      path: "/student/courses/ca-foundation",
    },
    {
      id: "cma-foundation",
      title: "CMA Foundation",
      type: "CMA",
      totalModules: 3,
      totalLessons: 18,
      progress: 30,
      path: "/student/courses/cma-foundation",
    },
    {
      id: "ca-inter-group1",
      title: "CA Intermediate - Group I",
      type: "CA",
      totalModules: 5,
      totalLessons: 32,
      progress: 10,
      path: "/student/courses/ca-inter-group1",
    },
  ]);

  const [recentLessons] = useState([
    { title: "Accounting Standards Overview", course: "CA Foundation", date: "Today" },
    { title: "Business Mathematics & Statistics", course: "CA Foundation", date: "Yesterday" },
    { title: "Business Economics", course: "CA Foundation", date: "2 days ago" },
  ]);

  const [upcomingClasses] = useState([
    { title: "Live Session: Accounting Standards", date: "Tomorrow, 10:00 AM" },
    { title: "Live Session: Income Tax Basics", date: "Jun 20, 2:00 PM" },
  ]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Student Dashboard"
        subtitle="Welcome back! Continue your learning journey."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-lms-blue" />
              <span>My Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-lms-darkBlue">3/8</div>
            <p className="text-sm text-gray-500">Courses in progress</p>
            
            <div className="mt-4">
              <div className="text-sm font-medium flex justify-between mb-1">
                <span>Overall completion</span>
                <span>35%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "35%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-lms-red" />
              <span>Upcoming Classes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingClasses.length > 0 ? (
              <ul className="space-y-3">
                {upcomingClasses.map((item, i) => (
                  <li key={i} className="border-b pb-2 last:border-0">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No upcoming classes</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-lms-blue" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recentLessons.map((lesson, i) => (
                <li key={i} className="border-b pb-2 last:border-0">
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-xs text-gray-500">
                    {lesson.course} • {lesson.date}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-bold text-lms-darkBlue mb-4">My Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
