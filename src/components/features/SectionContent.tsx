import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Section } from "@/types/course";

interface SectionContentProps {
  section: Section;
  onPrevious?: () => void;
  onNext?: () => void;
}

const SectionContent: React.FC<SectionContentProps> = ({
  section,
  onPrevious,
  onNext,
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
          上一課程
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
          下一課程
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Content Tabs */}
      <div className="p-6">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">學習資源</TabsTrigger>
            <TabsTrigger value="materials">課程講義</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">章節說明</h3>
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>
          </TabsContent>

          <TabsContent value="materials" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">課程講義</h3>
              <div className="grid gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">課程簡報</h4>
                      <p className="text-sm text-gray-500">PDF • 2.4 MB</p>
                    </div>
                    <Button variant="outline" size="sm">
                      下載
                    </Button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">練習檔案</h4>
                      <p className="text-sm text-gray-500">ZIP • 1.8 MB</p>
                    </div>
                    <Button variant="outline" size="sm">
                      下載
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SectionContent;
