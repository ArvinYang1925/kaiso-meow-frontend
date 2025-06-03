import { Button } from "@/components/ui/button";
import fileUploadPNG from "@/assets/admin/file-uploading.png";
import { useSectionManagementStore } from "../store/sectionManagementStore";

const InitialPageComponent = () => {
  const { setIsShowCreateSectionModal } = useSectionManagementStore();

  return (
    <div className="flex items-center p-8 flex justify-center">
      <div className="instruction">
        <h5 className="text-slate-600 mb-4 font-bold text-2xl">
          歡迎來到章節管理！
        </h5>
        <div className="text-slate-500 mb-6">
          <p>您目前在此課程底下尚未建立任何章節，</p>
          <p>請點選「新增章節」一步一步建立章節與單元內容。</p>
          <p>如有任何問題歡迎隨時連絡客服人員。</p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-500"
          onClick={() => setIsShowCreateSectionModal(true)}
        >
          新增章節
        </Button>
      </div>
      <img src={fileUploadPNG} alt="上傳檔案" />
    </div>
  );
};

export default InitialPageComponent;
