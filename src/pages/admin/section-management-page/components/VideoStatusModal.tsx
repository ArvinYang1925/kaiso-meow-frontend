import React, { useEffect, useRef, useState } from "react";
import { X, Clock, Check, AlertCircle, Loader2 } from "lucide-react";
import { useVideoManagementStore } from "../store/videoManagementStore";
import { Video } from "../services/type";
import { useParams } from "react-router-dom";
import { useSectionManagementStore } from "../store/sectionManagementStore";

interface VideoStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId: string | null;
  autoCloseOnComplete?: boolean;
}

export const VideoStatusModal: React.FC<VideoStatusModalProps> = ({
  isOpen,
  onClose,
  sectionId,
  autoCloseOnComplete = true,
}) => {
  const { getVideo } = useVideoManagementStore();
  const { fetchSectionList } = useSectionManagementStore();
  const [video, setVideo] = useState<null | Video>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { courseId } = useParams();

  // 計時器
  const startTimer = () => {
    if (timerRef.current) return; // 已啟動過，就不再啟動
    timerRef.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
  };

  // 停止但保留時間
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (!isOpen || !sectionId) return;

    // 獲取影片資料
    const videoData = getVideo(sectionId);
    if (videoData) {
      setVideo(videoData);
    }

    // 監聽 Zustand store 的變化
    const unsubscribe = useVideoManagementStore.subscribe((state) => {
      if (!courseId) {
        console.warn("查無課程id");
        return;
      }
      if (sectionId && state.videos[sectionId]) {
        const updatedVideo = state.videos[sectionId];
        setVideo(updatedVideo);

        // 如果設定自動關閉且狀態完成，2秒後自動關閉
        if (
          autoCloseOnComplete &&
          (updatedVideo.uploadStatus === "completed" ||
            updatedVideo.uploadStatus === "failed")
        ) {
          //停止計時
          stopTimer();
          setTimeout(() => {
            //再取一次section資料，更新雲朵顏色
            fetchSectionList(courseId);
          }, 2000);
        }
      }
    });

    return () => {
      unsubscribe();
      stopTimer();
    };
  }, [isOpen, sectionId, onClose, autoCloseOnComplete, getVideo]);

  // 重置狀態當 modal 關閉時
  useEffect(() => {
    if (!isOpen) {
      setTimeElapsed(0);
      stopTimer();
      setVideo(null);
    } else {
      //開始計時
      startTimer();
    }
  }, [isOpen]);

  if (!isOpen || !video) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "processing":
        return {
          icon: <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />,
          title: "影片轉檔中",
          description: "請稍候，系統正在處理您的影片...",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-800",
        };
      case "completed":
        return {
          icon: <Check className="w-8 h-8 text-green-500" />,
          title: "轉檔完成！",
          description: "您的影片已成功處理完成",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-800",
        };
      case "failed":
        return {
          icon: <AlertCircle className="w-8 h-8 text-red-500" />,
          title: "轉檔失敗",
          description: "影片處理過程中發生錯誤，請重新嘗試",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
        };
      default:
        return {
          icon: <Clock className="w-8 h-8 text-gray-500" />,
          title: "處理中",
          description: "正在處理您的請求...",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          textColor: "text-gray-800",
        };
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const statusConfig = getStatusConfig(video.uploadStatus);
  const isProcessing = video.uploadStatus === "processing";
  const isCompleted =
    video.uploadStatus === "completed" || video.uploadStatus === "failed";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">影片處理狀態</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* 狀態區域 */}
          <div
            className={`p-4 rounded-lg border-2 ${statusConfig.bgColor} ${statusConfig.borderColor} mb-4`}
          >
            <div className="flex items-center gap-3 mb-3">
              {statusConfig.icon}
              <div>
                <h4 className={`font-medium ${statusConfig.textColor}`}>
                  {statusConfig.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {statusConfig.description}
                </p>
              </div>
            </div>

            {/* 進度條 (僅在處理中時顯示) */}
            {isProcessing && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full animate-pulse"
                  style={{ width: "45%" }}
                ></div>
              </div>
            )}
          </div>

          {/* 影片資訊 */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>影片名稱:</span>
              <span className="font-medium text-gray-900">{video.title}</span>
            </div>
            <div className="flex justify-between">
              <span>影片 ID:</span>
              <span className="font-mono text-xs">{video.id}</span>
            </div>
            <div className="flex justify-between">
              <span>處理時間:</span>
              <span className="font-medium">{formatTime(timeElapsed)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
          {isCompleted && (
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                video.uploadStatus === "completed"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {video.uploadStatus === "completed" ? "完成" : "關閉"}
            </button>
          )}

          {isProcessing && (
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              在背景執行
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
