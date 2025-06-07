import { useDialogStore } from "@/stores/commonDialogStore";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router-dom";
import { useSectionManagementStore } from "../store/sectionManagementStore";
import { handleErrorMessageDialog } from "@/lib/helper";

const UploadVideoDropzoneSection = () => {
  const { courseId } = useParams();

  const {
    section,
    setIsShowUploadVideoModal,
    createVideo,
    fetchSectionList,
    setVideoFileName,
  } = useSectionManagementStore();

  const { showCommonDialog } = useDialogStore();

  const [isHovering, setIsHovering] = useState(false);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      "video/*": [], // 接受所有影片格式，如 .mp4, .mov, .avi 等
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 最大檔案大小 100MB（可依需求調整）
    onDrop: async (acceptedFiles) => {
      console.log("選取的影片檔案：", acceptedFiles);
      if (!courseId) return;

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setVideoFileName(file.name);
        try {
          await createVideo(section.id, file);
          showCommonDialog({
            title: "上傳成功",
            description: ``,
          });
          fetchSectionList(courseId);
          setIsShowUploadVideoModal(false);
        } catch (error) {
          console.error("上傳失敗", error);
          handleErrorMessageDialog(error);
        }
      }
    },
  });

  return (
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
        接受所有影片格式，如 .mp4, .mov, .avi 等，最大檔案大小 100MB。
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
  );
};

export default UploadVideoDropzoneSection;
