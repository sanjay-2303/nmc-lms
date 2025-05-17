
import PageHeader from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface Lesson {
  id: string;
  title: string;
  course: string;
  courseId: string; // To link to course detail page
  moduleId: string; // To potentially highlight lesson in course detail
  status: "completed" | "in-progress" | "locked";
}

const StudentLessonsPage = () => {
  const [lessons] = useState<Lesson[]>([
    { id: "l1", title: "Introduction to Accounting", course: "CA Foundation", courseId: "ca-foundation", moduleId: "m1", status: "completed" },
    { id: "l2", title: "Accounting Standards Overview", course: "CA Foundation", courseId: "ca-foundation", moduleId: "m1", status: "in-progress" },
    { id: "l3", title: "Indian Contract Act, 1872", course: "CA Foundation", courseId: "ca-foundation", moduleId: "m2", status: "locked" },
    { id: "l4", title: "Cost Ascertainment", course: "CMA Intermediate", courseId: "cma-intermediate", moduleId: "m1", status: "locked" },
  ]);

  return (
    <div className="animate-fade-in">
      <PageHeader title="My Lessons" subtitle="Track and access all your lessons" />
      <Card>
        <CardHeader>
          <CardTitle>All Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          {lessons.length > 0 ? (
            <ul className="space-y-3">
              {lessons.map((lesson) => (
                <li key={lesson.id} className="border p-4 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <h3 className="font-medium text-lg">{lesson.title}</h3>
                    <p className="text-sm text-gray-500">
                      Course: {lesson.course}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      lesson.status === "completed" ? "bg-green-100 text-green-700" :
                      lesson.status === "in-progress" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
                    </span>
                    {lesson.status !== "locked" ? (
                      <Link to={`/student/courses/${lesson.courseId}?lesson=${lesson.id}`}> {/* Modify path to include lesson if needed */}
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4 mr-1" /> Go to Lesson
                        </Button>
                      </Link>
                    ) : (
                       <Button variant="outline" size="sm" disabled>
                          <BookOpen className="h-4 w-4 mr-1" /> Locked
                        </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No lessons available yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentLessonsPage;
