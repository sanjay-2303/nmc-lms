
import PageHeader from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { useState } from "react";

interface Resource {
  id: string;
  title: string;
  course: string;
  type: "PDF" | "Notes" | "Question Paper";
  url: string; // Download URL
}

const StudentResourcesPage = () => {
  const [resources] = useState<Resource[]>([
    { id: "r1", title: "Accounting Chapter 1 Notes", course: "CA Foundation", type: "PDF", url: "/sample-notes.pdf" },
    { id: "r2", title: "Business Law Case Studies", course: "CA Foundation", type: "Notes", url: "/sample-casestudies.pdf" },
    { id: "r3", title: "Economics Mock Test 1", course: "CMA Intermediate", type: "Question Paper", url: "/sample-qpaper.pdf" },
  ]);

  return (
    <div className="animate-fade-in">
      <PageHeader title="My Resources" subtitle="Download study materials and notes" />
      <Card>
        <CardHeader>
          <CardTitle>Available Resources</CardTitle>
        </CardHeader>
        <CardContent>
          {resources.length > 0 ? (
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource.id} className="border p-4 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-lms-blue" />
                    <div>
                      <h3 className="font-medium text-lg">{resource.title}</h3>
                      <p className="text-sm text-gray-500">
                        Course: {resource.course} • Type: {resource.type}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={resource.url} download target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-1" /> Download
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No resources available yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentResourcesPage;
