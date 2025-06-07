import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "@/components/features/VideoPlayer";
// import HLSVideoPlayer from "@/components/features/HLSVideoPlayer";
import CourseSidebar from "@/components/features/CourseSidebar";
import SectionContent from "@/components/features/SectionContent";
import { Section, CourseSection, SectionApiResponse } from "@/types/course";
import { learningService } from "@/services/learningService";

// Mock data to simulate the API response structure
const mockSectionData: SectionApiResponse = {
  status: "success",
  message: "成功取得章節資料",
  data: {
    section: {
      id: "uuid-section-2",
      title: "Express 框架介紹",
      content: `<p><a href="http://google.com" rel="noopener noreferrer" target="_blank"><strong>http://google.com</strong></a></p>
                <p><a href="http://www.xxx.com.tw" rel="noopener noreferrer" target="_blank">http://www.xxx.com.tw</a></p>
                <p>在這個章節中，我們將深入了解 Express 框架的核心概念和基本用法。Express 是 Node.js 最受歡迎的 Web 應用程式框架之一，它提供了豐富的功能來建立 Web 應用程式和 API。</p>
                <h3>學習目標</h3>
                <ul>
                  <li>理解 Express 框架的基本概念</li>
                  <li>學會建立基本的 Express 應用程式</li>
                  <li>了解路由和中間件的使用方法</li>
                </ul>`,
      videoUrl:
        "http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8",
      courseId: "uuid-course-1",
      order: 2,
      progress: {
        isCompleted: false,
      },
      nextSection: {
        id: "uuid-section-3",
        title: "路由與中間件",
      },
      prevSection: {
        id: "uuid-section-1",
        title: "Node.js 基礎入門",
      },
    },
  },
};

const mockSections: CourseSection[] = [
  {
    id: "uuid-section-1",
    title: "Node.js 基礎入門",
    order: 1,
    isCompleted: true,
  },
  {
    id: "uuid-section-2",
    title: "Express 框架介紹",
    order: 2,
    isCompleted: false,
  },
  {
    id: "uuid-section-3",
    title: "路由與中間件",
    order: 3,
    isCompleted: false,
  },
  {
    id: "uuid-section-4",
    title: "模板引擎與視圖",
    order: 4,
    isCompleted: false,
  },
];

const LearningPage: React.FC = () => {
  const { courseId, sectionId } = useParams<{
    courseId: string;
    sectionId: string;
  }>();

  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [useHLSPlayer, setUseHLSPlayer] = useState(false);

  // Mock course progress
  const courseProgress = {
    completedSections: 1,
    totalSections: 6,
    percentage: 25,
  };

  useEffect(() => {
    const fetchSectionData = async () => {
      if (!courseId || !sectionId) {
        setError("課程ID或章節ID缺失");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Use the real API call
        const response = await learningService.getCourseSection(
          courseId,
          sectionId
        );

        if (response.status === "success") {
          setCurrentSection(response.data.section);
        } else {
          setError(response.message || "獲取章節資料失敗");
        }
      } catch (err) {
        console.error("Error fetching section data:", err);
        setError("獲取章節資料時發生錯誤");

        // Fallback to mock data for development
        if (import.meta.env.DEV) {
          console.warn("Falling back to mock data");
          setCurrentSection(mockSectionData.data.section);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSectionData();
  }, [courseId, sectionId]);

  const handleSectionClick = (newSectionId: string) => {
    // In a real app, you would navigate to the new section
    console.log("Navigate to section:", newSectionId);
    // window.location.href = `/course/${courseId}/section/${newSectionId}`;
  };

  const handlePrevious = () => {
    if (currentSection?.prevSection) {
      handleSectionClick(currentSection.prevSection.id);
    }
  };

  const handleNext = () => {
    if (currentSection?.nextSection) {
      handleSectionClick(currentSection.nextSection.id);
    }
  };

  const handleVideoProgress = (currentTime: number, duration: number) => {
    // Track video progress for analytics
    const progressPercentage = (currentTime / duration) * 100;
    console.log(`Video progress: ${progressPercentage.toFixed(1)}%`);
  };

  const handleVideoEnded = () => {
    // Mark section as completed when video ends
    console.log("Video ended, marking section as completed");
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="w-80 bg-gray-100 animate-pulse"></div>
        <div className="flex-1 bg-gray-50 animate-pulse flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">載入章節資料中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">載入失敗</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  if (!currentSection) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            找不到課程內容
          </h2>
          <p className="text-gray-600">請檢查課程連結是否正確</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <CourseSidebar
        courseTitle={currentSection.courseName || "課程"}
        currentSectionId={currentSection.id}
        sections={mockSections}
        onSectionClick={handleSectionClick}
        progress={courseProgress}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Video Player */}
        <div className="bg-black flex-shrink-0">
          <div className="max-w-full mx-auto">
            {/* Player Toggle Button - Commented out for now */}
            {/* <div className="absolute top-2 right-2 z-10">
              <button
                onClick={() => setUseHLSPlayer(!useHLSPlayer)}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                {useHLSPlayer ? 'Use VideoJS' : 'Use HLS Player'}
              </button>
            </div> */}

            {/* Using only VideoJS player for now */}
            <VideoPlayer
              src={currentSection.videoUrl1 || currentSection.videoUrl || ""}
              // src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              type={
                currentSection.videoUrl1?.includes(".m3u8")
                  ? "application/x-mpegURL"
                  : undefined
              }
              onProgress={handleVideoProgress}
              onEnded={handleVideoEnded}
              className="w-full"
            />

            {/* HLS Player - Commented out for now */}
            {/* {useHLSPlayer ? (
              <HLSVideoPlayer
                src={currentSection.videoUrl1 || currentSection.videoUrl || ""}
                onProgress={handleVideoProgress}
                onEnded={handleVideoEnded}
                className="w-full"
              />
            ) : (
              <VideoPlayer
                src={currentSection.videoUrl1 || currentSection.videoUrl || ""}
                type={
                  currentSection.videoUrl1?.includes(".m3u8")
                    ? "application/x-mpegURL"
                    : undefined
                }
                onProgress={handleVideoProgress}
                onEnded={handleVideoEnded}
                className="w-full"
              />
            )} */}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <SectionContent
            section={currentSection}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 right-0 p-4 text-xs text-gray-500 bg-white">
        <div className="flex items-center gap-2">
          <span>© 2024 程式學院 All rights reserved</span>
          <span>•</span>
          <span>Powered By Kaiso</span>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
