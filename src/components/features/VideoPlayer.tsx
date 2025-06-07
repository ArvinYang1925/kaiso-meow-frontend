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
  type = "video/mp4",
  className = "",
  onProgress,
  onEnded,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!videoRef.current) return;

      // Initialize video.js player
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        fluid: true,
        responsive: true,
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        html5: {
          hls: {
            enableLowInitialPlaylist: true,
            smoothQualityChange: true,
            overrideNative: true,
          },
        },
        sources: [
          {
            src,
            type,
          },
        ],
      });

      // Add event listeners
      if (playerRef.current) {
        playerRef.current.on("timeupdate", () => {
          if (playerRef.current && onProgress) {
            const currentTime = playerRef.current.currentTime();
            const duration = playerRef.current.duration();
            onProgress(currentTime, duration);
          }
        });

        playerRef.current.on("ended", () => {
          if (onEnded) {
            onEnded();
          }
        });
      }
    }, 0);

    return () => {
      clearTimeout(timeout);
      if (playerRef.current) {
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
      />
    </div>
  );
};

export default VideoPlayer;
