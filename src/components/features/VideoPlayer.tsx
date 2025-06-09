import React, { useEffect, useRef, useCallback } from "react";
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
  const isInitializingRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Stable cleanup function
  const cleanupPlayer = useCallback(() => {
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
    }

    if (playerRef.current && !playerRef.current.isDisposed()) {
      try {
        // Remove all event listeners first
        playerRef.current.off("ready");
        playerRef.current.off("error");
        playerRef.current.off("timeupdate");
        playerRef.current.off("ended");
        playerRef.current.off("loadstart");
        playerRef.current.off("loadedmetadata");
        playerRef.current.off("canplay");
        playerRef.current.off("loadeddata");

        // Dispose with a small delay to ensure DOM is ready
        cleanupTimeoutRef.current = setTimeout(() => {
          if (
            playerRef.current &&
            !playerRef.current.isDisposed() &&
            isMountedRef.current
          ) {
            try {
              playerRef.current.dispose();
            } catch (error) {
              console.warn("VideoPlayer - Error disposing player:", error);
            }
          }
          playerRef.current = null;
        }, 50);
      } catch (error) {
        console.warn("VideoPlayer - Error during cleanup:", error);
        playerRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // Cleanup any existing player
    cleanupPlayer();

    if (!videoRef.current || !src || isInitializingRef.current) return;

    const initializePlayer = () => {
      if (!isMountedRef.current || isInitializingRef.current) return;

      isInitializingRef.current = true;
      const videoType = getVideoType(src, type);

      console.log("VideoPlayer - Initializing with:", { src, type: videoType });

      try {
        // Initialize video.js player with built-in HLS support
        playerRef.current = videojs(videoRef.current!, {
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

        // Add event listeners only if component is still mounted
        if (playerRef.current && isMountedRef.current) {
          playerRef.current.on("ready", () => {
            if (isMountedRef.current) {
              console.log("VideoPlayer - Player ready");
            }
          });

          playerRef.current.on("error", (error: any) => {
            if (isMountedRef.current) {
              const errorDetails = playerRef.current?.error();
              console.error("VideoPlayer - Error:", error, errorDetails);

              // Try to provide more specific error information
              if (errorDetails) {
                console.error("Error details:", {
                  code: errorDetails.code,
                  message: errorDetails.message,
                });
              }
            }
          });

          playerRef.current.on("timeupdate", () => {
            if (playerRef.current && onProgress && isMountedRef.current) {
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
            if (onEnded && isMountedRef.current) {
              onEnded();
            }
          });

          // Log when the player starts loading
          playerRef.current.on("loadstart", () => {
            if (isMountedRef.current) {
              console.log("VideoPlayer - Load started for:", src);
            }
          });

          // Log when metadata is loaded
          playerRef.current.on("loadedmetadata", () => {
            if (isMountedRef.current) {
              console.log("VideoPlayer - Metadata loaded");
            }
          });

          // Additional HLS-specific events
          playerRef.current.on("canplay", () => {
            if (isMountedRef.current) {
              console.log("VideoPlayer - Can play");
            }
          });

          playerRef.current.on("loadeddata", () => {
            if (isMountedRef.current) {
              console.log("VideoPlayer - Data loaded");
            }
          });
        }

        isInitializingRef.current = false;
      } catch (error) {
        console.error("VideoPlayer - Error during initialization:", error);
        isInitializingRef.current = false;
      }
    };

    // Initialize player with a small delay to ensure DOM is ready
    const timeout = setTimeout(initializePlayer, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [src, type]); // Remove onProgress and onEnded from dependencies to prevent frequent re-initializations

  // Handle progress and ended callbacks separately
  useEffect(() => {
    // Update refs for callbacks without re-initializing player
    if (playerRef.current && !playerRef.current.isDisposed()) {
      // These are already bound to the player, no need to rebind
    }
  }, [onProgress, onEnded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      isInitializingRef.current = false;
      cleanupPlayer();
    };
  }, [cleanupPlayer]);

  return (
    <div data-vjs-player className="w-full">
      {src ? (
        <video
          ref={videoRef}
          className={`video-js vjs-default-skin vjs-big-play-centered w-full ${className}`}
          controls
          preload="auto"
          data-setup="{}"
          crossOrigin="anonymous"
        />
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-900 text-white">
          <div className="text-center">
            <p>無法載入影片</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
