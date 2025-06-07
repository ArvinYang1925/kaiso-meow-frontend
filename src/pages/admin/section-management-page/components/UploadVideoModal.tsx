import Modal from "@/components/common/Modal";
import { useSectionManagementStore } from "../store/sectionManagementStore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import UploadVideoDropzoneSection from "./UploadVideoDropzoneSection";

const UploadVideoModal = () => {
  const {
    isShowUploadVideoModal,
    videoFileName,
    isLoading,
    setIsShowUploadVideoModal,
    setVideoFileName,
  } = useSectionManagementStore();

  const [dropzoneKey, setDropzoneKey] = useState(0);

  useEffect(() => {
    if (isShowUploadVideoModal) {
      setVideoFileName("");
      setDropzoneKey((prev) => prev + 1); // 每次開啟 modal 就更新 key
    }
  }, [isShowUploadVideoModal]);

  return (
    <Modal
      isOpen={isShowUploadVideoModal}
      onClose={() => setIsShowUploadVideoModal(false)}
      title="上傳影片"
      size="xl" // md | lg | full
    >
      <div className="px-2 py-6">
        {!isLoading && videoFileName == "" ? (
          <UploadVideoDropzoneSection key={dropzoneKey} />
        ) : (
          <div className="flex items-center gap-3 p-4 bg-yellow-50 text-yellow-800 rounded-xl shadow-sm border border-yellow-200 animate-pulse">
            <LoaderCircle className="w-5 h-5 animate-spin text-yellow-500" />
            <p className="text-sm font-medium">
              {videoFileName} 正在上傳中，請稍候...
            </p>
          </div>
        )}
        <div className="btn-wrap flex justify-end mt-4">
          <Button
            type="button"
            className="px-6"
            onClick={() => setIsShowUploadVideoModal(false)}
          >
            關閉
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UploadVideoModal;
