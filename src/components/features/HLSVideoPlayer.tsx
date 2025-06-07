import React, { useEffect, useRef } from "react";

interface HLSVideoPlayerProps {
  src: string;
  className?: string;
  onProgress?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
}

const HLSVideoPlayer: React.FC<HLSVideoPlayerProps> = ({
  src,
  className = "",
  onProgress,
  onEnded,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set the source
    video.src = src;

    // Add event listeners
    const handleTimeUpdate = () => {
      if (onProgress && video) {
        onProgress(video.currentTime, video.duration);
      }
    };

    const handleEnded = () => {
      if (onEnded) {
        onEnded();
      }
    };

    const handleError = (error: Event) => {
      console.error("HLS Video Error:", error);
      console.error("Video error details:", video.error);
    };

    const handleLoadStart = () => {
      console.log("HLS Video - Load started for:", src);
    };

    const handleLoadedMetadata = () => {
      console.log("HLS Video - Metadata loaded");
    };

    const handleCanPlay = () => {
      console.log("HLS Video - Can play");
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      if (video) {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("ended", handleEnded);
        video.removeEventListener("error", handleError);
        video.removeEventListener("loadstart", handleLoadStart);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("canplay", handleCanPlay);
      }
    };
  }, [src, onProgress, onEnded]);

  return (
    <div className="w-full">
      <video
        ref={videoRef}
        className={`w-full h-auto ${className}`}
        controls
        preload="metadata"
        crossOrigin="anonymous"
        style={{
          backgroundColor: "#000",
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </div>
  );
};

export default HLSVideoPlayer;
