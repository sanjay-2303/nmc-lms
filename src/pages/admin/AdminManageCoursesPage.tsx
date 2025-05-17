
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash } from "lucide-react";
import { useState } from "react";

const AdminManageCoursesPage = () => {
  const [courses, setCourses] = useState([
    { id: "c1", title: "CA Foundation", instructor: "Prof. Ananya Sharma", students: 150, status: "Published" },
    { id: "c2", title: "CMA Intermediate - Group I", instructor: "Dr. Rohan Mehra", students: 95, status: "Draft" },
    { id: "c3", title: "CA Intermediate - Group II", instructor: "Prof. Priya Singh", students: 120, status: "Published" },
  ]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Manage Courses"
        subtitle="Oversee and manage all courses on the platform"
        action={
          <Button className="bg-lms-blue hover:bg-lms-darkBlue">
            <Plus className="mr-2 h-4 w-4" /> Add New Course
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Title</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead className="text-center">Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell className="text-center">{course.students}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${course.status === "Published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {course.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="hover:text-lms-blue">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-lms-red">
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

export default AdminManageCoursesPage;
