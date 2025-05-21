
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
// Changed FileText, FileCsv, FileType to File
import { File, Search, ChevronLeft, ChevronRight, Users } from 'lucide-react';

interface StudentProfile {
  id: string;
  full_name: string | null;
  roll_number: string | null;
  avatar_url?: string | null;
  email?: string | null; // Added email to profile
}

interface StudentData {
  id: string;
  fullName: string;
  rollNumber: string;
  email: string;
  enrolledCoursesCount: number; // Simulated
  progressDisplay: string; // Simulated
  avatarUrl?: string | null;
}

const ITEMS_PER_PAGE = 10;

// Helper to simulate data
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const courseNames = ["Financial Auditing", "Corporate Law", "Taxation", "Cost Accounting", "Management Accounting"];

const fetchStudents = async (): Promise<StudentData[]> => {
  // Fetch student role user_ids
  const { data: studentRoles, error: rolesError } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('role', 'student');

  if (rolesError) {
    console.error('Error fetching student roles:', rolesError);
    throw new Error(rolesError.message);
  }
  if (!studentRoles || studentRoles.length === 0) return [];

  const studentUserIds = studentRoles.map(ur => ur.user_id);

  // Fetch profiles for these user_ids
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name, roll_number, avatar_url, email') // Added email here
    .in('id', studentUserIds);

  if (profilesError) {
    console.error('Error fetching student profiles:', profilesError);
    throw new Error(profilesError.message);
  }

  if (!profiles) return [];

  return profiles.map(profile => ({
    id: profile.id,
    fullName: profile.full_name || 'N/A',
    rollNumber: profile.roll_number || 'N/A',
    // Use actual email if available, otherwise mock it.
    // This assumes email is now part of the 'profiles' table and select.
    email: profile.email || `${(profile.full_name || 'student').toLowerCase().replace(/\s+/g, '.')}@example.com`,
    enrolledCoursesCount: getRandomInt(1, 3),
    progressDisplay: `${courseNames[getRandomInt(0, courseNames.length - 1)]}: ${getRandomInt(20, 90)}%`,
    avatarUrl: profile.avatar_url,
  }));
};


const AdminStudentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: students = [], isLoading, error } = useQuery<StudentData[], Error>({
    queryKey: ['adminStudents'],
    queryFn: fetchStudents,
  });

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

  const handleExport = (format: 'pdf' | 'word' | 'csv') => {
    toast({ title: `Exporting as ${format.toUpperCase()}`, description: "This feature is not yet implemented." });
    // Actual export logic will go here
  };

  if (error) {
    toast({ title: "Error fetching students", description: error.message, variant: "destructive" });
    return <Card><CardContent><p className="text-red-500">Failed to load students: {error.message}</p></CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-lms-admin" />
            Student List ({filteredStudents.length})
          </div>
          <div className="flex items-center gap-2">
            {/* Using File icon for all export buttons */}
            <Button variant="outline" size="icon" onClick={() => handleExport('pdf')} className="hidden sm:inline-flex" aria-label="Export as PDF">
              <File className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleExport('word')} className="hidden sm:inline-flex" aria-label="Export as Word">
              <File className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleExport('csv')} className="hidden sm:inline-flex" aria-label="Export as CSV">
              <File className="h-4 w-4" />
            </Button>
             {/* Mobile export options could be a dropdown if space is an issue */}
          </div>
        </CardTitle>
        <div className="mt-4 flex items-center">
          <Search className="absolute ml-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students by name, roll no, email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="pl-10 w-full"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : paginatedStudents.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No students found matching your search.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Roll Number</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="text-center hidden lg:table-cell">Courses</TableHead>
                  <TableHead className="hidden lg:table-cell">Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="font-medium">{student.fullName}</div>
                      <div className="text-sm text-muted-foreground md:hidden">{student.rollNumber}</div>
                      <div className="text-sm text-muted-foreground sm:hidden">{student.email}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{student.rollNumber}</TableCell>
                    <TableCell className="hidden sm:table-cell">{student.email}</TableCell>
                    <TableCell className="text-center hidden lg:table-cell">{student.enrolledCoursesCount}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {student.progressDisplay ? (
                        <div className="flex items-center">
                          <span className="mr-2 w-32 truncate text-xs">{student.progressDisplay.split(':')[0]}</span>
                          <Progress value={parseInt(student.progressDisplay.split(':')[1]?.trim().replace('%', '') || '0')} className="w-24 h-2" />
                          <span className="ml-2 text-xs">{student.progressDisplay.split(':')[1]}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
                       <div className="text-sm text-muted-foreground lg:hidden">{student.progressDisplay} ({student.enrolledCoursesCount} courses)</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                      {/* More actions (Edit/Delete) will go here */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminStudentList;

