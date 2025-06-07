import Modal from "@/components/common/Modal";
import { useSectionManagementStore } from "../store/sectionManagementStore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
// import { useParams } from "react-router-dom";
// import { handleErrorMessageDialog } from "@/lib/helper";
// import { useDialogStore } from "@/stores/commonDialogStore";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

const UploadVideoModal = () => {
  const {
    isShowUploadVideoModal,
    setIsShowUploadVideoModal,
    // createSection,
    // fetchSectionList,
  } = useSectionManagementStore();

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      "video/*": [], // 接受所有影片格式，如 .mp4, .mov, .avi 等
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 最大檔案大小 100MB（可依需求調整）
    onDrop: (acceptedFiles) => {
      console.log("選取的影片檔案：", acceptedFiles);
    },
  });

  // const { showCommonDialog } = useDialogStore();

  // const { courseId } = useParams();

  // const handleUploadVideo = async (e: React.FormEvent<HTMLFormElement>) => {
  //   if (!courseId) return;
  //   e.preventDefault();

  //   // const reqData = {
  //   //   title: sectionTitle,
  //   //   content: sectionContent,
  //   // };

  //   try {
  //     //   await createSection(courseId, reqData);
  //     showCommonDialog({
  //       title: "新增成功",
  //       description: "",
  //     });
  //     setIsShowUploadVideoModal(false);
  //     fetchSectionList(courseId);
  //   } catch (error) {
  //     handleErrorMessageDialog(error);
  //   }
  // };

  useEffect(() => {
    if (isShowUploadVideoModal) {
      // 初始化清空上傳檔案
    }
  }, [isShowUploadVideoModal]);

  const [isHovering, setIsHovering] = useState(false);

  return (
    <Modal
      isOpen={isShowUploadVideoModal}
      onClose={() => setIsShowUploadVideoModal(false)}
      title="上傳影片"
      size="xl" // md | lg | full
    >
      <div className="px-2 py-6">
        {/* 上傳拖曳區 */}
        <div
          className="flex flex-col items-center h-100 py-40 mb-8 cursor-pointer"
          onPointerEnter={() => setIsHovering(true)}
          onPointerLeave={() => setIsHovering(false)}
          style={{
            border: "6px dashed #eee",
            background: isHovering ? "#f9fafb" : "transparent",
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <p className="mb-4 font-medium text-2xl text-slate-400">
            請將影片拖曳至此，或點擊選擇上傳檔案
          </p>
          <p className="mb-8 text-slate-400">
            接受所有影片格式，如 .mp4, .mov, .avi 等
          </p>
          <Upload className="h-16 w-16 text-slate-300" />
          <ul>
            {acceptedFiles.map((file) => (
              <li key={file.name}>
                {file.name} - {file.size} bytes
              </li>
            ))}
          </ul>
        </div>
        {/* 上傳拖曳區 */}
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
