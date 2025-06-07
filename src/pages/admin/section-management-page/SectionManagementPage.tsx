import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Pencil,
  Trash2,
  CloudUpload,
  GripVertical,
  Upload,
} from "lucide-react";
import { ReactSortable } from "react-sortablejs";
import { useSectionManagementStore } from "./store/sectionManagementStore";
import { Section, SectionOrder } from "./services/type";
import CreateSectionModal from "./components/CreateSectionModal";
import UpdateSectionModal from "./components/UpdateSectionModal";
import InitialPageComponent from "./components/InitialPageComponent";
import clsx from "clsx";
import { handleErrorMessageDialog } from "@/lib/helper";
import { useDialogStore } from "@/stores/commonDialogStore";
import UploadVideoModal from "./components/UploadVideoModal";
import EditVideoModal from "./components/EditVideoModal";

export default function SectionManagementPage() {
  const { courseId } = useParams();
  const { showCommonDialog } = useDialogStore();

  const {
    isLoading,
    sectionList,
    fetchSectionList,
    deleteSection,
    updateSectionPublishedStatus,
    updateSectionOrder,
    setSectionList,
    setCurrentSection,
    setIsShowCreateSectionModal,
    setIsShowUpdateSectionModal,
    setIsShowUploadVideoModal,
    // setIsShowEditVideoModal,
  } = useSectionManagementStore();

  // 做 shallow copy，避免傳入 immer readonly proxy
  const mutableItems = useMemo(
    () => structuredClone(sectionList),
    [sectionList]
  );

  /** 更新章節狀態 */
  const handleUpdatePublishedStatus = async (
    sectionId: string,
    isPublished: boolean
  ) => {
    if (!courseId) return;
    const reqData = {
      isPublished: !isPublished,
    };

    try {
      await updateSectionPublishedStatus(sectionId, reqData);
      fetchSectionList(courseId);
      showCommonDialog({
        title: "章節狀態",
        description: reqData.isPublished ? "已發布" : "已取消發布",
      });
    } catch (error) {
      handleErrorMessageDialog(error);
    }
  };

  /** 刪除章節 */
  const handleDeleteSection = async (sectionId: string) => {
    if (!courseId) return;
    try {
      await deleteSection(sectionId);
      showCommonDialog({
        title: "章節狀態",
        description: "章節已刪除",
      });
      fetchSectionList(courseId);
    } catch (error) {
      handleErrorMessageDialog(error);
    }
  };

  /** 更新章節順序 */
  const sendUpdateOrderRequest = async (data: SectionOrder[]) => {
    if (!courseId) return;
    try {
      await updateSectionOrder(courseId, data);
      showCommonDialog({
        title: "章節狀態",
        description: "章節順序已變更",
      });
    } catch (error) {
      console.error("Drag end error:", error);
      //先還原更新順序
      setSectionList(mutableItems);
      showCommonDialog({
        title: "章節狀態",
        description: "章節順序更新錯誤，請稍後再試",
      });
    }
  };

  const handleOpenUpdateModal = (section: Section) => {
    setCurrentSection(section);
    setIsShowUpdateSectionModal(true);
  };

  useEffect(() => {
    //以課程id，取得章節資料
    console.log("courseId", courseId);
    if (courseId) {
      fetchSectionList(courseId);
    }
  }, [courseId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">章節管理</h1>
      {sectionList.length == 0 && !isLoading ? (
        <InitialPageComponent />
      ) : (
        <>
          <div className="flex justify-end items-center mb-6">
            <Button onClick={() => setIsShowCreateSectionModal(true)}>
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
                  handle=".cursor-move"
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
                        <div className="flex items-center gap-3">
                          {/* 拖曳手柄 */}
                          <div
                            className="cursor-move p-1 text-gray-400 hover:text-gray-600"
                            title="更新章節順序"
                          >
                            <GripVertical className="h-4 w-4" />
                          </div>

                          <Button
                            variant="ghost"
                            size="default"
                            title="變更章節發布狀態"
                            onClick={() =>
                              handleUpdatePublishedStatus(
                                section.id,
                                section.isPublished
                              )
                            }
                          >
                            <CloudUpload
                              className={clsx("h-6 w-6", {
                                "text-indigo-500": section.isPublished,
                                "text-slate-400": !section.isPublished,
                              })}
                            />
                          </Button>
                          <h3 className="font-medium">{section.title}</h3>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            title="上傳影片"
                            onClick={() => {
                              setIsShowUploadVideoModal(true);
                              setCurrentSection(section)
                            }}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            title="編輯章節內容"
                            onClick={() => handleOpenUpdateModal(section)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            title="刪除章節"
                            onClick={() => handleDeleteSection(section.id)}
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
        </>
      )}
      {/* 新增與編輯章節 modal */}
      <CreateSectionModal />
      <UpdateSectionModal />
      {/* 新增與編輯影片 modal */}
      <UploadVideoModal />
      <EditVideoModal />
    </div>
  );
}
