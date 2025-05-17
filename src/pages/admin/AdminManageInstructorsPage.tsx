
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash, Eye } from "lucide-react";
import { useState } from "react";

const AdminManageInstructorsPage = () => {
  const [instructors, setInstructors] = useState([
    { id: "i1", name: "Prof. Ananya Sharma", email: "ananya.s@example.com", courses: 3, joined: "2023-01-15" },
    { id: "i2", name: "Dr. Rohan Mehra", email: "rohan.m@example.com", courses: 2, joined: "2022-11-20" },
    { id: "i3", name: "Prof. Priya Singh", email: "priya.s@example.com", courses: 4, joined: "2023-03-01" },
  ]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Manage Instructors"
        subtitle="Add, edit, or remove instructor profiles"
        action={
          <Button className="bg-lms-blue hover:bg-lms-darkBlue">
            <Plus className="mr-2 h-4 w-4" /> Add New Instructor
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>All Instructors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Courses Taught</TableHead>
                <TableHead>Date Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instructors.map((instructor) => (
                <TableRow key={instructor.id}>
                  <TableCell className="font-medium">{instructor.name}</TableCell>
                  <TableCell>{instructor.email}</TableCell>
                  <TableCell className="text-center">{instructor.courses}</TableCell>
                  <TableCell>{instructor.joined}</TableCell>
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

export default AdminManageInstructorsPage;
