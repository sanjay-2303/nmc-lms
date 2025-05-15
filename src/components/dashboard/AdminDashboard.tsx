
import { useState } from "react";
import PageHeader from "../ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Video, Plus, FileText, Clock } from "lucide-react";

const AdminDashboard = () => {
  // Mock data for the admin dashboard stats
  const [stats] = useState({
    totalCourses: 8,
    totalInstructors: 12,
    totalStudents: 458,
    totalVideos: 186,
  });

  // Mock data for recent activities
  const [recentActivities] = useState([
    { action: "New student registered", user: "Ravi Kumar", time: "5 mins ago" },
    { action: "New video uploaded", user: "Prof. Sanjay", time: "1 hour ago" },
    { action: "Course updated", user: "Admin", time: "3 hours ago" },
    { action: "New instructor added", user: "Admin", time: "Yesterday" },
    { action: "Student enrollment", user: "Priya Singh", time: "Yesterday" },
  ]);

  // Mock data for courses
  const [courses] = useState([
    { title: "CA Foundation", students: 120, completion: 68 },
    { title: "CA Intermediate - Group I", students: 85, completion: 42 },
    { title: "CA Intermediate - Group II", students: 76, completion: 35 },
    { title: "CMA Foundation", students: 90, completion: 58 },
    { title: "CMA Intermediate", students: 87, completion: 45 },
  ]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Platform overview and management"
        action={
          <div className="flex gap-2">
            <Button className="bg-lms-blue hover:bg-lms-darkBlue">
              <Plus className="mr-1 h-4 w-4" /> Add Course
            </Button>
            <Button variant="outline">
              <Plus className="mr-1 h-4 w-4" /> Add User
            </Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-lms-blue" />
              <span>Courses</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-lms-darkBlue">{stats.totalCourses}</div>
            <p className="text-sm text-gray-500">Total courses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-lms-red" />
              <span>Instructors</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-lms-darkBlue">{stats.totalInstructors}</div>
            <p className="text-sm text-gray-500">Active instructors</p>
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
            <div className="text-3xl font-bold text-lms-darkBlue">{stats.totalStudents}</div>
            <p className="text-sm text-gray-500">Enrolled students</p>
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
            <div className="text-3xl font-bold text-lms-darkBlue">{stats.totalVideos}</div>
            <p className="text-sm text-gray-500">Total videos</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-lms-blue" /> Course Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3">Course Name</th>
                      <th className="px-4 py-3 text-center">Students</th>
                      <th className="px-4 py-3 text-center">Avg. Completion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course, i) => (
                      <tr key={i} className="border-b">
                        <td className="px-4 py-3 font-medium">{course.title}</td>
                        <td className="px-4 py-3 text-center">{course.students}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <div className="progress-bar w-24">
                              <div
                                className="progress-fill"
                                style={{ width: `${course.completion}%` }}
                              ></div>
                            </div>
                            <span>{course.completion}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">View All Courses</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-lms-red" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recentActivities.map((activity, i) => (
                  <li key={i} className="border-b pb-3 last:border-0">
                    <p className="font-medium">{activity.action}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{activity.user}</span>
                      <span>{activity.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
              
              <Button variant="outline" className="w-full mt-4">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
