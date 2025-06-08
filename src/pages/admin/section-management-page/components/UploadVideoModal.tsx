import Modal from "@/components/common/Modal";
import { useSectionManagementStore } from "../store/sectionManagementStore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import UploadVideoDropzoneSection from "./UploadVideoDropzoneSection";

const UploadVideoModal = () => {
  const {
    isShowUploadVideoModal,
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
        <UploadVideoDropzoneSection key={dropzoneKey} />
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
