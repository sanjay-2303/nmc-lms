
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, FileText, Video } from "lucide-react";
import { toast } from "sonner";

const InstructorUploadPage = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder for actual upload logic
    toast.success("Content submitted for review!", { description: "It will be published after verification." });
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Upload Content"
        subtitle="Add new videos, notes, or resources to your courses"
      />
      <Card>
        <CardHeader>
          <CardTitle>New Content Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="courseSelect">Select Course</Label>
              <Select>
                <SelectTrigger id="courseSelect">
                  <SelectValue placeholder="Choose a course..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ca-foundation">CA Foundation Batch 2025</SelectItem>
                  <SelectItem value="cma-inter-g1">CMA Inter Group I Crash Course</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="moduleSelect">Select Module (Optional)</Label>
              <Select>
                <SelectTrigger id="moduleSelect">
                  <SelectValue placeholder="Choose a module..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m1">Module 1: Accounting Principles</SelectItem>
                  <SelectItem value="m2">Module 2: Business Laws</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="contentType">Content Type</Label>
              <Select defaultValue="video">
                <SelectTrigger id="contentType">
                  <SelectValue placeholder="Select content type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2"><Video className="h-4 w-4" /> Video Lesson</div>
                  </SelectItem>
                  <SelectItem value="resource">
                    <div className="flex items-center gap-2"><FileText className="h-4 w-4" /> PDF/Notes Resource</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contentTitle">Content Title</Label>
              <Input id="contentTitle" placeholder="e.g., Introduction to GST" required />
            </div>

            <div>
              <Label htmlFor="contentDescription">Description (Optional)</Label>
              <Textarea id="contentDescription" placeholder="Briefly describe the content..." />
            </div>

            <div>
              <Label htmlFor="contentFile">Upload File</Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="contentFile"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-lms-blue hover:text-lms-darkBlue focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-lms-blue"
                    >
                      <span>Upload a file</span>
                      <Input id="contentFile" name="contentFile" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">MP4, AVI, PDF, DOCX up to 500MB</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-lms-blue hover:bg-lms-darkBlue">
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Content
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorUploadPage;
