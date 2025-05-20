import PageHeader from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoPlayer from "@/components/course/VideoPlayer";
import { FileText, Video, Download, Lock, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

// Interface matching Supabase structure (can be refined or use generated types)
export interface DbLesson {
  id: string;
  title: string;
  description: string | null;
  lesson_order: number | null;
  lesson_type: 'video' | 'resource' | 'youtube' | null; // Match DB enum if exists, or text
  content_url: string | null;
  duration_seconds: number | null;
}

export interface DbModule {
  id: string;
  title: string;
  module_order: number | null;
  lessons: DbLesson[];
}

export interface DbCourse {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  instructor_id: string | null;
  modules: DbModule[];
}

// Frontend adaptable lesson type
interface Lesson extends Omit<DbLesson, 'lesson_type' | 'content_url' | 'duration_seconds'> {
  type: 'video' | 'resource' | 'youtube'; // Simplified for frontend
  url?: string; // Mapped from content_url
  duration?: string; // Mapped from duration_seconds
}

interface Module extends Omit<DbModule, 'lessons'> {
  lessons: Lesson[];
}

interface Course extends Omit<DbCourse, 'modules'> {
  modules: Module[];
}

const formatDurationFromSeconds = (totalSeconds: number | null | undefined): string => {
  if (totalSeconds === null || totalSeconds === undefined || isNaN(totalSeconds) || totalSeconds < 0) {
    return "0:00";
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

// Function to fetch course details
const fetchCourseDetails = async (courseId: string, userId?: string | null): Promise<Course | null> => {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      description,
      status,
      instructor_id,
      modules (
        id,
        title,
        module_order,
        lessons (
          id,
          title,
          description,
          lesson_order,
          lesson_type,
          content_url,
          duration_seconds
        )
      )
    `)
    .eq('id', courseId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching course details:", error);
    throw new Error(error.message);
  }

  if (!data) return null;

  // Check if user can access this course based on RLS (status published or user is instructor)
  // The RLS policy "Authenticated users can view published courses" on public.courses has:
  // USING (status = 'published' OR instructor_id = auth.uid());
  // So, if data is returned, access is granted by RLS.

  // Transform data to frontend Course structure
  const transformedCourse: Course = {
    ...data,
    description: data.description || "",
    modules: (data.modules || []).map(mod => ({
      ...mod,
      lessons: (mod.lessons || []).sort((a,b) => (a.lesson_order || 0) - (b.lesson_order || 0)).map(les => ({
        ...les,
        type: (les.lesson_type === 'youtube' ? 'youtube' : les.lesson_type === 'video' ? 'video' : 'resource') as 'video' | 'resource' | 'youtube',
        url: les.content_url || undefined,
        duration: formatDurationFromSeconds(les.duration_seconds),
        description: les.description || "",
      })),
    })).sort((a,b) => (a.module_order || 0) - (b.module_order || 0)),
  };

  return transformedCourse;
};

const StudentCourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  
  const [selectedVideo, setSelectedVideo] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const { data: course, isLoading, error } = useQuery<Course | null, Error>({
    queryKey: ['courseDetails', courseId, user?.id],
    queryFn: () => {
      if (!courseId) return Promise.resolve(null);
      return fetchCourseDetails(courseId, user?.id);
    },
    enabled: !!courseId,
  });

  useEffect(() => {
    if (course && course.modules.length > 0) {
      const firstModule = course.modules[0];
      if (firstModule && firstModule.lessons.length > 0) {
        // Try to select the first *unlocked* video lesson of the first module
        const firstPlayableVideo = firstModule.lessons.find(
          lesson => (lesson.type === 'video' || lesson.type === 'youtube') && isLessonUnlocked(lesson, firstModule.lessons, completedLessons)
        );
        if (firstPlayableVideo) {
          setSelectedVideo(firstPlayableVideo);
        } else {
          // if no video is immediately playable, maybe select first lesson if it's a resource and unlocked
          const firstResourceIfUnlocked = firstModule.lessons.find(
            lesson => lesson.type === 'resource' && isLessonUnlocked(lesson, firstModule.lessons, completedLessons)
          );
          if (firstResourceIfUnlocked) {
            // Potentially do something here, or just default to "select a video" message
          }
        }
      }
    } else if (course && course.modules.length === 0) {
      setSelectedVideo(null); // No modules, no video
    }
  }, [course, completedLessons]);

  const isLessonUnlocked = (lesson: Lesson, lessonsInModule: Lesson[], currentCompletedLessons: Set<string>): boolean => {
    if (lesson.type === "resource") {
      const lessonIndex = lessonsInModule.findIndex(l => l.id === lesson.id);
      if (lessonIndex === 0) return true; // First lesson, if resource, is always unlocked
      
      // Check if any preceding video lesson in the same module is completed
      // This is a simplified logic: if any video before it is complete, it's unlocked.
      // Or, if all preceding lessons are resources and unlocked.
      for (let i = lessonIndex - 1; i >= 0; i--) {
        const prevLesson = lessonsInModule[i];
        if (prevLesson.type === 'video' || prevLesson.type === 'youtube') {
          if (currentCompletedLessons.has(prevLesson.id)) return true; // Preceding video completed
          // If preceding video is not completed, this resource is locked by that video.
          // This implicitly means all videos before this resource must be completed.
          let allPreviousVideosCompleted = true;
          for (let j = 0; j < lessonIndex; j++) {
            if ((lessonsInModule[j].type === 'video' || lessonsInModule[j].type === 'youtube') && !currentCompletedLessons.has(lessonsInModule[j].id)) {
              allPreviousVideosCompleted = false;
              break;
            }
          }
          return allPreviousVideosCompleted;
        }
      }
      return true; // No preceding video lessons, so it's unlocked
    }

    // For video or YouTube lessons
    const lessonIndex = lessonsInModule.findIndex(l => l.id === lesson.id);
    if (lessonIndex === -1) return false; 

    // Find the first video/youtube lesson in this module
    let firstVideoTypeIndexInModule = -1;
    for(let i=0; i < lessonsInModule.length; i++) {
      if(lessonsInModule[i].type === 'video' || lessonsInModule[i].type === 'youtube') {
        firstVideoTypeIndexInModule = i;
        break;
      }
    }
    
    // If this lesson is the first video/youtube lesson in the module, it's unlocked
    if (lessonIndex === firstVideoTypeIndexInModule) return true;

    // Otherwise, check if the immediately preceding *video/youtube* lesson is completed
    let precedingVideoTypeLesson: Lesson | null = null;
    for (let i = lessonIndex - 1; i >= 0; i--) {
      if (lessonsInModule[i].type === 'video' || lessonsInModule[i].type === 'youtube') {
        precedingVideoTypeLesson = lessonsInModule[i];
        break;
      }
    }
    // If there's a preceding video/youtube lesson, it must be completed.
    // If no preceding video/youtube (e.g., only resources before it), it's treated as the first "effective" video.
    return precedingVideoTypeLesson ? currentCompletedLessons.has(precedingVideoTypeLesson.id) : true; 
  };

  const handleLessonClick = (lesson: Lesson, lessonsInCurrentModule: Lesson[]) => {
    if (!isLessonUnlocked(lesson, lessonsInCurrentModule, completedLessons)) {
      toast.info("Please complete the previous video lesson to unlock this one.");
      return;
    }
    if (lesson.type === 'video' || lesson.type === 'youtube') {
      setSelectedVideo(lesson);
    } else if (lesson.type === 'resource' && lesson.url) {
      try {
        const resourceUrl = lesson.url.startsWith('http') ? lesson.url : `${window.location.origin}${lesson.url}`;
        window.open(resourceUrl, '_blank');
        toast.success(`Opening resource: ${lesson.title}`);
      } catch (e) {
        toast.error("Could not open resource.");
        console.error("Error opening resource:", e);
      }
    }
  };

  const handleVideoComplete = (lessonId: string) => {
    const newCompletedLessons = new Set(completedLessons).add(lessonId);
    setCompletedLessons(newCompletedLessons);
    toast.success("Video completed! Next lesson might be unlocked.");
    
    if(course && selectedVideo) {
      const currentModule = course.modules.find(m => m.lessons.some(l => l.id === selectedVideo.id));
      if (currentModule) {
        const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === selectedVideo.id);
        if (currentLessonIndex !== -1 && currentLessonIndex + 1 < currentModule.lessons.length) {
          const nextLesson = currentModule.lessons[currentLessonIndex + 1];
          if ((nextLesson.type === 'video' || nextLesson.type === 'youtube') && isLessonUnlocked(nextLesson, currentModule.lessons, newCompletedLessons)) {
             setSelectedVideo(nextLesson); 
          }
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-lms-blue" />
        <p className="ml-2">Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in p-4">
        <PageHeader title="Error Loading Course" subtitle={`Failed to load course data: ${error.message}`} />
        <Button onClick={() => window.history.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="animate-fade-in p-4">
        <PageHeader title="Course Not Found" subtitle="The course you are looking for does not exist or you may not have access." />
         <Button onClick={() => window.history.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <PageHeader title={course.title} subtitle={course.description || ""} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-6">
        <div className="lg:col-span-2">
          {selectedVideo && selectedVideo.url ? (
            <VideoPlayer 
              key={selectedVideo.id}
              src={selectedVideo.url} 
              title={selectedVideo.title}
              lessonType={selectedVideo.type}
              onProgress={(p) => console.log(`Video ${selectedVideo.title} progress: ${p}%`)}
              onComplete={() => handleVideoComplete(selectedVideo.id)}
            />
          ) : (
            <div className="aspect-video bg-gray-200 dark:bg-gray-800 flex items-center justify-center rounded-lg shadow-lg">
              <p className="text-gray-500 dark:text-gray-400">Select a video to play, or no videos available/unlocked in this course.</p>
            </div>
          )}
          {selectedVideo && <p className="mt-4 text-gray-700 dark:text-gray-300">{selectedVideo.description}</p>}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[calc(100vh-200px)] overflow-y-auto">
              {course.modules.length === 0 && <p className="text-gray-500">No modules in this course yet.</p>}
              {course.modules.map((module) => (
                <div key={module.id} className="mb-6">
                  <h3 className="font-semibold text-lg text-lms-darkBlue dark:text-lms-lightBlue mb-3">{module.title}</h3>
                  {module.lessons.length === 0 && <p className="text-xs text-gray-400 ml-2">No lessons in this module yet.</p>}
                  <ul className="space-y-2">
                    {module.lessons.map((lesson) => {
                      const unlocked = isLessonUnlocked(lesson, module.lessons, completedLessons);
                      const isSelected = selectedVideo?.id === lesson.id && (lesson.type === 'video' || lesson.type === 'youtube');
                      return (
                        <li key={lesson.id} 
                            className={`p-3 rounded-md border dark:border-gray-700 transition-all duration-150 flex items-center justify-between group
                                        ${!unlocked ? 'bg-gray-100 dark:bg-gray-800 opacity-60 cursor-not-allowed' 
                                                    : isSelected ? 'bg-lms-blue text-white shadow-md scale-105' 
                                                                 : 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'}`}
                            onClick={() => handleLessonClick(lesson, module.lessons)}>
                          <div className="flex items-center gap-3">
                            {lesson.type === "video" || lesson.type === "youtube" ? <Video className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-lms-blue'}`} /> : <FileText className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />}
                            <span className={`text-sm ${isSelected ? 'font-semibold' : ''}`}>{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            {(lesson.type === "video" || lesson.type === "youtube") && lesson.duration && <span className={`${isSelected ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>{lesson.duration}</span>}
                            {!unlocked && (lesson.type === "video" || lesson.type === "youtube") && <Lock className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                            {unlocked && lesson.type === "resource" && (
                              <Button variant="ghost" size="icon" asChild onClick={(e) => { e.stopPropagation(); if(lesson.url) handleLessonClick(lesson, module.lessons); }}>
                                <Download className={`h-4 w-4 ${isSelected ? 'text-white': 'text-gray-600 dark:text-gray-400'} group-hover:text-lms-blue`} />
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
