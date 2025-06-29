import Modal from "@/components/common/Modal";
import { useSectionManagementStore } from "../store/sectionManagementStore";
import { useEffect, useState } from "react";
import { handleErrorMessageDialog } from "@/lib/helper";
import UploadVideoDropzoneSection from "./UploadVideoDropzoneSection";
import { useDialogStore } from "@/stores/commonDialogStore";
import { useParams } from "react-router-dom";

const EditVideoModal = () => {
  const {
    isShowEditVideoModal,
    section,
    setIsShowEditVideoModal,
    setVideoFileName,
    deleteVideo,
    fetchSectionList,
  } = useSectionManagementStore();

  const { showCommonDialog } = useDialogStore();

  const [dropzoneKey, setDropzoneKey] = useState(0);
  const { courseId } = useParams();

  const handleDeleteVideo = async (sectionId: string) => {
    if (!courseId) return;
    try {
      await deleteVideo(sectionId);
      showCommonDialog({
        type: "success",
        message: "影片已刪除",
      });
      fetchSectionList(courseId);
    } catch (error) {
      handleErrorMessageDialog(error);
    }
  };

  useEffect(() => {
    if (isShowEditVideoModal) {
      setVideoFileName("");
      setDropzoneKey((prev) => prev + 1); // 每次開啟 modal 就更新 key
    }
  }, [isShowEditVideoModal]);

  return (
    <>
      <Modal
        isOpen={isShowEditVideoModal}
        onClose={() => setIsShowEditVideoModal(false)}
        title="更新影片"
        size="xl" // md | lg | full
      >
        <div className="px-2 py-6">
          {/* 上傳影片元件 */}
          <UploadVideoDropzoneSection key={dropzoneKey} />
          {/* 刪除影片區塊 */}
          <div className="border-t pt-4 mt-4">
            <p className="mb-3 text-gray-600">
              章節名稱: <span className="font-medium">{section.title}</span>
            </p>
            <button
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
              onClick={() => handleDeleteVideo(section.id)}
              type="button"
            >
              刪除此章節影片
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditVideoModal;
