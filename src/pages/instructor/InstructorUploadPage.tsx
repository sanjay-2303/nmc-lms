
import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, FileText, Video as VideoIcon } from "lucide-react"; // Renamed Video to VideoIcon
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid'; // For generating unique file names

const InstructorUploadPage = () => {
  const { user } = useAuth();
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [contentType, setContentType] = useState<'video' | 'youtube'>('video'); // 'video' for MP4, 'youtube' for YouTube URL
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
      setContentType('video'); // Default to video when file is selected
    } else {
      setVideoFile(null);
      setFileName(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to upload content.");
      return;
    }
    if (!courseTitle.trim()) {
        toast.error("Course title is required.");
        return;
    }
    if (!lessonTitle.trim()) {
        toast.error("Lesson title is required.");
        return;
    }
    if (contentType === 'video' && !videoFile) {
      toast.error("Please select an MP4 video file to upload.");
      return;
    }
    if (contentType === 'youtube' && !youtubeUrl.trim()) {
      toast.error("Please provide a YouTube video URL.");
      return;
    }


    setIsUploading(true);
    try {
      // 1. Create Course
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .insert({
          title: courseTitle,
          description: courseDescription,
          instructor_id: user.id,
          status: "draft", // Default to draft
        })
        .select()
        .single();

      if (courseError || !courseData) {
        throw courseError || new Error("Failed to create course.");
      }
      const courseId = courseData.id;

      // 2. Create a default Module for this course
      const { data: moduleData, error: moduleError } = await supabase
        .from("modules")
        .insert({
          title: "Module 1", // Default module title
          course_id: courseId,
          module_order: 1,
        })
        .select()
        .single();
      
      if (moduleError || !moduleData) {
        throw moduleError || new Error("Failed to create module.");
      }
      const moduleId = moduleData.id;

      let lessonContentUrl = "";
      let lessonTypeForDb: 'video' | 'youtube' | 'resource' = contentType === 'video' ? 'video' : 'youtube';
      let durationSeconds: number | undefined = undefined; // Placeholder for future duration extraction

      if (contentType === 'video' && videoFile) {
        const uniqueFileName = `${uuidv4()}-${videoFile.name}`;
        // Path: user_id/course_id/filename for better organization and RLS on storage
        const filePath = `${user.id}/${courseId}/${uniqueFileName}`; 
        
        const { error: uploadError } = await supabase.storage
          .from("course_videos")
          .upload(filePath, videoFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from("course_videos")
          .getPublicUrl(filePath);
        
        if (!publicUrlData?.publicUrl) {
            throw new Error("Failed to get public URL for uploaded video.");
        }
        lessonContentUrl = publicUrlData.publicUrl;

        // Potentially get video duration here if needed, for now it's optional in DB
        // For example, using a client-side library or a Supabase Edge Function after upload
        // For simplicity, we'll skip duration for now.

      } else if (contentType === 'youtube') {
        lessonContentUrl = youtubeUrl;
      }


      // 3. Create Lesson
      const { error: lessonError } = await supabase
        .from("lessons")
        .insert({
          title: lessonTitle,
          description: lessonDescription,
          module_id: moduleId,
          content_url: lessonContentUrl,
          lesson_type: lessonTypeForDb, 
          duration_seconds: durationSeconds,
          lesson_order: 1, // Default lesson order
        });
      
      if (lessonError) {
        throw lessonError;
      }

      toast.success("Content uploaded successfully!", { description: "Course, module, and lesson created." });
      // Reset form
      setCourseTitle("");
      setCourseDescription("");
      setLessonTitle("");
      setLessonDescription("");
      setVideoFile(null);
      setFileName(null);
      setYoutubeUrl("");
      setContentType('video');

    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Upload failed.", { description: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Upload New Content"
        subtitle="Create a new course and add your first lesson (video or YouTube link)"
      />
      <Card>
        <CardHeader>
          <CardTitle>New Course & Lesson Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="courseTitle">New Course Title*</Label>
                <Input id="courseTitle" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} placeholder="e.g., Advanced JavaScript Techniques" required />
              </div>
              <div>
                <Label htmlFor="courseDescription">Course Description (Optional)</Label>
                <Textarea id="courseDescription" value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} placeholder="Briefly describe the new course..." />
              </div>
            </div>
            
            <hr/>

            <div>
              <Label htmlFor="lessonTitle">Lesson Title*</Label>
              <Input id="lessonTitle" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder="e.g., Introduction to Async/Await" required />
            </div>

            <div>
              <Label htmlFor="lessonDescription">Lesson Description (Optional)</Label>
              <Textarea id="lessonDescription" value={lessonDescription} onChange={(e) => setLessonDescription(e.target.value)} placeholder="Briefly describe this lesson..." />
            </div>

            <div>
                <Label>Content Type*</Label>
                <div className="flex items-center space-x-4 mt-2">
                    <Button type="button" variant={contentType === 'video' ? 'default' : 'outline'} onClick={() => setContentType('video')}>
                        <VideoIcon className="mr-2 h-4 w-4" /> Upload MP4
                    </Button>
                    <Button type="button" variant={contentType === 'youtube' ? 'default' : 'outline'} onClick={() => setContentType('youtube')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 lucide lucide-youtube"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                        YouTube Link
                    </Button>
                </div>
            </div>
            
            {contentType === 'video' && (
              <div>
                <Label htmlFor="contentFile">Upload MP4 Video File*</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="contentFile"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-lms-blue hover:text-lms-darkBlue focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-lms-blue"
                      >
                        <span>{fileName ? `Selected: ${fileName}` : 'Upload a file'}</span>
                        <Input id="contentFile" name="contentFile" type="file" className="sr-only" onChange={handleFileChange} accept="video/mp4" />
                      </label>
                      {!fileName && <p className="pl-1">or drag and drop</p>}
                    </div>
                    <p className="text-xs text-gray-500">MP4 up to 500MB</p>
                  </div>
                </div>
              </div>
            )}

            {contentType === 'youtube' && (
                 <div>
                    <Label htmlFor="youtubeUrl">YouTube Video URL*</Label>
                    <Input id="youtubeUrl" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
                 </div>
            )}


            <div className="flex justify-end">
              <Button type="submit" className="bg-lms-blue hover:bg-lms-darkBlue" disabled={isUploading}>
                {isUploading ? 'Uploading...' : <><UploadCloud className="mr-2 h-4 w-4" /> Create Course & Upload Lesson</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorUploadPage;
