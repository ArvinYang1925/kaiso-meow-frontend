import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface VideoJSPlayerProps {
  src: string;
  type?: string;
  className?: string;
}

const VideoJSPlayer = ({
  src,
  type = "application/x-mpegURL",
  className = "",
}: VideoJSPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!videoRef.current) return;

    // Clean up existing player
    if (playerRef.current) {
      try {
        if (!playerRef.current.isDisposed()) {
          playerRef.current.dispose();
        }
      } catch (error) {
        console.warn("Error disposing player:", error);
      }
      playerRef.current = null;
    }

    // Reset states
    setIsReady(false);
    setHasError(false);
    setErrorMessage("");

    // Simple Video.js initialization
    try {
      console.log("Initializing Video.js with source:", src);

      const player = videojs(videoRef.current, {
        controls: true,
        preload: "auto",
        fluid: false,
        responsive: false,
        sources: [
          {
            src,
            type,
          },
        ],
      });

      playerRef.current = player;

      // Event listeners
      player.ready(() => {
        console.log("Player ready");
        setIsReady(true);
      });

      player.on("loadstart", () => {
        console.log("Load start");
      });

      player.on("loadeddata", () => {
        console.log("Data loaded");
        setIsReady(true);
      });

      player.on("canplay", () => {
        console.log("Can play");
        setIsReady(true);
      });

      player.on("error", (e: any) => {
        console.error("Player error:", e);
        const error = player.error();
        console.error("Error details:", error);

        if (error) {
          const message = `Error ${error.code}: ${error.message}`;
          setErrorMessage(message);
        } else {
          setErrorMessage("Unknown player error");
        }
        setHasError(true);
        setIsReady(false);
      });
    } catch (error) {
      console.error("Failed to initialize player:", error);
      setErrorMessage("Failed to initialize player");
      setHasError(true);
    }

    // Cleanup
    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        try {
          playerRef.current.dispose();
        } catch (error) {
          console.warn("Cleanup error:", error);
        }
        playerRef.current = null;
      }
    };
  }, [src, type]);

  if (hasError) {
    return (
      <div className="w-full h-96 bg-red-50 border-2 border-red-200 rounded-lg flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-red-600 font-bold text-lg mb-2">
            ❌ Video Error
          </div>
          <div className="text-red-700 text-sm mb-3">{errorMessage}</div>
          <div className="text-xs text-gray-600 mb-4 p-2 bg-gray-100 rounded font-mono break-all">
            {src}
          </div>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            onClick={() => {
              setHasError(false);
              setErrorMessage("");
            }}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black rounded-lg p-4">
      {/* Status indicator at top */}
      <div className="text-xs text-gray-300 mb-2 text-center">
        {type === "application/x-mpegURL" ? "HLS Stream" : "MP4 Video"} |
        Status: {isReady ? "Ready" : "Loading"}
      </div>

      {/* Video element with explicit styling */}
      <div className="w-full" style={{ minHeight: "400px" }}>
        <video
          ref={videoRef}
          className={`video-js vjs-default-skin ${className}`}
          controls
          preload="auto"
          data-setup="{}"
          style={{
            width: "100%",
            height: "400px",
            backgroundColor: "#000",
            display: "block",
          }}
        />
      </div>

      {/* Loading indicator */}
      {!isReady && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <div className="text-white text-sm mt-2">Loading video...</div>
        </div>
      )}
    </div>
  );
};

export default VideoJSPlayer;
