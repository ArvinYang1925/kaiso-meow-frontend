import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoPlayer from "@/components/features/VideoPlayer";
// import HLSVideoPlayer from "@/components/features/HLSVideoPlayer";
import CourseSidebar from "@/components/features/CourseSidebar";
import SectionContent from "@/components/features/SectionContent";
import { Section, CourseSection } from "@/types/course";
import { learningService } from "@/services/learningService";

const LearningPage: React.FC = () => {
  const { courseId, sectionId } = useParams<{
    courseId: string;
    sectionId: string;
  }>();
  const navigate = useNavigate();

  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [courseSections, setCourseSections] = useState<CourseSection[]>([]);
  const [courseTitle, setCourseTitle] = useState<string>("課程");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseProgress, setCourseProgress] = useState({
    completedSections: 0,
    totalSections: 0,
    percentage: 0,
  });
  // const [useHLSPlayer, setUseHLSPlayer] = useState(false);

  // Fetch course progress
  useEffect(() => {
    const fetchCourseProgress = async () => {
      if (!courseId) return;

      try {
        const response = await learningService.getCourseProgress(courseId);

        if (response.status === "success") {
          const { progress } = response.data;
          setCourseProgress({
            completedSections: progress.completedSections,
            totalSections: progress.totalSections,
            percentage: Math.round(progress.percentage),
          });
        }
      } catch (err) {
        console.error("Error fetching course progress:", err);
        // Keep default progress values on error
      }
    };

    fetchCourseProgress();
  }, [courseId]);

  // Fetch course sections list
  useEffect(() => {
    const fetchCourseSections = async () => {
      if (!courseId) return;

      try {
        const response = await learningService.getCourseSectionsList(courseId);

        if (response.status === "success") {
          // Transform API response to CourseSection format
          const sections: CourseSection[] = response.data.sections.map(
            (section) => ({
              id: section.id,
              title: section.title,
              order: section.order,
              isCompleted: false, // TODO: Get this from user progress API
              isActive: section.id === sectionId,
            })
          );

          setCourseSections(sections);
          setCourseTitle(response.data.course.title);

          // Handle "first" parameter - redirect to the first section
          if (sectionId === "first" && sections.length > 0) {
            // Sort sections by order to get the first one
            const sortedSections = sections.sort((a, b) => a.order - b.order);
            const firstSection = sortedSections[0];

            // Navigate to the first section
            navigate(`/my-learning/${courseId}/section/${firstSection.id}`, {
              replace: true,
            });
            return;
          }
        }
      } catch (err) {
        console.error("Error fetching course sections:", err);
        setError("無法載入課程章節列表");
      }
    };

    fetchCourseSections();
  }, [courseId, sectionId, navigate]);

  useEffect(() => {
    const fetchSectionData = async () => {
      if (!courseId || !sectionId) {
        setError("課程ID或章節ID缺失");
        setLoading(false);
        return;
      }

      // Skip fetching if sectionId is "first" - let the redirect handle it
      if (sectionId === "first") {
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
      } finally {
        setLoading(false);
      }
    };

    fetchSectionData();
  }, [courseId, sectionId]);

  const handleSectionClick = (newSectionId: string) => {
    // Navigate to the new section
    if (courseId && newSectionId !== sectionId) {
      // Navigate immediately without delays to prevent race conditions
      navigate(`/my-learning/${courseId}/section/${newSectionId}`);
    }
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
        courseTitle={courseTitle}
        currentSectionId={currentSection?.id || sectionId || ""}
        sections={courseSections}
        onSectionClick={handleSectionClick}
        progress={courseProgress}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Video Player - Only show if video exists */}
        {currentSection &&
          (currentSection.videoUrl1 || currentSection.videoUrl) && (
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
                  key={currentSection.id} // Force re-render when section changes
                  src={
                    currentSection.videoUrl1 || currentSection.videoUrl || ""
                  }
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
          )}

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
