import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  title: string;
  onProgress?: (progress: number) => void; // Made optional as YouTube doesn't easily provide this
  onComplete?: () => void; // Made optional
  lessonType?: 'video' | 'youtube'; // To explicitly know the type
}

const VideoPlayer = ({ src, title, onProgress, onComplete, lessonType = 'video' }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const isYouTube = lessonType === 'youtube' || src.includes("youtube.com") || src.includes("youtu.be");

  const getYouTubeEmbedUrl = (youtubeUrl: string) => {
    let videoId;
    if (youtubeUrl.includes("youtube.com/watch?v=")) {
      videoId = youtubeUrl.split("v=")[1].split("&")[0];
    } else if (youtubeUrl.includes("youtu.be/")) {
      videoId = youtubeUrl.split("youtu.be/")[1].split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(src) : null;

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const togglePlayPause = () => {
    if (isYouTube) {
      // YouTube iframe API would be needed for precise control.
      // For now, play/pause on the iframe itself is not directly controlled by this button.
      // Users will use YouTube's own controls.
      console.warn("Play/Pause for YouTube videos is handled by the embedded player's controls.");
      return;
    }
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (isYouTube || !videoRef.current) return;
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const calculatedProgress = Math.floor((current / duration) * 100);
      
      setCurrentTime(current);
      setProgress(calculatedProgress);
      onProgress(calculatedProgress);
      
      // Check if video is complete (using 98% as threshold to account for buffering issues)
      if (calculatedProgress >= 98) {
        onComplete();
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const seekTime = (parseInt(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  // Try to restore previously saved video position
  useEffect(() => {
    const savedTime = localStorage.getItem(`video-${title}`);
    if (savedTime && videoRef.current) {
      videoRef.current.currentTime = parseFloat(savedTime);
      setCurrentTime(parseFloat(savedTime));
    }
  }, [title]);

  // Save current position periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        localStorage.setItem(`video-${title}`, videoRef.current.currentTime.toString());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [title]);

  if (isYouTube) {
    if (!youtubeEmbedUrl) {
      return <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg bg-black mb-4 flex items-center justify-center text-white">Invalid YouTube URL</div>;
    }
    return (
      <div className="w-full rounded-lg overflow-hidden shadow-lg bg-black mb-4">
        <iframe
          width="100%"
          className="aspect-video"
          src={youtubeEmbedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
        {/* Minimal controls for YouTube, as most are in the player itself */}
        <div className="bg-gray-900 p-2 sm:p-4">
           <div className="text-sm text-white mb-2">{title}</div>
          {onComplete && (
            <Button onClick={onComplete} variant="outline" className="w-full mt-2">
              Mark as Complete (YouTube)
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg bg-black mb-4">
      <video
        ref={videoRef}
        className="w-full"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          if (onComplete) onComplete(); // Call onComplete when HTML5 video ends
        }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="bg-gray-900 p-2 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white hover:bg-gray-800"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="text-sm text-white">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        
        <div className="mt-2">
          <div className="text-sm text-gray-400">
            Completed: {progress}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
