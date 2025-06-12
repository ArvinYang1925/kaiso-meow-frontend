import React from "react";
import { ChevronRight, PlayCircle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { CourseSection } from "@/types/course";

interface CourseSidebarProps {
  courseTitle: string;
  currentSectionId: string;
  sections: CourseSection[];
  onSectionClick: (sectionId: string) => void;
  progress: {
    completedSections: number;
    totalSections: number;
    percentage: number;
  };
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  courseTitle,
  currentSectionId,
  sections,
  onSectionClick,
  progress,
}) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-900 mb-2">
          {courseTitle}
        </h1>
        <div className="text-sm text-gray-600 mb-3">
          {progress.percentage}% 課程進度
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-sm font-medium text-gray-900 mb-4">章節列表</h2>

          {/* Course sections from API */}
          <div className="space-y-1">
            {sections.length > 0 ? (
              sections.map((section) => (
                <SectionItem
                  key={section.id}
                  title={section.title}
                  isActive={section.id === currentSectionId}
                  isCompleted={section.isCompleted}
                  onClick={() => onSectionClick(section.id)}
                />
              ))
            ) : (
              <div className="text-sm text-gray-500 text-center py-8">
                載入課程章節中...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface SectionItemProps {
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  isHighlighted?: boolean;
  onClick: () => void;
}

const SectionItem: React.FC<SectionItemProps> = ({
  title,
  isActive,
  isCompleted,
  isHighlighted = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm transition-colors",
        isActive && "bg-orange-50 text-orange-600",
        !isActive && !isHighlighted && "text-gray-700 hover:bg-gray-50",
        isHighlighted && !isActive && "bg-orange-100 border border-orange-200"
      )}
    >
      <div className="flex-shrink-0">
        {isCompleted ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : isActive ? (
          <PlayCircle className="w-5 h-5 text-orange-500" />
        ) : (
          <Clock className="w-5 h-5 text-gray-400" />
        )}
      </div>
      <span className="flex-1">{title}</span>
      {isActive && <ChevronRight className="w-4 h-4 text-orange-500" />}
    </button>
  );
};

export default CourseSidebar;
