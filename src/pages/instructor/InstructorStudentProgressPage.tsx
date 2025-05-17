
import PageHeader from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StudentProgress {
  id: string;
  name: string;
  email: string;
  course: string;
  progress: number; // Percentage
  lastActivity: string;
}

const InstructorStudentProgressPage = () => {
  const [progressData, setProgressData] = useState<StudentProgress[]>([
    { id: "s1", name: "Aarav Patel", email: "aarav.p@example.com", course: "CA Foundation Batch 2025", progress: 75, lastActivity: "2 hours ago" },
    { id: "s2", name: "Diya Sharma", email: "diya.s@example.com", course: "CA Foundation Batch 2025", progress: 40, lastActivity: "1 day ago" },
    { id: "s3", name: "Kabir Verma", email: "kabir.v@example.com", course: "CMA Inter Group I Crash Course", progress: 90, lastActivity: "30 mins ago" },
  ]);
  
  const [selectedCourse, setSelectedCourse] = useState<string>("all");

  const filteredProgressData = selectedCourse === "all" 
    ? progressData 
    : progressData.filter(p => p.course.toLowerCase().includes(selectedCourse.toLowerCase()));


  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Student Progress"
        subtitle="Monitor your students' learning journey and completion rates"
      />
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Progress Overview</CardTitle>
            <div className="w-64">
               <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by course..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="CA Foundation">CA Foundation Batch 2025</SelectItem>
                  <SelectItem value="CMA Inter">CMA Inter Group I Crash Course</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead className="text-center">Progress</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProgressData.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-lms-blue rounded-full" 
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span>{student.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.lastActivity}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="hover:text-lms-blue">
                      <Eye className="h-4 w-4" /> {/* View Detailed Progress */}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
               {filteredProgressData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                    No students found for the selected course.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorStudentProgressPage;
