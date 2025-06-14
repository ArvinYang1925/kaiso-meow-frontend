import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ADMIN_ROUTES } from "@/app/route-path";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/utils/RichTextEditor";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { ImagePlus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCourseStore } from "./courseManagementStore";
import { useScreenLoading } from "@/components/common/useScreenLoading";
import {
  useImageWithFallback,
  DEFAULT_COURSE_COVER,
} from "@/components/utils/courseImageUtils";
import type { FileRejection } from "react-dropzone";
import type { UpdateCourseModel } from "./courseManagement.model";

const courseDetailSchema = z
  .object({
    title: z
      .string()
      .min(1, "課程名稱為必填項目")
      .max(100, "課程名稱不能超過100個字元"),
    subtitle: z
      .string()
      .max(200, "課程副標題不能超過200個字元")
      .optional()
      .or(z.literal("")),
    description: z
      .string()
      .min(1, "課程介紹為必填項目")
      .max(5000, "課程介紹不能超過5000個字元"),
    highlight: z
      .string()
      .max(200, "課程亮點不能超過200個字元")
      .optional()
      .or(z.literal("")),
    duration: z
      .string()
      .optional()
      .refine((val: string | undefined): boolean => {
        if (!val || val === "") return true;
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 1000;
      }, "課程時長必須是0-1000之間的數字"),
    courseType: z.enum(["paid", "free"], {
      required_error: "請選擇課程類型",
    }),
    price: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.courseType === "paid") {
        if (!data.price || data.price === "") {
          return false;
        }
        const num = parseFloat(data.price);
        if (isNaN(num) || num <= 0 || num > 999999) {
          return false;
        }
      }
      return true;
    },
    {
      message: "付費課程必須設定有效價格（1-999,999之間）",
      path: ["price"],
    }
  );

type CourseDetailFormData = z.infer<typeof courseDetailSchema>;

