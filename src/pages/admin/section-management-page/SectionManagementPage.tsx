import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useBreadcrumbStore } from "@/stores/breadcrumbStore";
import { ReactSortable } from "react-sortablejs";

type Chapter = {
  id: string;
  title: string;
  content: string;
  order: number;
}

type ChapterOrder = {
  id: string;
  order: number;
}

export default function SectionManagementPage() {
  const { courseId } = useParams();
  const location = useLocation();
  const { setBreadcrumbs } = useBreadcrumbStore();
  const [isLoading, setIsLoading] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  console.log("chapters new data", chapters);

  const [isAdding, setIsAdding] = useState(false);
  const [newChapter, setNewChapter] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    // TODO: 從 API 獲取章節列表和課程資訊
    const mockCourseInfo = {
      title: "React 入門課程",
    };

    // 設置麵包屑
    setBreadcrumbs(location.pathname, {
      courseId,
      courseName: mockCourseInfo.title,
    });

    // 模擬章節數據
    setChapters([
      {
        id: "section_1",
        title: "第一章：課程介紹",
        content: "本章節介紹課程的基本內容",
        order: 1,
      },
      {
        id: "section_2",
        title: "第二章：課程介紹",
        content: "本章節介紹課程的基本內容",
        order: 2,
      },
      {
        id: "section_3",
        title: "第三章：課程介紹",
        content: "本章節介紹課程的基本內容",
        order: 3,
      },
      {
        id: "section_4",
        title: "第四章：課程介紹",
        content: "本章節介紹課程的基本內容",
        order: 4,
      },
    ]);
  }, [courseId, location.pathname, setBreadcrumbs]);

  const handleAddChapter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: 實現新增章節邏輯
      console.log("新增章節:", newChapter);
      setIsAdding(false);
      setNewChapter({ title: "", description: "" });
    } catch (error) {
      console.error("新增章節失敗:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!window.confirm("確定要刪除這個章節嗎？")) return;

    setIsLoading(true);
    try {
      // TODO: 實現刪除章節邏輯
      console.log("刪除章節:", chapterId);
    } catch (error) {
      console.error("刪除章節失敗:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendUpdateOrderRequest = (data: ChapterOrder[]) => {
    console.log("發了api, 資料：", data);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">章節管理</h1>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 mr-2" />
          新增章節
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {isAdding && (
            <form onSubmit={handleAddChapter} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chapterTitle">章節標題</Label>
                <Input
                  id="chapterTitle"
                  value={newChapter.title}
                  onChange={(e) =>
                    setNewChapter({ ...newChapter, title: e.target.value })
                  }
                  placeholder="請輸入章節標題"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chapterDescription">章節描述</Label>
                <Input
                  id="chapterDescription"
                  value={newChapter.description}
                  onChange={(e) =>
                    setNewChapter({
                      ...newChapter,
                      description: e.target.value,
                    })
                  }
                  placeholder="請輸入章節描述"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAdding(false)}
                >
                  取消
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "新增中..." : "新增"}
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            <ReactSortable
              tag="ul"
              list={chapters}
              setList={(newList) => setChapters(newList)} // 單純更新畫面
              animation={1000}
              ghostClass="ghost" // 拖曳時顯示的佔位樣式
              chosenClass="chosen" // 被拖曳中的項目
              onEnd={(evt) => {
                const updated = [...chapters];
                const [moved] = updated.splice(evt.oldIndex!, 1);
                updated.splice(evt.newIndex!, 0, moved);

                setChapters(updated);

                // 自訂 payload
                const payload = updated.map((item, index) => ({
                  id: item.id,
                  order: index + 1,
                }));

                sendUpdateOrderRequest(payload);
              }}
            >
              {chapters.map((chapter) => (
                <li
                  key={chapter.id}
                  className="border rounded-lg p-4 bg-white mb-4 shadow"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{chapter.title}</h3>
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
                        onClick={() => handleDeleteChapter(chapter.id)}
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
