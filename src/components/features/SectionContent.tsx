import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Section } from "@/types/course";

interface SectionContentProps {
  section: Section;
  onPrevious?: () => void;
  onNext?: () => void;
  children?: React.ReactNode;
}

const SectionContent: React.FC<SectionContentProps> = ({
  section,
  onPrevious,
  onNext,
  children,
}) => {
  return (
    <div className="bg-white">
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

        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {section.title}
          </h2>
        </div>

        <Button
          variant="default"
          onClick={onNext}
          disabled={!section.nextSection}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
        >
          {/* hide on mobile */}
          <span className="hidden md:block">完成並繼續課程</span>
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
