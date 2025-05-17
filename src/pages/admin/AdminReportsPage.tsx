
import PageHeader from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, Users, BookOpen } from "lucide-react";

const AdminReportsPage = () => {
  // Mock data for charts - in a real app, this would come from an API
  const courseCompletionData = [
    { name: 'CA Foundation', completion: 75 },
    { name: 'CMA Inter', completion: 60 },
    { name: 'CA Inter G1', completion: 45 },
  ];

  const studentEnrollmentData = [
    { name: 'CA Courses', value: 250 },
    { name: 'CMA Courses', value: 180 },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Gain insights into platform usage and student performance"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-lms-blue" />
              Course Completion Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Average completion percentage for top courses.</p>
            {/* Placeholder for Bar Chart */}
            <div className="h-64 bg-gray-100 flex items-center justify-center rounded">
              <p className="text-gray-400">Bar Chart Placeholder</p>
            </div>
            <ul className="mt-4 space-y-2">
              {courseCompletionData.map(course => (
                <li key={course.name} className="flex justify-between">
                  <span>{course.name}</span>
                  <span className="font-semibold">{course.completion}%</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-lms-red" />
              Student Enrollment by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Distribution of students across CA and CMA courses.</p>
            {/* Placeholder for Pie Chart */}
            <div className="h-64 bg-gray-100 flex items-center justify-center rounded">
              <p className="text-gray-400">Pie Chart Placeholder</p>
            </div>
            <ul className="mt-4 space-y-2">
              {studentEnrollmentData.map(data => (
                <li key={data.name} className="flex justify-between">
                  <span>{data.name}</span>
                  <span className="font-semibold">{data.value} students</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-lms-blue" />
              User Activity Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-gray-600">Key metrics on user engagement.</p>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                <div>
                    <p className="text-sm text-gray-500">Active Students</p>
                    <p className="text-2xl font-bold text-lms-darkBlue">350</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Active Instructors</p>
                    <p className="text-2xl font-bold text-lms-darkBlue">10</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">New Signups (Last 30d)</p>
                    <p className="text-2xl font-bold text-lms-darkBlue">45</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Videos Watched (Last 7d)</p>
                    <p className="text-2xl font-bold text-lms-darkBlue">1,200</p>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReportsPage;
