import { useEffect, useMemo, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { VideoStatusModal } from "./components/VideoStatusModal";
import AiSectionGeneratorModal from "./components/AiSectionGeneratorModal";
import { useScreenLoading } from "@/components/common/useScreenLoading";

export default function SectionManagementPage() {
  const { courseId } = useParams();
  const { showCommonDialog } = useDialogStore();

  // 全螢幕 Loading
  const { ScreenLoading, withLoading } = useScreenLoading();
  const [isPageInitialized, setIsPageInitialized] = useState(false);

  const {
    isLoading,
    isShowVideoStatusModal,
    sectionList,
    currentSectionId,
    fetchSectionList,
    deleteSection,
    updateSectionPublishedStatus,
    updateSectionOrder,
    fetchVideoStatus,
    setSectionList,
    setCurrentSection,
    setIsShowCreateSectionModal,
    setIsShowUpdateSectionModal,
    setIsShowUploadVideoModal,
    setIsShowEditVideoModal,
    setIsShowVideoStatusModal,
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
      if (error instanceof axios.AxiosError) {
        showCommonDialog({
          title: "章節狀態",
          description: `${error?.response?.data.message}`,
        });
      }
    }
  };

  /** 取得影片轉檔狀態 */
  const handleFetchVideoStatus = async (sectionId: string) => {
    try {
      const response = await fetchVideoStatus(sectionId);
      const { uploadStatus, videoUrl } = response || {};
      showCommonDialog({
        title: `影片轉檔狀態：${uploadStatus ?? ""}`,
        description: `${videoUrl ?? ""}`,
      });
    } catch (error) {
      handleErrorMessageDialog(error);
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
      const initializePage = async () => {
        setIsPageInitialized(false);
        try {
          await withLoading(
            () => fetchSectionList(courseId),
            "正在載入章節列表..."
          );
        } finally {
          setIsPageInitialized(true);
        }
      };

      initializePage();
    }
  }, [courseId, fetchSectionList, withLoading]);

  const shouldShowContent = isPageInitialized;

  return (
    <>
      {/* 全螢幕 Loading */}
      <ScreenLoading />

      <div className="w-full max-w-full">
        <div className="p-2 xs:p-3 sm:p-6 w-full max-w-full box-border">
          <h1 className="text-lg xs:text-xl sm:text-2xl font-bold mb-2">
            章節管理
          </h1>
          {shouldShowContent && sectionList.length > 0 && (
            <p className="text-xs xs:text-sm sm:text-base text-slate-500">
              總計：{sectionList.length} 個章節
            </p>
          )}

          {shouldShowContent && sectionList.length == 0 && !isLoading ? (
            <InitialPageComponent isLoading={isLoading} />
          ) : (
            shouldShowContent && (
              <>
                <div className="flex justify-end items-center mb-3 xs:mb-4 sm:mb-6">
                  <Button
                    onClick={() => setIsShowCreateSectionModal(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto text-sm xs:text-base"
                  >
                    <Plus className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
                    <span className="hidden xs:inline">新增章節</span>
                    <span className="xs:hidden">新增</span>
                  </Button>
                </div>
                <Card className="p-2 xs:p-3 sm:p-6 w-full max-w-full overflow-hidden box-border">
                  <div className="space-y-2 xs:space-y-4 sm:space-y-6 w-full max-w-full">
                    <div className="space-y-2 xs:space-y-3 sm:space-y-4 w-full max-w-full">
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
                            className="border rounded-lg p-1.5 xs:p-2 sm:p-4 bg-white mb-2 xs:mb-3 sm:mb-4 shadow w-full max-w-full overflow-hidden box-border"
                          >
                            {/* 手機版：雙列佈局，桌機版：單列水平佈局 */}
                            <div className="flex flex-col gap-2 xs:gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-0 w-full max-w-full">
                              {/* 第一列：拖曳手柄、狀態切換、標題、第一個操作按鈕 */}
                              <div className="flex items-center justify-between sm:gap-3 flex-1 min-w-0 w-full max-w-full px-0.5 xs:px-1 sm:px-0">
                                {/* 左側：拖曳手柄、狀態切換、標題 */}
                                <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-3 flex-1 min-w-0 overflow-hidden pr-2">
                                  {/* 拖曳手柄 */}
                                  <div
                                    className="cursor-move p-0.5 xs:p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
                                    title="更新章節順序"
                                  >
                                    <GripVertical className="h-3 w-3 xs:h-4 xs:w-4" />
                                  </div>

                                  <div className="flex flex-col me-0.5 xs:me-1 flex-shrink-0">
                                    <span
                                      className={`text-xs leading-tight ${
                                        section.isPublished
                                          ? "text-green-500"
                                          : "text-slate-500"
                                      }`}
                                    >
                                      {section.isPublished
                                        ? "已發布"
                                        : "未發布"}
                                    </span>
                                    <Switch
                                      id="publish-toggle"
                                      checked={section.isPublished}
                                      onCheckedChange={() =>
                                        handleUpdatePublishedStatus(
                                          section.id,
                                          section.isPublished
                                        )
                                      }
                                      disabled={isLoading}
                                      className="scale-[0.6] xs:scale-75 data-[state=checked]:bg-green-500 bg-slate-300"
                                    />
                                  </div>
                                  <h3 className="font-medium text-xs xs:text-sm sm:text-base flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                                    {section.title}
                                  </h3>
                                </div>

                                {/* 右側：第一個操作按鈕（手機版顯示，桌機版隱藏） */}
                                <div className="flex sm:hidden items-center flex-shrink-0">
                                  {/* 影片轉檔狀態圖標 */}
                                  <button
                                    title="取得影片轉檔狀態"
                                    onClick={() => {
                                      if (!courseId) return;
                                      handleFetchVideoStatus(section.id);
                                      fetchSectionList(courseId);
                                    }}
                                    className="p-0.5 xs:p-1 min-w-0"
                                  >
                                    <CloudUpload
                                      className={clsx("h-3 w-3 xs:h-4 xs:w-4", {
                                        "text-indigo-500": /^https?:\/\//.test(
                                          section.videoUrl || ""
                                        ),
                                        "text-slate-400": !/^https?:\/\//.test(
                                          section.videoUrl || ""
                                        ),
                                      })}
                                    />
                                  </button>
                                </div>
                              </div>

                              {/* 第二列：其餘操作按鈕（手機版顯示，桌機版隱藏） */}
                              <div className="flex gap-2 sm:hidden items-center pl-7 xs:pl-8">
                                {/* 上傳/更新影片圖標 */}
                                <button
                                  title={
                                    section.videoUrl == null
                                      ? "上傳影片"
                                      : "更新影片"
                                  }
                                  onClick={() => {
                                    if (section.videoUrl == null) {
                                      setIsShowUploadVideoModal(true);
                                    } else {
                                      setIsShowEditVideoModal(true);
                                    }
                                    setCurrentSection(section);
                                  }}
                                  className="p-0.5 xs:p-1 min-w-0"
                                >
                                  <Upload className="h-3 w-3 xs:h-4 xs:w-4 text-slate-600" />
                                </button>

                                {/* 編輯圖標 */}
                                <button
                                  title="編輯章節內容"
                                  onClick={() => handleOpenUpdateModal(section)}
                                  className="p-0.5 xs:p-1 min-w-0"
                                >
                                  <Pencil className="h-3 w-3 xs:h-4 xs:w-4 text-slate-600" />
                                </button>

                                {/* 刪除圖標 */}
                                <button
                                  title="刪除章節"
                                  onClick={() =>
                                    handleDeleteSection(section.id)
                                  }
                                  className="p-0.5 xs:p-1 min-w-0"
                                >
                                  <Trash2 className="h-3 w-3 xs:h-4 xs:w-4 text-slate-600" />
                                </button>
                              </div>

                              {/* 第二列：操作按鈕群組（桌機版顯示，手機版隱藏） */}
                              <div className="hidden sm:flex gap-3">
                                <Button
                                  variant="ghost"
                                  size="default"
                                  title="取得影片轉檔狀態"
                                  onClick={() => {
                                    if (!courseId) return;
                                    handleFetchVideoStatus(section.id);
                                    fetchSectionList(courseId);
                                  }}
                                >
                                  <CloudUpload
                                    className={clsx("h-6 w-6", {
                                      "text-indigo-500": /^https?:\/\//.test(
                                        section.videoUrl || ""
                                      ),
                                      "text-slate-400": !/^https?:\/\//.test(
                                        section.videoUrl || ""
                                      ),
                                    })}
                                  />
                                </Button>

                                {section.videoUrl == null ? (
                                  <Button
                                    variant="outline"
                                    size="default"
                                    title="上傳影片"
                                    onClick={() => {
                                      setIsShowUploadVideoModal(true);
                                      setCurrentSection(section);
                                    }}
                                  >
                                    <Upload className="h-4 w-4 me-1" /> 上傳影片
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="default"
                                    title="更新影片"
                                    onClick={() => {
                                      setIsShowEditVideoModal(true);
                                      setCurrentSection(section);
                                    }}
                                  >
                                    <Upload className="h-4 w-4 me-1" /> 更新影片
                                  </Button>
                                )}

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
                                  onClick={() =>
                                    handleDeleteSection(section.id)
                                  }
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
            )
          )}
          {/* AI 章節快手 modal */}
          <AiSectionGeneratorModal />
          {/* 新增與編輯章節 modal */}
          <CreateSectionModal />
          <UpdateSectionModal />
          {/* 新增與編輯影片 modal */}
          <UploadVideoModal />
          <EditVideoModal />
          {/* 影片狀態 modal */}
          <VideoStatusModal
            isOpen={isShowVideoStatusModal}
            onClose={() => setIsShowVideoStatusModal(false)}
            sectionId={currentSectionId}
            autoCloseOnComplete={true}
          />
        </div>
      </div>
    </>
  );
}
