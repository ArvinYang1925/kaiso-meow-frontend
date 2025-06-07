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
          <h2 className="text-sm font-medium text-gray-900 mb-4">課程內容</h2>

          {/* Chapter sections */}
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-900 mb-2">
              第1章：介紹與環境建置
            </div>
            <div className="pl-4 space-y-1 mb-4">
              <SectionItem
                title="元件 (Component) 的基本建立"
                isActive={false}
                isCompleted={true}
                onClick={() => {}}
              />
              <SectionItem
                title="Props：組件之間的資料傳遞"
                isActive={true}
                isCompleted={false}
                onClick={() => {}}
                isHighlighted
              />
              <SectionItem
                title="狀態 (State) 與 useState Hook"
                isActive={false}
                isCompleted={false}
                onClick={() => {}}
              />
              <SectionItem
                title="事件處理與表單式綁定"
                isActive={false}
                isCompleted={false}
                onClick={() => {}}
              />
            </div>

            <div className="text-sm font-medium text-gray-900 mb-2">
              第2章：React 基礎
            </div>
            <div className="pl-4 space-y-1 mb-4">
              {sections.map((section) => (
                <SectionItem
                  key={section.id}
                  title={section.title}
                  isActive={section.id === currentSectionId}
                  isCompleted={section.isCompleted}
                  onClick={() => onSectionClick(section.id)}
                />
              ))}
            </div>

            <div className="text-sm font-medium text-gray-900 mb-2">
              第3章：React 進階：組件生命週期
            </div>
            <div className="pl-4 space-y-1 mb-4">
              <SectionItem
                title="React Router 基礎與安裝"
                isActive={false}
                isCompleted={false}
                onClick={() => {}}
              />
              <SectionItem
                title="處理頁面 404 頁面設定"
                isActive={false}
                isCompleted={false}
                onClick={() => {}}
                isHighlighted
              />
              <SectionItem
                title="程式碼瀏覽精 (Programmatic Navigation)"
                isActive={false}
                isCompleted={false}
                onClick={() => {}}
              />
            </div>

            <div className="text-sm font-medium text-gray-900 mb-2">
              第4章：表單處理與驗證
            </div>

            <div className="text-sm font-medium text-gray-900 mb-2">
              第5章：React 路由管理
            </div>

            <div className="text-sm font-medium text-gray-900 mb-2">
              第6章：狀態管理工具 Redux
            </div>
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
