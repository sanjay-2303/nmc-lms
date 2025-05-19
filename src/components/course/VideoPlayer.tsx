import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  lessonType?: 'video' | 'youtube';
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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const togglePlayPause = () => {
    if (isYouTube) {
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

    const video = videoRef.current;
    const current = video.currentTime;
    const videoDuration = video.duration; // Renamed to avoid conflict with state variable

    if (videoDuration && videoDuration > 0 && isFinite(videoDuration)) {
      const calculatedProgress = Math.floor((current / videoDuration) * 100);
      
      setCurrentTime(current);
      setProgress(calculatedProgress);

      if (onProgress) {
        onProgress(calculatedProgress);
      }
      
      if (calculatedProgress >= 98) { // Using 98% as threshold
        if (onComplete) {
          onComplete();
        }
      }
    } else {
      setCurrentTime(current);
      setProgress(0); 
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      if (isFinite(videoDuration)) {
        setDuration(videoDuration);
      } else {
        setDuration(0);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current && duration > 0) { // ensure duration is positive before seeking
      const seekTime = (parseInt(e.target.value) / 100) * duration;
      if(isFinite(seekTime)) {
        videoRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
      }
    }
  };

  useEffect(() => {
    const savedTimeKey = `video-${title}`;
    const savedTime = localStorage.getItem(savedTimeKey);
    if (videoRef.current && savedTime) {
      const parsedTime = parseFloat(savedTime);
      if (isFinite(parsedTime)) {
        // Ensure video metadata is loaded before setting currentTime
        const checkDurationAndSet = () => {
          if (videoRef.current && videoRef.current.duration && isFinite(videoRef.current.duration)) {
            if (parsedTime < videoRef.current.duration) {
               videoRef.current.currentTime = parsedTime;
               setCurrentTime(parsedTime);
            } else {
                // Saved time is beyond video duration, reset or remove
                localStorage.removeItem(savedTimeKey);
            }
          } else if (videoRef.current) {
            // Retry if duration not yet available
            // videoRef.current.addEventListener('loadedmetadata', () => checkDurationAndSet(), { once: true });
          }
        };
        if (videoRef.current.readyState >= 1) { // HAVE_METADATA or more
             checkDurationAndSet();
        } else {
            videoRef.current.addEventListener('loadedmetadata', checkDurationAndSet, { once: true });
        }
      } else {
        localStorage.removeItem(savedTimeKey); // Remove invalid item
      }
    }
  }, [title]); // Removed videoRef.current from dependencies as it's a ref

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && isFinite(videoRef.current.currentTime)) { // Save only finite values
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
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          if (onComplete) onComplete();
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
            disabled={!isFinite(duration) || duration === 0} // Disable if duration is not valid
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
              disabled={!isFinite(duration) || duration === 0} // Disable if duration is not valid
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
