import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Book, Home, Users, Video, FileText, BookOpen, LayoutDashboard } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  userRole: string;
}

const Sidebar = ({ isOpen, userRole = "student" }: SidebarProps) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  useState(() => {
    setActiveItem(location.pathname);
  });

  const adminLinks = [
    { name: "Old Dashboard", icon: Home, path: "/admin", id: "/admin" },
    { name: "Enhanced Dashboard", icon: LayoutDashboard, path: "/admin/dashboard-enhanced", id: "/admin/dashboard-enhanced" },
    { name: "Courses", icon: Book, path: "/admin/courses", id: "/admin/courses" },
    { name: "Instructors", icon: Users, path: "/admin/instructors", id: "/admin/instructors" },
    { name: "Students", icon: Users, path: "/admin/students", id: "/admin/students" },
    { name: "Reports", icon: FileText, path: "/admin/reports", id: "/admin/reports" },
  ];

  const instructorLinks = [
    { name: "Dashboard", icon: Home, path: "/instructor", id: "/instructor" },
    { name: "My Courses", icon: Book, path: "/instructor/courses", id: "/instructor/courses" },
    { name: "Upload Content", icon: Video, path: "/instructor/upload", id: "/instructor/upload" },
    { name: "Student Progress", icon: Users, path: "/instructor/progress", id: "/instructor/progress" },
  ];

  const studentLinks = [
    { name: "Dashboard", icon: Home, path: "/student", id: "/student" },
    { name: "My Courses", icon: Book, path: "/student/courses", id: "/student/courses" },
    { name: "Lessons", icon: BookOpen, path: "/student/lessons", id: "/student/lessons" },
    { name: "Resources", icon: FileText, path: "/student/resources", id: "/student/resources" },
  ];

  const links = {
    admin: adminLinks,
    instructor: instructorLinks,
    student: studentLinks,
  }[userRole] || studentLinks;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full w-64 flex-col bg-sidebar transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border">
        <h2 className="text-lg font-bold text-white">
          {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Panel
        </h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.id}>
              <Link
                to={link.path}
                className={cn(
                  "sidebar-link",
                  (activeItem === link.path || (link.path !== "/" && activeItem.startsWith(link.path))) && "active"
                )}
                onClick={() => setActiveItem(link.path)}
              >
                <link.icon className="h-5 w-5" />
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <p className="text-xs text-gray-400 text-center">
          National Management College
          <br />
          LMS v1.0
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
