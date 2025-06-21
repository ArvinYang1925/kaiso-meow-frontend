import { Button } from "@/components/ui/button";
import fileUploadPNG from "@/assets/admin/file-uploading.png";
import { useSectionManagementStore } from "../store/sectionManagementStore";

interface InitialPageComponentProps {
  isLoading?: boolean;
}

const InitialPageComponent: React.FC<InitialPageComponentProps> = ({
  isLoading = false,
}) => {
  const { setIsShowCreateSectionModal, setIsShowAiSectionGeneratorModal } =
    useSectionManagementStore();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center px-4 py-8 min-h-[60vh]">
      <div className="instruction w-full sm:w-1/2 max-w-2xl">
        <h5 className="text-slate-600 mb-4 font-bold text-xl sm:text-2xl text-center sm:text-left">
          歡迎來到章節管理！
        </h5>
        <div className="text-slate-500 mb-6 text-sm sm:text-base">
          <p className="mb-4">目前尚未建立任何章節。</p>

          <p className="mb-4">
            👉 想快速開始？試試{" "}
            <strong className="text-blue-600">「AI 章節快手」</strong>！<br />
            只要輸入課程描述、預期章節數與草稿構想，即可
            <span className="text-green-600 font-semibold">
              自動產出章節草稿
            </span>
            ， 大幅節省規劃時間，讓你更有效率打造完整課程。
          </p>

          <p className="mb-4">
            🔧 或者，點選{" "}
            <strong className="text-blue-600">「新增章節」</strong>
            ，手動建立章節與單元內容。
          </p>

          <p>💬 如有任何問題，歡迎隨時聯繫客服人員。</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            className="bg-indigo-600 hover:bg-indigo-500 w-full sm:w-auto"
            onClick={() => setIsShowAiSectionGeneratorModal(true)}
            disabled={isLoading}
          >
            AI 章節快手
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-500 w-full sm:w-auto"
            onClick={() => setIsShowCreateSectionModal(true)}
            disabled={isLoading}
          >
            新增章節
          </Button>
        </div>
      </div>
      <div className="mt-8 sm:mt-0 sm:ml-8 w-full sm:w-1/2 flex justify-center">
        <img
          src={fileUploadPNG}
          alt="上傳檔案"
          className="w-full sm:w-full sm:max-w-md h-auto mx-auto opacity-80"
        />
      </div>
    </div>
  );
};

export default InitialPageComponent;
