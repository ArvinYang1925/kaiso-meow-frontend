import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Section } from "@/types/course";

interface SectionContentProps {
  section: Section;
  onPrevious?: () => void;
  onNext?: () => void;
  children?: React.ReactNode;
  courseTitle?: string;
  courseProgress?: {
    completedSections: number;
    totalSections: number;
    percentage: number;
  };
}

const SectionContent: React.FC<SectionContentProps> = ({
  section,
  onPrevious,
  onNext,
  children,
  courseTitle,
  courseProgress,
}) => {
  return (
    <div className="bg-white">
      {/* Mobile Progress Bar - Only visible on mobile */}
      {courseProgress && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-sm font-medium text-gray-900 truncate">
                {courseTitle || "課程"}
              </h1>
              <div className="flex items-center gap-2">
                {section.progress.isCompleted && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                <span className="text-xs text-gray-600">
                  {courseProgress.percentage}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${courseProgress.percentage}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {courseProgress.completedSections} /{" "}
              {courseProgress.totalSections} 章節已完成
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!section.prevSection}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          {/* hide on mobile */}
          <span className="hidden md:block">上一課程</span>
        </Button>

        <div className="text-center flex-1 px-4">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {section.title}
            </h2>
            {/* Mobile Completion Icon - Show next to title */}
            {section.progress.isCompleted && (
              <CheckCircle className="w-5 h-5 text-green-500 md:hidden flex-shrink-0" />
            )}
          </div>
        </div>

        <Button
          variant="default"
          onClick={onNext}
          disabled={false}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
        >
          {/* hide on mobile */}
          <span className="hidden md:block">
            {section.nextSection ? "完成並繼續課程" : "完成課程"}
          </span>
          {/* <span className="md:hidden">
            {section.nextSection ? "下一個" : "完成"}
          </span> */}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Video Player Slot */}
      {children}

      {/* Content */}
      <div className="hidden md:block p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">章節說明</h3>
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default SectionContent;