export default function CourseManagementDetailPage() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { toast } = useToast();

  // 🎯 全螢幕 Loading Hook
  const { ScreenLoading, withLoading } = useScreenLoading();

  const {
    currentCourse,
    isUpdating,
    isUploading,
    fetchCourseDetail,
    updateCourseDetail,
    uploadCourseImage,
    resetCurrentCourse,
  } = useCourseStore();

  // 🔧 狀態管理
  const [uploadedCoverUrl, setUploadedCoverUrl] = useState<string>("");
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");
  const [originalCoverUrl, setOriginalCoverUrl] = useState<string>(""); // 原始課程封面
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const [isPageInitialized, setIsPageInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // 🔧 使用 ref 管理不需要觸發重新渲染的上傳狀態
  const uploadStateRef = useRef({
    isUploading: false,
    selectedFile: null as File | null,
    fileObjectUrl: null as string | null,
    lastUploadedFile: null as File | null,
  });

  const isLeavingPageRef = useRef<boolean>(false);
  const initialLoadRef = useRef<boolean>(false);
  const dropzoneDisabledRef = useRef<boolean>(false);

  // 🔧 修正：圖片 URL 計算邏輯，預設圖片不參與狀態管理
  const currentImageSrc = useMemo(() => {
    // 1. 優先使用預覽圖片（拖拽上傳時）
    if (previewImageUrl) return previewImageUrl;
    // 2. 其次使用新上傳的圖片
    if (uploadedCoverUrl) return uploadedCoverUrl;
    // 3. 再使用原始課程封面
    if (originalCoverUrl) return originalCoverUrl;
    // 4. 最後使用預設圖片（不觸發狀態變化）
    return DEFAULT_COURSE_COVER;
  }, [previewImageUrl, uploadedCoverUrl, originalCoverUrl]);

  const [imageSrc, handleImageError] = useImageWithFallback(currentImageSrc);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CourseDetailFormData>({
    resolver: zodResolver(courseDetailSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      highlight: "",
      duration: "",
      courseType: "paid",
      price: "",
    },
  });

  const courseType = watch("courseType");

  // 🔧 修正：穩定的清理函數
  const cleanupObjectUrl = useCallback(() => {
    if (uploadStateRef.current.fileObjectUrl) {
      console.log("清理 Object URL:", uploadStateRef.current.fileObjectUrl);
      URL.revokeObjectURL(uploadStateRef.current.fileObjectUrl);
      uploadStateRef.current.fileObjectUrl = null;
    }
  }, []);

  // 🔧 關鍵修正：完全隔離的上傳函數
  const handleUploadImageStable = useCallback(
    async (file: File) => {
      console.log(
        "handleUploadImage 被調用:",
        file.name,
        "當前上傳狀態:",
        uploadStateRef.current.isUploading
      );

      // 嚴格的防重複檢查
      if (uploadStateRef.current.isUploading || dropzoneDisabledRef.current) {
        console.log("上傳中或已禁用，忽略重複請求");
        return;
      }

      // 檢查是否為相同檔案
      if (
        uploadStateRef.current.lastUploadedFile &&
        uploadStateRef.current.lastUploadedFile.name === file.name &&
        uploadStateRef.current.lastUploadedFile.size === file.size &&
        uploadStateRef.current.lastUploadedFile.lastModified ===
          file.lastModified
      ) {
        console.log("相同檔案，忽略重複上傳");
        return;
      }

      // 檔案驗證
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "檔案過大",
          description: "圖片大小不能超過 2MB",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "檔案格式錯誤",
          description: "請選擇圖片檔案",
        });
        return;
      }

      try {
        // 設置上傳狀態，禁用後續操作
        uploadStateRef.current.isUploading = true;
        dropzoneDisabledRef.current = true;
        uploadStateRef.current.lastUploadedFile = file;
        uploadStateRef.current.selectedFile = file;

        console.log("開始上傳檔案:", file.name);

        // 清理舊的 URL
        cleanupObjectUrl();

        // 創建預覽 URL，並立即更新預覽
        const newObjectUrl = URL.createObjectURL(file);
        uploadStateRef.current.fileObjectUrl = newObjectUrl;
        setPreviewImageUrl(newObjectUrl);

        console.log("創建預覽 URL:", newObjectUrl);

        // 執行上傳
        const uploadedUrl = await uploadCourseImage(file);

        if (uploadedUrl) {
          console.log("上傳成功:", uploadedUrl);

          // 🔧 修正：只更新本地狀態，不觸發 store 的 coverPreview 變化
          setUploadedCoverUrl(uploadedUrl);

          // 清理本地預覽 URL
          if (uploadStateRef.current.fileObjectUrl) {
            URL.revokeObjectURL(uploadStateRef.current.fileObjectUrl);
            uploadStateRef.current.fileObjectUrl = null;
          }
          setPreviewImageUrl(""); // 清除預覽 URL，使用上傳成功的 URL

          toast({
            title: "上傳成功",
            description: "課程封面已成功上傳",
          });
        } else {
          throw new Error("上傳返回空值");
        }
      } catch (error) {
        console.error("上傳失敗:", error);

        // 清理狀態
        uploadStateRef.current.selectedFile = null;
        uploadStateRef.current.lastUploadedFile = null;
        setPreviewImageUrl(""); // 清除預覽
        cleanupObjectUrl();

        let errorMessage = "圖片上傳失敗，請重試";
        if (error instanceof Error) {
          if (error.message.includes("400")) {
            errorMessage = "請求格式錯誤，請確認檔案格式正確";
          } else if (error.message.includes("413")) {
            errorMessage = "檔案過大，請選擇小於2MB的圖片";
          } else if (error.message.includes("429")) {
            errorMessage = "上傳頻率過高，請稍後再試";
          } else if (error.message.includes("network")) {
            errorMessage = "網路連線問題，請檢查網路狀態";
          } else {
            errorMessage = error.message;
          }
        }

        toast({
          variant: "destructive",
          title: "上傳失敗",
          description: errorMessage,
        });
      } finally {
        // 重置上傳狀態
        uploadStateRef.current.isUploading = false;
        dropzoneDisabledRef.current = false;
        console.log("上傳流程結束，重置狀態");
      }
    },
    [cleanupObjectUrl, uploadCourseImage, toast]
  );

  // 🔧 關鍵修正：使用極度穩定的 onDrop 函數
  const onDropStable = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      console.log("onDrop 觸發", {
        acceptedFiles: acceptedFiles.length,
        rejections: fileRejections.length,
        isUploading: uploadStateRef.current.isUploading,
        disabled: dropzoneDisabledRef.current,
      });

      // 如果正在上傳或已禁用，直接返回
      if (uploadStateRef.current.isUploading || dropzoneDisabledRef.current) {
        console.log("拖拽已禁用或正在上傳中，忽略");
        return;
      }

      // 處理被拒絕的檔案
      if (fileRejections.length > 0) {
        const isSizeError = fileRejections.some((rej) =>
          rej.errors.some((err) => err.code === "file-too-large")
        );

        const isTypeError = fileRejections.some((rej) =>
          rej.errors.some((err) => err.code === "file-invalid-type")
        );

        const isTooManyFiles = fileRejections.some((rej) =>
          rej.errors.some((err) => err.code === "too-many-files")
        );

        if (isTooManyFiles) {
          toast({
            variant: "destructive",
            title: "檔案數量超限",
            description: "一次只能上傳一張圖片",
          });
        } else if (isSizeError) {
          toast({
            variant: "destructive",
            title: "圖片大小超出限制",
            description: "請上傳小於2MB的圖片",
          });
        } else if (isTypeError) {
          toast({
            variant: "destructive",
            title: "檔案格式錯誤",
            description: "請上傳 JPG、PNG 或 GIF 格式的圖片",
          });
        }
        return;
      }

      // 處理接受的檔案
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        console.log("處理接受的檔案:", file.name);
        handleUploadImageStable(file);
      }
    },
    [handleUploadImageStable, toast]
  );

  // 🔧 修正：穩定的 dropzone 配置
  const dropzoneOptions: DropzoneOptions = useMemo(
    () => ({
      accept: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/gif": [".gif"],
      },
      maxSize: 2 * 1024 * 1024, // 2MB
      maxFiles: 1,
      multiple: false,
      noClick: false,
      noKeyboard: false,
      preventDropOnDocument: true,
      onDrop: onDropStable,
      disabled: isUploading || dropzoneDisabledRef.current, // 根據 store 狀態和本地狀態禁用
    }),
    [onDropStable, isUploading]
  );

  // 🔧 在組件頂層調用 useDropzone Hook
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone(dropzoneOptions);

  // 🔧 修正：清理函數
  const clearFormAndState = useCallback(() => {
    console.log("清理表單和狀態");
    reset();
    uploadStateRef.current = {
      isUploading: false,
      selectedFile: null,
      fileObjectUrl: null,
      lastUploadedFile: null,
    };
    setUploadedCoverUrl("");
    setPreviewImageUrl("");
    setOriginalCoverUrl("");
    cleanupObjectUrl();
    dropzoneDisabledRef.current = false;
  }, [reset, cleanupObjectUrl]);

  // 🔧 修正：移除封面函數
  const handleRemoveCover = useCallback(() => {
    console.log("移除封面");
    uploadStateRef.current = {
      isUploading: false,
      selectedFile: null,
      fileObjectUrl: null,
      lastUploadedFile: null,
    };
    setUploadedCoverUrl("");
    setPreviewImageUrl("");
    setOriginalCoverUrl(""); // 清除原始封面，這樣就會顯示預設圖片
    cleanupObjectUrl();
    dropzoneDisabledRef.current = false;

    // 通知使用者
    toast({
      title: "已移除封面",
      description: "已恢復使用預設圖片",
    });
  }, [cleanupObjectUrl, toast]);

  // 🔧 修正：取消操作
  const handleCancel = useCallback(() => {
    isLeavingPageRef.current = true;
    clearFormAndState();
    navigate(ADMIN_ROUTES.COURSES);
  }, [clearFormAndState, navigate]);

  // 🔧 修正：組件卸載和路由變更時的清理
  useEffect(() => {
    // 進入頁面時立即清空所有狀態
    clearFormAndState();
    resetCurrentCourse();

    return () => {
      console.log("組件卸載清理");
      clearFormAndState();
      resetCurrentCourse();
      cleanupObjectUrl();
      isLeavingPageRef.current = false;
      initialLoadRef.current = false;
      dropzoneDisabledRef.current = false;
    };
  }, [clearFormAndState, resetCurrentCourse, cleanupObjectUrl]);

  // 🔧 修正：頁面初始化邏輯
  useEffect(() => {
    if (!courseId) {
      setHasError(true);
      setErrorMessage("無效的課程 ID");
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "無效的課程 ID",
      });
      navigate(ADMIN_ROUTES.COURSES);
      return;
    }

    // 🔧 關鍵修正：進入頁面時立即清空所有狀態
    const clearAllStates = () => {
      console.log("清空所有狀態");
      // 重置 store 狀態
      resetCurrentCourse();

      // 重置本地狀態
      setUploadedCoverUrl("");
      setPreviewImageUrl("");
      setOriginalCoverUrl("");
      setIsFormInitialized(false);
      setIsPageInitialized(false);
      setHasError(false);
      setErrorMessage("");

      // 清理上傳狀態
      uploadStateRef.current = {
        isUploading: false,
        selectedFile: null,
        fileObjectUrl: null,
        lastUploadedFile: null,
      };
      dropzoneDisabledRef.current = false;

      // 重置表單
      reset();

      // 清理任何可能的 Object URL
      cleanupObjectUrl();
    };

    const initializePage = async () => {
      console.log("初始化頁面:", courseId);

      try {
        setIsLoading(true);

        // 每次進入頁面都清空狀態，不管是否已初始化過
        clearAllStates();

        // 載入新的課程資料
        await withLoading(
          () => fetchCourseDetail(courseId),
          "正在載入課程詳細資料..."
        );

        setIsPageInitialized(true);
        console.log("頁面初始化完成");
      } catch (error) {
        console.error("頁面初始化失敗:", error);
        setHasError(true);

        let currentErrorMessage = "載入課程時發生錯誤";
        if (error instanceof Error) {
          if (
            error.message.includes("401") ||
            error.message.includes("Unauthorized")
          ) {
            currentErrorMessage = "您沒有權限訪問此課程，請重新登入";
            toast({
              variant: "destructive",
              title: "未授權訪問",
              description: "您的登入已過期，請重新登入",
            });
          } else if (
            error.message.includes("404") ||
            error.message.includes("Not Found")
          ) {
            currentErrorMessage = "找不到指定的課程";
          } else {
            currentErrorMessage = error.message || "載入課程時發生錯誤";
          }
        }

        setErrorMessage(currentErrorMessage);
        toast({
          variant: "destructive",
          title: "載入失敗",
          description: currentErrorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    // 直接初始化頁面，不需要檢查 initialLoadRef
    initializePage();

    // 組件卸載時的清理
    return () => {
      if (!isLeavingPageRef.current) {
        clearAllStates();
      }
    };
  }, [
    courseId,
    fetchCourseDetail,
    navigate,
    resetCurrentCourse,
    toast,
    withLoading,
    reset,
    cleanupObjectUrl,
  ]);

  // 🔧 修正：當課程資料載入完成時，初始化表單
  useEffect(() => {
    if (currentCourse && !isFormInitialized && isPageInitialized) {
      console.log("初始化表單數據");

      reset({
        title: currentCourse.title || "",
        subtitle: currentCourse.subtitle || "",
        description: currentCourse.description || "",
        highlight: currentCourse.highlight || "",
        duration: currentCourse.duration
          ? currentCourse.duration.toString()
          : "",
        price: currentCourse.price ? currentCourse.price.toString() : "",
        courseType: currentCourse.isFree ? "free" : "paid",
      });

      // 🔧 修正：設置原始封面 URL，不觸發重新渲染
      if (
        currentCourse.coverUrl &&
        currentCourse.coverUrl !== DEFAULT_COURSE_COVER
      ) {
        setOriginalCoverUrl(currentCourse.coverUrl);
      } else {
        setOriginalCoverUrl(""); // 如果沒有封面，使用空字符串
      }

      setIsFormInitialized(true);
      console.log("表單初始化完成");
    }
  }, [currentCourse, isFormInitialized, isPageInitialized, reset]);

  const onSubmit = async (data: CourseDetailFormData) => {
    if (!courseId) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "無效的課程 ID",
      });
      return;
    }

    try {
      if (!data.title?.trim()) {
        throw new Error("課程標題為必填項目");
      }

      if (!data.description?.trim()) {
        throw new Error("課程描述為必填項目");
      }

      if (
        data.courseType === "paid" &&
        (!data.price || parseFloat(data.price) <= 0)
      ) {
        throw new Error("付費課程必須設定有效的價格");
      }

      // 🔧 修正：確定最終的封面 URL
      const finalCoverUrl = (() => {
        // 1. 如果有新上傳的圖片，使用新圖片
        if (uploadedCoverUrl) return uploadedCoverUrl;
        // 2. 如果有原始封面，使用原始封面
        if (originalCoverUrl) return originalCoverUrl;
        // 3. 最後使用預設圖片
        return DEFAULT_COURSE_COVER;
      })();

      const courseData: UpdateCourseModel = {
        title: data.title.trim(),
        subtitle: data.subtitle?.trim() || undefined,
        description: data.description.trim(),
        highlight: data.highlight?.trim() || undefined,
        duration: data.duration ? parseFloat(data.duration) : 0,
        price: data.courseType === "free" ? 0 : parseFloat(data.price || "0"),
        isFree: data.courseType === "free",
        coverUrl: finalCoverUrl,
      };

      const success = await updateCourseDetail(courseId, courseData);

      if (success) {
        toast({
          title: "更新成功",
          description: "課程已成功更新，正在跳轉到章節管理...",
        });

        // 清理臨時 URL
        cleanupObjectUrl();
        isLeavingPageRef.current = true;

        navigate(`${ADMIN_ROUTES.COURSES}/${courseId}/sections`);
      } else {
        throw new Error("更新課程失敗");
      }
    } catch (error) {
      let errorMessage = "更新課程時發生錯誤，請稍後再試";

      if (error instanceof Error) {
        if (error.message.includes("401")) {
          errorMessage = "未授權操作，請重新登入";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        variant: "destructive",
        title: "更新失敗",
        description: errorMessage,
      });
    }
  };

  // 🔧 修正：檢查是否有自定義圖片（不包括預設圖片）
  const hasCustomImage =
    uploadStateRef.current.selectedFile ||
    uploadedCoverUrl ||
    previewImageUrl ||
    originalCoverUrl; // 原始課程封面也算自定義圖片
  const hasPreview = true;

  // 如果正在載入，顯示loading
  if (isLoading) {
    return <ScreenLoading />;
  }

  // 如果有錯誤，顯示錯誤頁面
  if (hasError || (!currentCourse && isPageInitialized)) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {errorMessage.includes("權限") || errorMessage.includes("登入")
              ? "未授權訪問"
              : "找不到課程"}
          </h2>
          <p className="text-gray-500 mb-6">
            {errorMessage || "您要編輯的課程不存在或已被刪除。"}
          </p>
          <div className="space-x-4">
            {errorMessage.includes("權限") || errorMessage.includes("登入") ? (
              <Button
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                重新登入
              </Button>
            ) : null}
            <Button
              variant="outline"
              onClick={() => navigate(ADMIN_ROUTES.COURSES)}
            >
              返回課程列表
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isPageInitialized || !currentCourse || !isFormInitialized) {
    return <ScreenLoading />;
  }

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row gap-6">
          {/* 左側：課程資訊 */}
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-6">課程資訊</h2>
            <div className="bg-white rounded-lg border border-slate-200">
              <div className="p-6 space-y-6">
                {/* 課程名稱 */}
                <div className="space-y-1">
                  <Label htmlFor="title">課程名稱 *</Label>
                  <Input
                    id="title"
                    placeholder="請輸入課程名稱"
                    {...register("title")}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    一個引人注目且簡單的課程名稱可以幫助您吸引更多的學生。
                  </p>
                </div>

                {/* 課程副標題 */}
                <div className="space-y-1">
                  <Label htmlFor="subtitle">課程副標題</Label>
                  <Input
                    id="subtitle"
                    placeholder="例：深入淺出的講解，從零開始完全掌握..."
                    {...register("subtitle")}
                    className={errors.subtitle ? "border-red-500" : ""}
                  />
                  {errors.subtitle && (
                    <p className="text-sm text-red-500">
                      {errors.subtitle.message}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    在課程名稱下方顯示，您可以為課程添加額外的說明、性格和或標語。
                  </p>
                </div>

                {/* 課程介紹 */}
                <div className="space-y-1">
                  <Label htmlFor="description">課程介紹 *</Label>
                  <RichTextEditor
                    id="description"
                    value={watch("description")}
                    onChange={(content) => setValue("description", content)}
                    minHeight={200}
                    maxHeight={398}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* 課程亮點 */}
                <div className="space-y-1">
                  <Label htmlFor="highlight">課程亮點</Label>
                  <Input
                    id="highlight"
                    placeholder="學習 xxx 的關鍵基礎知識"
                    {...register("highlight")}
                    className={errors.highlight ? "border-red-500" : ""}
                  />
                  {errors.highlight && (
                    <p className="text-sm text-red-500">
                      {errors.highlight.message}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    列出本課程的學習亮點將有助於學生更好地理解你的課程內容。
                  </p>
                </div>

                {/* 課程類型 */}
                <div className="space-y-1">
                  <Label>課程類型 *</Label>
                  <div className="flex gap-4">
                    {/* 付費課程 */}
                    <label
                      className={`flex-1 border rounded-lg p-4 cursor-pointer flex items-start gap-2 transition
                        ${
                          courseType === "paid"
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 bg-white"
                        }`}
                    >
                      <input
                        type="radio"
                        {...register("courseType")}
                        value="paid"
                        className="mt-1 accent-blue-500"
                      />
                      <div>
                        <div className="font-bold">付費課程</div>
                        <div className="text-sm text-gray-500">
                          您可以設定付費內容的價格和促銷條件。
                        </div>
                      </div>
                    </label>

                    {/* 免費課程 */}
                    <label
                      className={`flex-1 border rounded-lg p-4 cursor-pointer flex items-start gap-2 transition
                        ${
                          courseType === "free"
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 bg-white"
                        }`}
                    >
                      <input
                        type="radio"
                        {...register("courseType")}
                        value="free"
                        className="mt-1 accent-blue-500"
                        onChange={(e) => {
                          register("courseType").onChange(e);
                          setValue("price", "");
                        }}
                      />
                      <div>
                        <div className="font-bold">免費課程 / 引導磁鐵</div>
                        <div className="text-sm text-gray-500">
                          引導磁石允許用戶在註冊後兌換和解鎖內容，可用於增加和累積您的會員名單。
                        </div>
                      </div>
                    </label>
                  </div>
                  {errors.courseType && (
                    <p className="text-sm text-red-500">
                      {errors.courseType.message}
                    </p>
                  )}
                </div>

                {/* 課程時長 */}
                <div className="space-y-1">
                  <Label htmlFor="duration">課程時長（小時）</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="請輸入課程時長"
                    {...register("duration")}
                    className={errors.duration ? "border-red-500" : ""}
                  />
                  {errors.duration && (
                    <p className="text-sm text-red-500">
                      {errors.duration.message}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    例如，對於10小時30分鐘，輸入
                    10.5。若留空，系統將自動計算課程中所有單元的總學時數。
                  </p>
                </div>

                {/* 課程價格 - 只在付費課程時顯示 */}
                {courseType === "paid" && (
                  <div className="space-y-1">
                    <Label htmlFor="price">課程價格 *</Label>
                    <div className="flex">
                      <span
                        className="flex items-center justify-center border border-slate-200 rounded-l-md bg-slate-50 px-4 text-gray-700 text-lg"
                        style={{ height: 40 }}
                      >
                        NT$
                      </span>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        placeholder="0"
                        {...register("price")}
                        className={`rounded-l-none border-l-0 focus:ring-0 focus:border-slate-200 ${
                          errors.price ? "border-red-500" : ""
                        }`}
                        style={{ height: 40 }}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-sm text-red-500">
                        {errors.price.message}
                      </p>
                    )}
                  </div>
                )}

                {/* 按鈕區域 */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isUpdating || isUploading}
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating || isUploading}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {isUpdating
                      ? "更新中..."
                      : isUploading
                      ? "上傳中..."
                      : "更新課程"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 右側：課程縮圖 */}
          <div className="md:w-4/12 w-full">
            <h2 className="text-xl font-bold mb-6">課程縮圖</h2>
            <div className="bg-white border border-blue-100 rounded-2xl">
              <div className="p-4">
                <Label className="block font-medium text-slate-800 mb-2">
                  封面圖片
                </Label>

                {/* 圖片預覽或上傳區域 */}
                <div className="relative group">
                  <div
                    {...getRootProps()}
                    className={`
                      h-64 rounded-2xl border-2 border-dashed transition cursor-pointer flex flex-col items-center justify-center
                      ${
                        fileRejections.length > 0
                          ? "border-red-400 bg-red-50"
                          : isDragActive
                          ? "border-blue-400 bg-blue-50"
                          : uploadedCoverUrl ||
                            previewImageUrl ||
                            originalCoverUrl
                          ? "border-green-400 bg-green-50"
                          : "border-blue-300 bg-blue-50"
                      }
                      ${
                        isUploading || dropzoneDisabledRef.current
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                    `}
                    style={{ minHeight: 260 }}
                  >
                    <input
                      {...getInputProps()}
                      disabled={isUploading || dropzoneDisabledRef.current}
                    />

                    {hasPreview ? (
                      // 圖片預覽模式
                      <div className="relative w-full h-full">
                        <img
                          src={imageSrc}
                          alt="課程封面預覽"
                          className="w-full h-full object-cover rounded-xl"
                          onError={handleImageError}
                        />

                        {/* 移除/重置按鈕 - 覆蓋在圖片上，只在有自定義圖片時顯示 */}
                        {hasCustomImage && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full shadow-lg bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveCover();
                            }}
                            disabled={
                              isUploading || dropzoneDisabledRef.current
                            }
                            title="重置為預設圖片"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}

                        {/* 上傳狀態指示器 */}
                        {isUploading && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                            <div className="text-white text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                              <p className="text-sm">上傳中...</p>
                            </div>
                          </div>
                        )}

                        {/* 替換圖片提示 */}
                        <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-70 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {hasCustomImage
                            ? "點擊或拖拽以替換圖片"
                            : "點擊或拖拽以上傳自定義圖片"}
                        </div>
                      </div>
                    ) : (
                      // 上傳提示模式
                      <div className="flex flex-col items-center">
                        <ImagePlus size={40} className="text-slate-400 mb-2" />
                        <div className="font-bold text-lg text-slate-800 mb-1 text-center">
                          <p className="p-4">
                            {isUploading
                              ? "上傳中..."
                              : "將圖片拖曳到此處或按一下以選擇圖片"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 錯誤訊息 */}
                {fileRejections.length > 0 && (
                  <div className="text-red-500 text-sm mt-2">
                    檔案格式或大小不符，請選擇 2MB 以內的圖片檔案。
                  </div>
                )}

                {/* 上傳狀態顯示 */}
                {isUploading && (
                  <div className="text-blue-600 text-sm mt-2 flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                    圖片上傳中，請稍候...
                  </div>
                )}

                {/* 上傳提示 */}
                <p className="text-xs text-gray-500 mt-2">
                  建議尺寸：1280x720 像素，格式：JPG、PNG、GIF，大小不超過 2MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
