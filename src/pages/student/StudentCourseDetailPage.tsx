import PageHeader from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoPlayer from "@/components/course/VideoPlayer";
import { FileText, Video, Download, Lock } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
          { id: "l1c", title: "Advanced Concepts in Standards", type: "video", duration: "18:00", url: "/sample-video.mp4", description: "Deep dive into AS." },
          { id: "l1d", title: "Chapter 1 Notes", type: "resource", url: "/sample-notes.pdf", description: "Downloadable PDF notes." },
        ],
      },
      {
        id: "m2", title: "Module 2: Business Laws and Business Correspondence",
        lessons: [
          { id: "l2a", title: "Indian Contract Act, 1872", type: "video", duration: "30:00", url: "/sample-video.mp4" },
          { id: "l2b", title: "Sale of Goods Act, 1930", type: "video", duration: "25:45", url: "/sample-video.mp4" },
          { id: "l2c", title: "Module 2 Summary", type: "resource", url: "/sample-summary.pdf" },
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
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    const foundCourse = mockCourses.find(c => c.id === courseId);
    setCourse(foundCourse || null);
    if (foundCourse) {
      // Try to select the first *unlocked* video lesson of the first module
      const firstModule = foundCourse.modules[0];
      if (firstModule) {
        const firstPlayableVideo = firstModule.lessons.find(
          lesson => lesson.type === 'video' && isLessonUnlocked(lesson, firstModule.lessons, new Set()) // initial check with empty completed set
        );
        if (firstPlayableVideo) {
          setSelectedVideo(firstPlayableVideo);
        }
      }
    }
  }, [courseId]);

  const isLessonUnlocked = (lesson: Lesson, lessonsInModule: Lesson[], currentCompletedLessons: Set<string>): boolean => {
    if (lesson.type === "resource") {
      // Resources are unlocked if the first lesson of the module is a resource, or if the preceding video is completed.
      // For simplicity, let's say resources are unlocked if any video before them is complete or if they are first.
      // A more robust logic might tie them to specific preceding videos.
      // For now, let's make them dependent on the video before them if one exists, otherwise unlocked.
      const lessonIndex = lessonsInModule.findIndex(l => l.id === lesson.id);
      if (lessonIndex === 0) return true;
      
      let previousVideoLesson: Lesson | null = null;
      for (let i = lessonIndex - 1; i >= 0; i--) {
        if (lessonsInModule[i].type === 'video') {
          previousVideoLesson = lessonsInModule[i];
          break;
        }
      }
      return previousVideoLesson ? currentCompletedLessons.has(previousVideoLesson.id) : true;
    }

    // For video lessons
    const lessonIndex = lessonsInModule.findIndex(l => l.id === lesson.id);
    if (lessonIndex === -1) return false; // Should not happen

    // Find the first video lesson in this module
    let firstVideoIndexInModule = -1;
    for(let i=0; i < lessonsInModule.length; i++) {
      if(lessonsInModule[i].type === 'video') {
        firstVideoIndexInModule = i;
        break;
      }
    }
    
    // If this lesson is the first video lesson in the module, it's unlocked
    if (lessonIndex === firstVideoIndexInModule) return true;

    // Otherwise, check if the immediately preceding *video* lesson is completed
    let precedingVideoLesson: Lesson | null = null;
    for (let i = lessonIndex - 1; i >= 0; i--) {
      if (lessonsInModule[i].type === 'video') {
        precedingVideoLesson = lessonsInModule[i];
        break;
      }
    }

    return precedingVideoLesson ? currentCompletedLessons.has(precedingVideoLesson.id) : true; // True if no preceding video (it's the first)
  };

  const handleLessonClick = (lesson: Lesson, lessonsInCurrentModule: Lesson[]) => {
    if (!isLessonUnlocked(lesson, lessonsInCurrentModule, completedLessons)) {
      toast.info("Please complete the previous video lesson to unlock this one.");
      return;
    }
    if (lesson.type === 'video') {
      setSelectedVideo(lesson);
    } else if (lesson.type === 'resource' && lesson.url) {
      // Handle resource click, e.g., open in new tab or download
      window.open(lesson.url, '_blank');
      toast.success(`Opening resource: ${lesson.title}`);
    }
  };

  const handleVideoComplete = (lessonId: string) => {
    setCompletedLessons(prev => new Set(prev).add(lessonId));
    console.log(`Video ${lessonId} completed. Completed lessons:`, completedLessons); // Keep console log for debugging
    toast.success("Video completed! Next lesson might be unlocked.");
    
    // Find the next video in the same module and select it if it's now unlocked
    if(course && selectedVideo) {
      const currentModule = course.modules.find(m => m.lessons.some(l => l.id === selectedVideo.id));
      if (currentModule) {
        const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === selectedVideo.id);
        if (currentLessonIndex !== -1 && currentLessonIndex + 1 < currentModule.lessons.length) {
          const nextLesson = currentModule.lessons[currentLessonIndex + 1];
          if (nextLesson.type === 'video' && isLessonUnlocked(nextLesson, currentModule.lessons, new Set(completedLessons).add(selectedVideo.id))) {
             // setSelectedVideo(nextLesson); // Optionally auto-play next
          }
        }
      }
    }
  };

  if (!course) {
    return (
      <div className="animate-fade-in p-4">
        <PageHeader title="Course Not Found" subtitle="Please check the URL or go back to courses." />
      </div>
    );
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
              onComplete={() => handleVideoComplete(selectedVideo.id)}
            />
          ) : (
            <div className="aspect-video bg-gray-200 flex items-center justify-center rounded-lg">
              <p className="text-gray-500">Select a video to play or no videos available/unlocked.</p>
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
                    {module.lessons.map((lesson) => {
                      const unlocked = isLessonUnlocked(lesson, module.lessons, completedLessons);
                      return (
                        <li key={lesson.id} 
                            className={`p-3 rounded-md border transition-colors flex items-center justify-between
                                        ${!unlocked ? 'bg-gray-100 opacity-60 cursor-not-allowed' : selectedVideo?.id === lesson.id && lesson.type === 'video' ? 'bg-lms-blue text-white cursor-pointer' : 'hover:bg-gray-100 cursor-pointer'}`}
                            onClick={() => handleLessonClick(lesson, module.lessons)}>
                          <div className="flex items-center gap-2">
                            {lesson.type === "video" ? <Video className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                            <span>{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {lesson.type === "video" && lesson.duration && <span className="text-xs">{lesson.duration}</span>}
                            {!unlocked && lesson.type === "video" && <Lock className="h-4 w-4 text-gray-500" />}
                            {unlocked && lesson.type === "resource" && (
                              <Button variant="ghost" size="icon" asChild onClick={(e) => { e.stopPropagation(); if(lesson.url) window.open(lesson.url, '_blank'); }}>
                                <a href={lesson.url} download={lesson.type === 'resource'} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </li>
                      );
                    })}
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
