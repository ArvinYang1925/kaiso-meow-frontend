import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "@/components/features/VideoPlayer";
import CourseSidebar from "@/components/features/CourseSidebar";
import SectionContent from "@/components/features/SectionContent";
import { Section, CourseSection, SectionApiResponse } from "@/types/course";

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
      videoUrl: "https://example.com/videos/express-intro.mp4",
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

  // Mock course progress
  const courseProgress = {
    completedSections: 1,
    totalSections: 6,
    percentage: 25,
  };

  useEffect(() => {
    // Simulate API call
    const fetchSectionData = async () => {
      setLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real app, you would fetch data based on sectionId
      setCurrentSection(mockSectionData.data.section);
      setLoading(false);
    };

    fetchSectionData();
  }, [sectionId]);

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
        <div className="flex-1 bg-gray-50 animate-pulse"></div>
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
        courseTitle="React 前端開發實戰"
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
            <VideoPlayer
              src={currentSection.videoUrl}
              onProgress={handleVideoProgress}
              onEnded={handleVideoEnded}
              className="w-full"
            />
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
