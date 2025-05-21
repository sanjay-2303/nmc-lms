
import PageHeader from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminStudentList from "@/components/admin/dashboard/AdminStudentList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserCheck, ListChecks, ShieldAlert } from "lucide-react";

const AdminEnhancedDashboardPage = () => {
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Enhanced Admin Dashboard"
        subtitle="Comprehensive platform management and oversight"
      />

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="students">
            <Users className="mr-2 h-4 w-4" /> Students
          </TabsTrigger>
          <TabsTrigger value="staff">
            <UserCheck className="mr-2 h-4 w-4" /> Staff
          </TabsTrigger>
          <TabsTrigger value="accounts">
            <ShieldAlert className="mr-2 h-4 w-4" /> Manage Accounts
          </TabsTrigger>
          <TabsTrigger value="activity">
            <ListChecks className="mr-2 h-4 w-4" /> Activity Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <AdminStudentList />
        </TabsContent>

        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Staff List</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Staff list functionality will be implemented here.</p>
              {/* Placeholder for StaffListTable component */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle>Manage Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Account management (create/edit/delete students and staff) will be implemented here.</p>
              {/* Placeholder for UserManagementModals and related buttons */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Activity log display will be implemented here.</p>
              {/* Placeholder for ActivityLogTable component */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminEnhancedDashboardPage;
