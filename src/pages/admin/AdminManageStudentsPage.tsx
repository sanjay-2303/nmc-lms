
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash, Eye } from "lucide-react";
import { useState } from "react";

const AdminManageStudentsPage = () => {
  const [students, setStudents] = useState([
    { id: "s1", name: "Aarav Patel", email: "aarav.p@example.com", enrolledCourses: 2, joined: "2023-06-10" },
    { id: "s2", name: "Diya Sharma", email: "diya.s@example.com", enrolledCourses: 1, joined: "2023-07-01" },
    { id: "s3", name: "Kabir Verma", email: "kabir.v@example.com", enrolledCourses: 3, joined: "2023-05-20" },
  ]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Manage Students"
        subtitle="View and manage student accounts and enrollments"
        action={
          <Button className="bg-lms-blue hover:bg-lms-darkBlue">
            <Plus className="mr-2 h-4 w-4" /> Add New Student
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Enrolled Courses</TableHead>
                <TableHead>Date Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell className="text-center">{student.enrolledCourses}</TableCell>
                  <TableCell>{student.joined}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="hover:text-lms-blue">
                      <Eye className="h-4 w-4" />
                    </Button>
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

export default AdminManageStudentsPage;
