import Modal from "@/components/common/Modal";
import { useSectionManagementStore } from "../store/sectionManagementStore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { handleErrorMessageDialog } from "@/lib/helper";
import { X } from "lucide-react";

const AiSectionGeneratorModal = () => {
  const {
    isLoading,
    aiSectionList,
    isShowAiSectionGeneratorModal,
    setAiDraftSection,
    addAiDraftSection,
    removeAiDraftSection,
    setIsShowAiSectionGeneratorModal,
    createAiSectionsDraft,
    batchCreateSection,
    clearAiSectionList,
  } = useSectionManagementStore();

  const [description, setDescription] = useState("");
  const [expectedSectionCount, setExpectedSectionCount] = useState("");
  const [sectionIdea, setSectionIdea] = useState("");
  const [isShowSectionDraftArea, setIsShowSectionDraftArea] = useState(true);
  const [isShowBatchUpdateDraftArea, setIsShowBatchUpdateDraftArea] =
    useState(false);

  const { courseId } = useParams();

  const handleSubmitAiSectionDraft = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!courseId) return;

    const reqData = {
      description,
      expectedSectionCount: Number(expectedSectionCount),
      sectionIdea: "請給我中文的內容" + sectionIdea,
    };
    console.log("送出資料:", courseId, reqData);

    try {
      await createAiSectionsDraft(courseId, reqData);
      //關閉輸入章節內容的表格
      setIsShowSectionDraftArea(false);

      //顯示批次上傳介面
      setIsShowBatchUpdateDraftArea(true);
    } catch (error) {
      //顯示輸入章節內容的表格
      setIsShowSectionDraftArea(true);

      //關閉批次上傳介面
      setIsShowBatchUpdateDraftArea(false);
      if (error instanceof AxiosError) {
        handleErrorMessageDialog(error);
      }
    }
  };

  //批次新增
  const handleBatchSections = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!courseId) return;

    try {
      await batchCreateSection(courseId, aiSectionList);
      setIsShowAiSectionGeneratorModal(false);
      clearAiSectionList();
    } catch (error) {
      clearAiSectionList();
      if (error instanceof AxiosError) {
        handleErrorMessageDialog(error);
      }
    }
  };

  useEffect(() => {
    if (isShowAiSectionGeneratorModal) {
      //顯示輸入章節內容的表格
      setIsShowSectionDraftArea(true);
      //關閉批次上傳介面
      setIsShowBatchUpdateDraftArea(false);
      setDescription("");
      setExpectedSectionCount("");
      setSectionIdea("");
    }
  }, [isShowAiSectionGeneratorModal]);

  return (
    <Modal
      isOpen={isShowAiSectionGeneratorModal}
      onClose={() => setIsShowAiSectionGeneratorModal(false)}
      title="AI 章節快手"
      size="xl" // md | lg | full
    >
      {isShowSectionDraftArea && (
        <form onSubmit={handleSubmitAiSectionDraft}>
          <div className="mb-6">
            <label
              htmlFor="course-content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              課程大綱
            </label>
            <textarea
              id="course-content"
              name="course-content"
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-transparent"
              placeholder="請描述課程大綱，例如：這是一門從零開始學習 Node.js 的課程..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            ></textarea>
          </div>

          <div className="mb-6">
            <label
              htmlFor="expected-section-count"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              預期章節數量
            </label>
            <input
              type="number"
              min={0}
              id="expected-section-count"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-transparent"
              placeholder="可為空"
              value={expectedSectionCount}
              onChange={(e) => setExpectedSectionCount(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="mb-8">
            <label
              htmlFor="section-content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              章節綱要
            </label>
            <textarea
              id="section-content"
              name="section-content"
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-transparent"
              placeholder="請簡述您對章節進度的構想，例如：第1~2章為環境建置..."
              value={sectionIdea}
              onChange={(e) => setSectionIdea(e.target.value)}
              disabled={isLoading}
            ></textarea>
          </div>

          <div className="btn-wrap flex">
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white w-full px-4 py-2 rounded-lg text-sm"
              disabled={isLoading || description == ""}
            >
              {isLoading ? "章節產生中..." : "產生章節建議"}
            </Button>
          </div>
        </form>
      )}
      {isShowBatchUpdateDraftArea && (
        <form onSubmit={handleBatchSections} className="space-y-4">
          <div className="btn-wrap flex justify-end">
            <Button type="button" onClick={addAiDraftSection}>
              新增單一章節草稿
            </Button>
          </div>
          {aiSectionList.map((section, index) => (
            <div
              key={index}
              className="relative border border-gray-200 p-4 rounded-lg shadow-sm"
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  章節標題
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                  value={section.title}
                  onChange={(e) =>
                    setAiDraftSection(index, "title", e.target.value)
                  }
                  placeholder="請輸入章節標題"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  章節內容
                </label>
                <textarea
                  rows={5}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                  value={section.content}
                  onChange={(e) =>
                    setAiDraftSection(index, "content", e.target.value)
                  }
                  placeholder="請輸入章節內容"
                ></textarea>
              </div>

              <button
                type="button"
                onClick={() => removeAiDraftSection(index)}
                className="absolute top-2 right-2 text-sm text-red-600 hover:underline"
              >
                <X className="h-8 w-8" />
              </button>
            </div>
          ))}

          <div className="btn-wrap flex">
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto px-6 py-2 rounded text-sm"
            >
              批次建立 AI 章節
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AiSectionGeneratorModal;
