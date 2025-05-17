
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash, Users, FileVideo } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const InstructorCoursesPage = () => {
  const [courses, setCourses] = useState([
    { id: "c1", title: "CA Foundation Batch 2025", students: 150, lessons: 45, status: "Published" },
    { id: "c2", title: "CMA Inter Group I Crash Course", students: 95, lessons: 30, status: "Draft" },
  ]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="My Courses"
        subtitle="Manage your courses, add content, and track student engagement"
        action={
          <Link to="/instructor/upload"> {/* Or a modal to create new course */}
            <Button className="bg-lms-blue hover:bg-lms-darkBlue">
              <Plus className="mr-2 h-4 w-4" /> Create New Course
            </Button>
          </Link>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Course List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Title</TableHead>
                <TableHead className="text-center"><Users className="inline h-4 w-4 mr-1"/>Students</TableHead>
                <TableHead className="text-center"><FileVideo className="inline h-4 w-4 mr-1"/>Lessons</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell className="text-center">{course.students}</TableCell>
                  <TableCell className="text-center">{course.lessons}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${course.status === "Published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {course.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="hover:text-lms-blue" title="Edit Course">
                      <Edit className="h-4 w-4" />
                    </Button>
                     <Link to={`/instructor/upload?courseId=${course.id}`}>
                        <Button variant="ghost" size="icon" className="hover:text-lms-blue" title="Add Content">
                          <Plus className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="hover:text-lms-red" title="Delete Course">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorCoursesPage;
