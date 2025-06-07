import { useState, useCallback, useEffect, useRef } from "react";
import { Component, ReactNode } from "react";
import VideoJSPlayer from "../../components/common/VideoJSPlayer";

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class VideoErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Video player error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full bg-red-50 border border-red-200 rounded-lg flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-red-600 font-medium mb-2">
              Video Player Error
            </div>
            <div className="text-sm text-red-500">
              Please try a different video source
            </div>
            <button
              className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const VideoJSDemo = () => {
  // Playlist configuration
  const playlist = [
    {
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      title: "Big Buck Bunny",
      type: "video/mp4",
    },
    {
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      title: "Elephants Dream",
      type: "video/mp4",
    },
    {
      src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      title: "Mux Test Stream (HLS)",
      type: "application/x-mpegURL",
    },
    {
      src: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
      title: "Apple Sample HLS",
      type: "application/x-mpegURL",
    },
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(playlist[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [playerKey, setPlayerKey] = useState(0);
  const [customUrl, setCustomUrl] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [playbackRate, setPlaybackRate] = useState(1);

  const playerRef = useRef<any>(null);

  // Show status message
  const showStatus = useCallback(
    (message: string, type: "success" | "error") => {
      setStatus({ message, type });
      setTimeout(() => setStatus({ message: "", type: "" }), 3000);
    },
    []
  );

  // Handle video source change
  const handleVideoChange = useCallback(
    (newVideo: { src: string; type: string; title?: string }) => {
      if (newVideo.src === currentVideo.src) return;

      setIsLoading(true);
      showStatus(`Loading ${newVideo.title || "video"}...`, "success");

      setTimeout(() => {
        setCurrentVideo({
          src: newVideo.src,
          type: newVideo.type,
          title: newVideo.title || "Unknown Video",
        });
        setPlayerKey((prev) => prev + 1);
        setIsLoading(false);
      }, 200);
    },
    [currentVideo.src, showStatus]
  );

  // Load custom URL
  const loadCustomVideo = useCallback(() => {
    const url = customUrl.trim();
    if (!url) {
      showStatus("Please enter a valid video URL", "error");
      return;
    }

    const isM3U8 =
      url.toLowerCase().includes(".m3u8") || url.toLowerCase().includes("m3u8");
    const sourceType = isM3U8 ? "application/x-mpegURL" : "video/mp4";

    handleVideoChange({
      src: url,
      type: sourceType,
      title: `Custom ${isM3U8 ? "HLS" : "MP4"} Video`,
    });
  }, [customUrl, handleVideoChange]);

  // Playlist navigation
  const nextVideo = useCallback(() => {
    if (currentVideoIndex < playlist.length - 1) {
      const newIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(newIndex);
      handleVideoChange(playlist[newIndex]);
      showStatus(`Playing: ${playlist[newIndex].title}`, "success");
    }
  }, [currentVideoIndex, handleVideoChange, showStatus]);

  const previousVideo = useCallback(() => {
    if (currentVideoIndex > 0) {
      const newIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(newIndex);
      handleVideoChange(playlist[newIndex]);
      showStatus(`Playing: ${playlist[newIndex].title}`, "success");
    }
  }, [currentVideoIndex, handleVideoChange, showStatus]);

  // Player controls
  const togglePlay = useCallback(() => {
    if (playerRef.current) {
      if (playerRef.current.paused()) {
        playerRef.current.play();
        showStatus("Playing", "success");
      } else {
        playerRef.current.pause();
        showStatus("Paused", "success");
      }
    }
  }, [showStatus]);

  const skipForward = useCallback(() => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime();
      const duration = playerRef.current.duration();
      const newTime = Math.min(currentTime + 10, duration);
      playerRef.current.currentTime(newTime);
      showStatus("Skipped forward 10 seconds", "success");
    }
  }, [showStatus]);

  const skipBackward = useCallback(() => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime();
      const newTime = Math.max(currentTime - 10, 0);
      playerRef.current.currentTime(newTime);
      showStatus("Skipped backward 10 seconds", "success");
    }
  }, [showStatus]);

  const changeSpeed = useCallback(
    (rate: number) => {
      if (playerRef.current) {
        playerRef.current.playbackRate(rate);
        setPlaybackRate(rate);
        showStatus(`Playback speed set to ${rate}x`, "success");
      }
    },
    [showStatus]
  );

  const toggleFullscreen = useCallback(() => {
    if (playerRef.current) {
      if (playerRef.current.isFullscreen()) {
        playerRef.current.exitFullscreen();
      } else {
        playerRef.current.requestFullscreen();
      }
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only respond if no input field is focused
      if ((event.target as HTMLElement).tagName === "INPUT") return;

      switch (event.code) {
        case "ArrowLeft":
          skipBackward();
          event.preventDefault();
          break;
        case "ArrowRight":
          skipForward();
          event.preventDefault();
          break;
        case "Space":
          togglePlay();
          event.preventDefault();
          break;
        case "KeyN":
          nextVideo();
          event.preventDefault();
          break;
        case "KeyP":
          previousVideo();
          event.preventDefault();
          break;
        case "KeyF":
          toggleFullscreen();
          event.preventDefault();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    skipBackward,
    skipForward,
    togglePlay,
    nextVideo,
    previousVideo,
    toggleFullscreen,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📺 Video.js M3U8 Player Tutorial
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A comprehensive video player with{" "}
            <span className="font-semibold text-blue-600">
              M3U8/HLS support
            </span>
            , custom controls, playlist functionality, and keyboard shortcuts.
          </p>
        </div>

        {/* Main Video Player */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">
              🎬 {currentVideo.title || "Current Video"}
            </h2>
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentVideo.type === "application/x-mpegURL"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {currentVideo.type === "application/x-mpegURL" ? "HLS" : "MP4"}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {playbackRate}x Speed
              </span>
            </div>
          </div>

          {/* Video Player Container */}
          <div className="relative">
            <VideoErrorBoundary key={`error-boundary-${playerKey}`}>
              <VideoJSPlayer
                key={`player-${playerKey}-${currentVideo.src}`}
                src={currentVideo.src}
                type={currentVideo.type}
                className="rounded-lg"
              />
            </VideoErrorBoundary>
          </div>

          {/* Status Message */}
          {status.message && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm font-medium ${
                status.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {status.message}
            </div>
          )}
        </div>

        {/* Custom URL Input */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🔗 Load Custom Video URL
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Enter M3U8 or MP4 URL (e.g., https://example.com/playlist.m3u8)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === "Enter" && loadCustomVideo()}
            />
            <button
              onClick={loadCustomVideo}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Load Video
            </button>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            🎛️ Player Controls
          </h3>

          {/* Basic Controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <button
              onClick={togglePlay}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ⏯️ Play/Pause
            </button>
            <button
              onClick={skipBackward}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              ⏪ -10s
            </button>
            <button
              onClick={skipForward}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              ⏩ +10s
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              🔍 Fullscreen
            </button>
          </div>

          {/* Speed Controls */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Playback Speed
            </h4>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {[0.25, 0.5, 1, 1.25, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => changeSpeed(speed)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    playbackRate === speed
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Playlist Controls */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Playlist Navigation (Video {currentVideoIndex + 1} of{" "}
              {playlist.length})
            </h4>
            <div className="flex gap-3">
              <button
                onClick={previousVideo}
                disabled={currentVideoIndex === 0}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentVideoIndex === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                ⏮️ Previous
              </button>
              <button
                onClick={nextVideo}
                disabled={currentVideoIndex === playlist.length - 1}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentVideoIndex === playlist.length - 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                Next ⏭️
              </button>
            </div>
          </div>
        </div>

        {/* Playlist */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            📋 Video Playlist
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {playlist.map((video, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentVideoIndex(index);
                  handleVideoChange(video);
                }}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  currentVideoIndex === index
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{video.title}</div>
                  <div
                    className={`text-xs px-2 py-1 rounded ${
                      video.type === "application/x-mpegURL"
                        ? "bg-blue-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {video.type === "application/x-mpegURL" ? "HLS" : "MP4"}
                  </div>
                </div>
                <div className="text-xs text-gray-500">{video.type}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            ⌨️ Keyboard Shortcuts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Space</kbd>
              <span className="text-sm text-gray-600">Play/Pause</span>
            </div>
            <div className="flex items-center space-x-3">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">←</kbd>
              <span className="text-sm text-gray-600">Skip backward 10s</span>
            </div>
            <div className="flex items-center space-x-3">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">→</kbd>
              <span className="text-sm text-gray-600">Skip forward 10s</span>
            </div>
            <div className="flex items-center space-x-3">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">F</kbd>
              <span className="text-sm text-gray-600">Toggle fullscreen</span>
            </div>
            <div className="flex items-center space-x-3">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">N</kbd>
              <span className="text-sm text-gray-600">Next video</span>
            </div>
            <div className="flex items-center space-x-3">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">P</kbd>
              <span className="text-sm text-gray-600">Previous video</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoJSDemo;
