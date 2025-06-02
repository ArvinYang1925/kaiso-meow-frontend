import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useBreadcrumbStore } from "@/stores/breadcrumbStore";
import { ReactSortable } from "react-sortablejs";
import { useSectionManagementStore } from "./store/sectionManagementStore";
import { SectionOrder } from "./services/type";

export default function SectionManagementPage() {
  const { courseId } = useParams();
  const location = useLocation();
  const { setBreadcrumbs } = useBreadcrumbStore();

  const { isLoading, section, sectionList, fetchSectionList, setSectionList } =
    useSectionManagementStore();
  //courseId a1315061-ab3a-4e4d-b553-13cc125ecb10

  // 做 shallow copy，避免傳入 immer readonly proxy
  const mutableItems = useMemo(
    () => structuredClone(sectionList),
    [sectionList]
  );

  useEffect(() => {
    //取章節資料
    console.log("courseId", courseId);
    if (courseId) {
      fetchSectionList(courseId);
    }

    // TODO: 從 API 獲取章節列表和課程資訊
    const mockCourseInfo = {
      title: "React 入門課程",
    };

    // 設置麵包屑
    setBreadcrumbs(location.pathname, {
      courseId,
      courseName: mockCourseInfo.title,
    });
  }, [courseId, location.pathname, setBreadcrumbs]);

  const sendUpdateOrderRequest = (data: SectionOrder[]) => {
    console.log("發了api, 資料：", data);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">章節管理</h1>
        <Button onClick={() => true}>
          <Plus className="w-4 h-4 mr-2" />
          新增章節
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <ReactSortable
              tag="ul"
              list={mutableItems}
              // setList={(newList) => setSectionList(newList)} // 單純更新畫面
              setList={() => {}} // 不讓 Sortable 自動改 state，統一交給 onEnd 處理
              animation={1000}
              ghostClass="ghost" // 拖曳時顯示的佔位樣式
              chosenClass="chosen" // 被拖曳中的項目
              onEnd={(evt) => {
                const updated = [...mutableItems];
                const [moved] = updated.splice(evt.oldIndex!, 1);
                updated.splice(evt.newIndex!, 0, moved);

                setSectionList(updated);

                // 自訂 payload
                const payload = updated.map((item, index) => ({
                  id: item.id,
                  order: index + 1,
                }));

                sendUpdateOrderRequest(payload);
              }}
            >
              {mutableItems.map((section) => (
                <li
                  key={section.id}
                  className="border rounded-lg p-4 bg-white mb-4 shadow"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{section.title}</h3>
                      {/* <p className="text-sm text-gray-500">
                        {chapter.content}
                      </p> */}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        // onClick={() => handleDeleteSection(section.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ReactSortable>
          </div>
        </div>
      </Card>
    </div>
  );
}
