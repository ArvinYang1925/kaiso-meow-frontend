import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";
import "@/styles/video-player.css";

interface VideoPlayerProps {
  src: string;
  type?: string;
  className?: string;
  onProgress?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  type,
  className = "",
  onProgress,
  onEnded,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  // Auto-detect type based on file extension
  const getVideoType = (url: string, providedType?: string) => {
    if (providedType) return providedType;

    if (url.includes(".m3u8")) {
      return "application/x-mpegURL";
    } else if (url.includes(".mp4")) {
      return "video/mp4";
    } else if (url.includes(".webm")) {
      return "video/webm";
    }

    return "video/mp4"; // default fallback
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!videoRef.current) return;

      const videoType = getVideoType(src, type);

      console.log("VideoPlayer - Initializing with:", { src, type: videoType });

      // Initialize video.js player with built-in HLS support
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        fluid: true,
        responsive: true,
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        // Use VideoJS 8's built-in HLS support
        html5: {
          hls: {
            enableLowInitialPlaylist: true,
            smoothQualityChange: true,
            overrideNative: true,
            withCredentials: false,
          },
        },
        sources: [
          {
            src,
            type: videoType,
          },
        ],
        // Simplified options for better compatibility
        liveui: false,
      });

      // Add event listeners
      if (playerRef.current) {
        playerRef.current.on("ready", () => {
          console.log("VideoPlayer - Player ready");
        });

        playerRef.current.on("error", (error: any) => {
          const errorDetails = playerRef.current?.error();
          console.error("VideoPlayer - Error:", error, errorDetails);

          // Try to provide more specific error information
          if (errorDetails) {
            console.error("Error details:", {
              code: errorDetails.code,
              message: errorDetails.message,
            });
          }
        });

        playerRef.current.on("timeupdate", () => {
          if (playerRef.current && onProgress) {
            const currentTime = playerRef.current.currentTime();
            const duration = playerRef.current.duration();
            if (
              currentTime !== undefined &&
              duration !== undefined &&
              !isNaN(currentTime) &&
              !isNaN(duration)
            ) {
              onProgress(currentTime, duration);
            }
          }
        });

        playerRef.current.on("ended", () => {
          if (onEnded) {
            onEnded();
          }
        });

        // Log when the player starts loading
        playerRef.current.on("loadstart", () => {
          console.log("VideoPlayer - Load started for:", src);
        });

        // Log when metadata is loaded
        playerRef.current.on("loadedmetadata", () => {
          console.log("VideoPlayer - Metadata loaded");
        });

        // Additional HLS-specific events
        playerRef.current.on("canplay", () => {
          console.log("VideoPlayer - Can play");
        });

        playerRef.current.on("loadeddata", () => {
          console.log("VideoPlayer - Data loaded");
        });
      }
    }, 0);

    return () => {
      clearTimeout(timeout);
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, type, onProgress, onEnded]);

  return (
    <div data-vjs-player className="w-full">
      <video
        ref={videoRef}
        className={`video-js vjs-default-skin vjs-big-play-centered w-full ${className}`}
        controls
        preload="auto"
        data-setup="{}"
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default VideoPlayer;
