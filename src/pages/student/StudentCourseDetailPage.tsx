
import PageHeader from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoPlayer from "@/components/course/VideoPlayer"; // Assuming this component exists and is suitable
import { FileText, Video, Download } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

// Mock course data structure
interface Lesson {
  id: string;
  title: string;
  type: "video" | "resource";
  duration?: string; // for video
  url?: string; // for video src or resource link
  description?: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

const mockCourses: Course[] = [
  {
    id: "ca-foundation",
    title: "CA Foundation Full Course",
    description: "Comprehensive coverage of all CA Foundation subjects.",
    modules: [
      {
        id: "m1", title: "Module 1: Principles and Practice of Accounting",
        lessons: [
          { id: "l1a", title: "Introduction to Accounting", type: "video", duration: "15:30", url: "/sample-video.mp4", description: "Basics of accounting concepts." },
          { id: "l1b", title: "Accounting Standards Overview", type: "video", duration: "22:10", url: "/sample-video.mp4", description: "Understanding AS." },
          { id: "l1c", title: "Chapter 1 Notes", type: "resource", url: "/sample-notes.pdf", description: "Downloadable PDF notes." },
        ],
      },
      {
        id: "m2", title: "Module 2: Business Laws and Business Correspondence",
        lessons: [
          { id: "l2a", title: "Indian Contract Act, 1872", type: "video", duration: "30:00", url: "/sample-video.mp4" },
          { id: "l2b", title: "Sale of Goods Act, 1930", type: "video", duration: "25:45", url: "/sample-video.mp4" },
        ],
      },
    ],
  },
  // Add more mock courses if needed
];


const StudentCourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Lesson | null>(null);

  useEffect(() => {
    // In a real app, fetch course details by courseId
    const foundCourse = mockCourses.find(c => c.id === courseId);
    setCourse(foundCourse || null);
    if (foundCourse && foundCourse.modules[0]?.lessons[0]?.type === 'video') {
      setSelectedVideo(foundCourse.modules[0].lessons[0]);
    }
  }, [courseId]);

  if (!course) {
    return (
      <div className="animate-fade-in p-4">
        <PageHeader title="Course Not Found" subtitle="Please check the URL or go back to courses." />
      </div>
    );
  }

  const handleVideoPlay = (lesson: Lesson) => {
    if (lesson.type === 'video') {
      setSelectedVideo(lesson);
    }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title={course.title} subtitle={course.description} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {selectedVideo && selectedVideo.url ? (
            <VideoPlayer 
              src={selectedVideo.url} 
              title={selectedVideo.title}
              onProgress={(p) => console.log(`Video ${selectedVideo.title} progress: ${p}%`)}
              onComplete={() => console.log(`Video ${selectedVideo.title} completed.`)}
            />
          ) : (
            <div className="aspect-video bg-gray-200 flex items-center justify-center rounded-lg">
              <p className="text-gray-500">Select a video to play</p>
            </div>
          )}
          {selectedVideo && <p className="mt-2 text-gray-700">{selectedVideo.description}</p>}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
              {course.modules.map((module) => (
                <div key={module.id} className="mb-4">
                  <h3 className="font-semibold text-lms-darkBlue mb-2">{module.title}</h3>
                  <ul className="space-y-2">
                    {module.lessons.map((lesson) => (
                      <li key={lesson.id} 
                          className={`p-3 rounded-md border cursor-pointer transition-colors
                                      ${selectedVideo?.id === lesson.id && lesson.type === 'video' ? 'bg-lms-blue text-white' : 'hover:bg-gray-100'}`}
                          onClick={() => handleVideoPlay(lesson)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {lesson.type === "video" ? <Video className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                            <span>{lesson.title}</span>
                          </div>
                          {lesson.type === "video" && lesson.duration && <span className="text-xs">{lesson.duration}</span>}
                          {lesson.type === "resource" && (
                            <Button variant="ghost" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                              <a href={lesson.url} download target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-1" /> Download
                              </a>
                            </Button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseDetailPage;
