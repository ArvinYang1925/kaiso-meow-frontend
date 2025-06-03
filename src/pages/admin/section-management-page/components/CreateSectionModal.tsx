import Modal from "@/components/common/Modal";
import { useSectionManagementStore } from "../store/sectionManagementStore";
import ReactQuill from "react-quill";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { handleErrorMessageDialog } from "@/lib/helper";
import { useDialogStore } from "@/stores/commonDialogStore";

const CreateSectionModal = () => {
  const {
    isShowCreateSectionModal,
    setIsShowCreateSectionModal,
    createSection,
    fetchSectionList,
  } = useSectionManagementStore();

  const { showCommonDialog } = useDialogStore();

  const { courseId } = useParams();
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionContent, setSectionContent] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!courseId) return;
    if (sectionTitle == "") {
      showCommonDialog({
        title: "新增失敗",
        description: "章節標題不得為空",
      });
      return;
    }
    e.preventDefault();

    const reqData = {
      title: sectionTitle,
      content: sectionContent,
    };

    try {
      await createSection(courseId, reqData);
      setIsShowCreateSectionModal(false);
      fetchSectionList(courseId);
    } catch (error) {
      handleErrorMessageDialog(error);
    }
  };

  useEffect(() => {
    if (isShowCreateSectionModal) {
      setSectionTitle("");
      setSectionContent("");
    }
  }, [isShowCreateSectionModal]);

  return (
    <Modal
      isOpen={isShowCreateSectionModal}
      onClose={() => setIsShowCreateSectionModal(false)}
      title="新增章節"
      size="xl" // md | lg | full
    >
      <form className="px-2 py-1" onSubmit={handleSubmit}>
        <label
          htmlFor="section-title"
          className="block text-sm font-medium text-slate-900 mb-2"
        >
          章節標題
        </label>
        <input
          type="text"
          name="title"
          id="section-title"
          value={sectionTitle}
          onChange={(e) => {
            setSectionTitle(e.target.value);
          }}
          className={`mb-6 appearance-none block w-full px-3 pr-10 h-[40px] border placeholder-slate-400 text-gray-900 rounded-md focus:outline-none focus:border-slate-500 sm:text-sm`}
          placeholder="請輸入章節標題"
        />
        <label
          htmlFor="section-title"
          className="block text-sm font-medium text-slate-900 mb-2"
        >
          章節內容
        </label>
        <ReactQuill value={sectionContent} onChange={setSectionContent} />
        <div className="btn-wrap flex justify-end mt-4">
          <Button
            type="button"
            className="me-2"
            onClick={() => setIsShowCreateSectionModal(false)}
          >
            關閉
          </Button>
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500">
            新增章節
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateSectionModal;
