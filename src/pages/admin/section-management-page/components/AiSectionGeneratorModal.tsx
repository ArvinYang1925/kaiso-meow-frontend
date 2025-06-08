import Modal from "@/components/common/Modal";
import { useSectionManagementStore } from "../store/sectionManagementStore";

const AiSectionGeneratorModal = () => {
  const { isShowAiSectionGeneratorModal, setIsShowAiSectionGeneratorModal } =
    useSectionManagementStore();

  return (
    <Modal
      isOpen={isShowAiSectionGeneratorModal}
      onClose={() => setIsShowAiSectionGeneratorModal(false)}
      title="AI 章節快手"
      size="xl" // md | lg | full
    >
      AI sections creator
    </Modal>
  );
};

export default AiSectionGeneratorModal;
