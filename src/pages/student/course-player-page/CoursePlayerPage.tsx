import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

interface CoursePlayerProps {
  src: string;
  type?: string;
  className?: string;
}

const CoursePlayerPage: React.FC<CoursePlayerProps> = ({
  src,
  type = "application/x-mpegURL",
  className = "",
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
    }, 0); // 讓 DOM 結構完全掛載後才執行

    console.log("current", videoRef.current);

    // Cleanup
    return () => {
      clearTimeout(timeout);
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [src, type]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className={`video-js vjs-big-play-centered ${className}`}
        controls
        preload="auto"
        width="640"
        height="360"
      />
    </div>
  );
};

export default CoursePlayerPage;
