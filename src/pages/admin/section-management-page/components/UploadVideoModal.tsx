import Modal from "@/components/common/Modal";
import { useSectionManagementStore } from "../store/sectionManagementStore";
import { useEffect, useState } from "react";
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
      </div>
    </Modal>
  );
};

export default UploadVideoModal;
