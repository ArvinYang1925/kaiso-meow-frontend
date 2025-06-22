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
import { useDialogStore } from "@/stores/commonDialogStore";

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
      .refine((content) => {
        // 檢查是否包含圖片
        if (content.includes("<img")) return true;

        // 移除 HTML 標籤並檢查是否有實際文字內容
        const textContent = content.replace(/<[^>]*>/g, "").trim();
        return textContent.length > 0;
      }, "課程介紹為必填項目"),
    // .max(5000, "課程介紹不能超過5000個字元"),
    highlight: z
      .string()
      .max(200, "課程亮點不能超過200個字元")
      .optional()
      .or(z.literal("")),
    duration: z
      .string()
      .min(1, "課程時長為必填項目")
      .refine((val: string): boolean => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      }, "課程時長必須大於0"),
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
  const { showCommonDialog } = useDialogStore();

  // 全螢幕 Loading
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

  // 狀態管理
  const [uploadedCoverUrl, setUploadedCoverUrl] = useState<string>("");
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");
  const [originalCoverUrl, setOriginalCoverUrl] = useState<string>(""); // 原始課程封面
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const [isPageInitialized, setIsPageInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // 使用 ref 管理不需要觸發重新渲染的上傳狀態
  const uploadStateRef = useRef({
    isUploading: false,
    selectedFile: null as File | null,
    fileObjectUrl: null as string | null,
    lastUploadedFile: null as File | null,
  });

  const isLeavingPageRef = useRef<boolean>(false);
  const initialLoadRef = useRef<boolean>(false);
  const dropzoneDisabledRef = useRef<boolean>(false);

  // 圖片 URL 計算邏輯，預設圖片不參與狀態管理
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

  // 穩定的清理函數
  const cleanupObjectUrl = useCallback(() => {
    if (uploadStateRef.current.fileObjectUrl) {
      URL.revokeObjectURL(uploadStateRef.current.fileObjectUrl);
      uploadStateRef.current.fileObjectUrl = null;
    }
  }, []);

  const handleUploadImageStable = useCallback(
    async (file: File) => {
      // 防重複檢查
      if (uploadStateRef.current.isUploading || dropzoneDisabledRef.current) {
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

      await withLoading(async () => {
        // 設置上傳狀態，禁用後續操作
        uploadStateRef.current.isUploading = true;
        dropzoneDisabledRef.current = true;
        uploadStateRef.current.lastUploadedFile = file;
        uploadStateRef.current.selectedFile = file;

        // 清理舊的 URL
        cleanupObjectUrl();

        // 創建預覽 URL，並立即更新預覽
        const newObjectUrl = URL.createObjectURL(file);
        uploadStateRef.current.fileObjectUrl = newObjectUrl;
        setPreviewImageUrl(newObjectUrl);

        try {
          // 執行上傳
          const uploadedUrl = await uploadCourseImage(file);

          if (uploadedUrl) {
            // 只更新本地狀態，不觸發 store 的 coverPreview 變化
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
          throw error;
        } finally {
          // 重置上傳狀態
          uploadStateRef.current.isUploading = false;
          dropzoneDisabledRef.current = false;
        }
      });
    },
    [cleanupObjectUrl, uploadCourseImage, toast, withLoading]
  );

  const onDropStable = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      // 如果正在上傳或已禁用，直接返回
      if (uploadStateRef.current.isUploading || dropzoneDisabledRef.current) {
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
        handleUploadImageStable(file);
      }
    },
    [handleUploadImageStable, toast]
  );

  // dropzone 配置
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
      disabled: isUploading || dropzoneDisabledRef.current,
    }),
    [onDropStable, isUploading]
  );

  // 在組件頂層調用 useDropzone
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone(dropzoneOptions);

  // 清理函數
  const clearFormAndState = useCallback(() => {
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

  // 移除封面函數
  const handleRemoveCover = useCallback(() => {
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

  // 取消操作
  const handleCancel = useCallback(() => {
    isLeavingPageRef.current = true;
    clearFormAndState();
    navigate(ADMIN_ROUTES.COURSES);
  }, [clearFormAndState, navigate]);

  // 組件卸載和路由變更時的清理
  useEffect(() => {
    // 進入頁面時立即清空所有狀態
    clearFormAndState();
    resetCurrentCourse();

    return () => {
      clearFormAndState();
      resetCurrentCourse();
      cleanupObjectUrl();
      isLeavingPageRef.current = false;
      initialLoadRef.current = false;
      dropzoneDisabledRef.current = false;
    };
  }, [clearFormAndState, resetCurrentCourse, cleanupObjectUrl]);

  // 頁面初始化邏輯
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

    // 進入頁面時立即清空所有狀態
    const clearAllStates = () => {
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
      cleanupObjectUrl();
    };

    const initializePage = async () => {
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
      } catch (error) {
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

    // 直接初始化頁面
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

  // 當課程資料載入完成時，初始化表單
  useEffect(() => {
    if (currentCourse && !isFormInitialized && isPageInitialized) {
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

      // 設置原始封面 URL，不觸發重新渲染
      if (
        currentCourse.coverUrl &&
        currentCourse.coverUrl !== DEFAULT_COURSE_COVER
      ) {
        setOriginalCoverUrl(currentCourse.coverUrl);
      } else {
        setOriginalCoverUrl(""); // 如果沒有封面，使用空字符串
      }

      setIsFormInitialized(true);
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

    await withLoading(async () => {
      if (
        data.courseType === "paid" &&
        (!data.price || parseFloat(data.price) <= 0)
      ) {
        throw new Error("付費課程必須設定有效的價格");
      }

      // 確定最終的封面 URL
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

      try {
        const result = await updateCourseDetail(courseId, courseData);

        if (result.success) {
          toast({
            title: "更新成功",
            description: "課程已成功更新，正在跳轉到章節管理...",
          });

          cleanupObjectUrl();
          isLeavingPageRef.current = true;
          navigate(`${ADMIN_ROUTES.COURSES}/${courseId}/sections`);
        } else {
          throw new Error(result.message || "更新課程失敗");
        }
      } catch (error) {
        let errorMessage = "更新課程時發生錯誤，請稍後再試";

        if (error instanceof Error) {
          errorMessage = error.message;
        }

        showCommonDialog({
          title: "更新失敗",
          description: errorMessage,
        });
      }
    });
  };

  // 檢查是否有自定義圖片（不包括預設圖片）
  const hasCustomImage =
    uploadStateRef.current.selectedFile ||
    uploadedCoverUrl ||
    previewImageUrl ||
    originalCoverUrl; // 原始課程封面也算自定義圖片
  const hasPreview = true;

  // 如果正在載入，顯示loading
  if (isLoading) {
    return (
      <div>
        <ScreenLoading />
      </div>
    );
  }

  // 如果有錯誤，顯示錯誤頁面
  if (hasError || (!currentCourse && isPageInitialized)) {
    return (
      <div className="py-4 md:py-8 md:container md:mx-auto md:px-6 lg:px-8">
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

        {/* 全螢幕 Loading */}
        <ScreenLoading />
      </div>
    );
  }

  if (!isPageInitialized || !currentCourse || !isFormInitialized) {
    return (
      <div>
        <ScreenLoading />
      </div>
    );
  }

  return (
    <div className="py-4 md:py-8 w-full max-w-full overflow-hidden">
      <div className="md:container md:mx-auto md:px-6 lg:px-8 pb-20 md:pb-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-0 md:flex-row md:gap-6 w-full max-w-full">
            {/* 左側：課程資訊 */}
            <div className="flex-1 w-full max-w-full">
              <h2 className="text-xl font-bold mb-4 md:mb-6 px-4 md:px-0">
                課程資訊
              </h2>
              <div className="bg-white md:rounded-lg border-0 md:border border-slate-200 w-full max-w-full">
                <div className="p-4 md:p-6 space-y-6 w-full max-w-full">
                  {/* 課程名稱 */}
                  <div className="space-y-2 w-full max-w-full">
                    <Label htmlFor="title">
                      課程名稱 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="請輸入課程名稱"
                      {...register("title")}
                      className={`w-full max-w-full ${
                        errors.title ? "border-red-500" : ""
                      }`}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 break-words">
                        {errors.title.message}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500 break-words">
                      一個引人注目且簡單的課程名稱可以幫助您吸引更多的學生。
                    </p>
                  </div>

                  {/* 課程副標題 */}
                  <div className="space-y-2 w-full max-w-full">
                    <Label htmlFor="subtitle">課程副標題</Label>
                    <Input
                      id="subtitle"
                      placeholder="深入淺出的講解..."
                      {...register("subtitle")}
                      className={`w-full max-w-full ${
                        errors.subtitle ? "border-red-500" : ""
                      }`}
                    />
                    {errors.subtitle && (
                      <p className="text-sm text-red-500 break-words">
                        {errors.subtitle.message}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500 break-words">
                      在課程名稱下方顯示，您可以為課程添加額外的說明、性格和或標語。
                    </p>
                  </div>

                  {/* 課程介紹 */}
                  <div className="space-y-2 w-full max-w-full">
                    <Label htmlFor="description">
                      課程介紹 <span className="text-red-500">*</span>
                    </Label>
                    <div className="w-full max-w-full">
                      <RichTextEditor
                        id="description"
                        value={watch("description")}
                        onChange={(content) => {
                          setValue("description", content, {
                            shouldValidate: true,
                          });
                        }}
                        minHeight={window.innerWidth < 768 ? 200 : 200}
                        maxHeight={window.innerWidth < 768 ? 300 : 398}
                        maxImageSize={0.05}
                        maxContentSize={1}
                        className={`w-full max-w-full ${
                          errors.description ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.description && (
                      <p className="text-sm text-red-500 break-words">
                        {errors.description.message}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500 break-words">
                      詳細描述課程內容，讓學生更好地了解課程的學習目標和價值。
                    </p>
                  </div>

                  {/* 課程亮點 */}
                  <div className="space-y-2 w-full max-w-full">
                    <Label htmlFor="highlight">課程亮點</Label>
                    <Input
                      id="highlight"
                      placeholder="學習 xxx 的關鍵基礎知識"
                      {...register("highlight")}
                      className={`w-full max-w-full ${
                        errors.highlight ? "border-red-500" : ""
                      }`}
                    />
                    {errors.highlight && (
                      <p className="text-sm text-red-500 break-words">
                        {errors.highlight.message}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500 break-words">
                      列出本課程的學習亮點將有助於學生更好地理解你的課程內容。
                    </p>
                  </div>

                  {/* 課程類型 */}
                  <div className="space-y-2 w-full max-w-full">
                    <Label>
                      課程類型 <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex flex-col space-y-3 md:flex-row md:gap-4 md:space-y-0 w-full max-w-full">
                      {/* 付費課程 */}
                      <label
                        className={`flex-1 border rounded-lg p-3 md:p-4 cursor-pointer flex items-start gap-2 transition w-full max-w-full
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
                          className="mt-1 accent-blue-500 flex-shrink-0"
                        />
                        <div className="w-full max-w-full">
                          <div className="font-bold text-sm md:text-base">
                            付費課程
                          </div>
                          <div className="text-xs md:text-sm text-gray-500 break-words">
                            您可以設定付費內容的價格和促銷條件。
                          </div>
                        </div>
                      </label>

                      {/* 免費課程 */}
                      <label
                        className={`flex-1 border rounded-lg p-3 md:p-4 cursor-pointer flex items-start gap-2 transition w-full max-w-full
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
                          className="mt-1 accent-blue-500 flex-shrink-0"
                          onChange={(e) => {
                            register("courseType").onChange(e);
                            setValue("price", "");
                          }}
                        />
                        <div className="w-full max-w-full">
                          <div className="font-bold text-sm md:text-base">
                            免費課程 / 引導磁鐵
                          </div>
                          <div className="text-xs md:text-sm text-gray-500 break-words">
                            引導磁石允許用戶在註冊後兌換和解鎖內容，可用於增加和累積您的會員名單。
                          </div>
                        </div>
                      </label>
                    </div>
                    {errors.courseType && (
                      <p className="text-sm text-red-500 break-words">
                        {errors.courseType.message}
                      </p>
                    )}
                  </div>

                  {/* 課程時長 */}
                  <div className="space-y-2 w-full max-w-full">
                    <Label htmlFor="duration">
                      課程時長（小時） <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="請輸入課程時長"
                      {...register("duration")}
                      className={`w-full max-w-full ${
                        errors.duration ? "border-red-500" : ""
                      }`}
                    />
                    {errors.duration && (
                      <p className="text-sm text-red-500 break-words">
                        {errors.duration.message}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500 break-words">
                      例如，對於10小時30分鐘，輸入
                      10.5。課程時長為必填，不可留白。
                    </p>
                  </div>

                  {/* 課程價格 - 只在付費課程時顯示 */}
                  {courseType === "paid" && (
                    <div className="space-y-2 w-full max-w-full">
                      <Label htmlFor="price">
                        課程價格 <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex">
                        <span
                          className="flex items-center justify-center border border-slate-200 rounded-l-md bg-slate-50 px-4 text-gray-700 text-lg"
                          style={{ height: 40 }}
                        >
                          $
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
                        <p className="text-sm text-red-500 break-words">
                          {errors.price.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* 桌面版按鈕 - 只在桌面版顯示 */}
                  <div className="hidden md:flex justify-end space-x-4">
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
            <div className="md:w-4/12 w-full max-w-full mt-3 md:mt-0">
              <h2 className="text-xl font-bold mb-4 md:mb-6 px-4 md:px-0">
                課程縮圖
              </h2>

              {/* 桌面版封面區域 */}
              <div className="bg-white border border-blue-100 rounded-2xl hidden md:block">
                <div className="p-4 pb-3 space-y-2">
                  <Label className="block font-medium text-slate-800">
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
                          <ImagePlus
                            size={40}
                            className="text-slate-400 mb-2"
                          />
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
                    <div className="text-red-500 text-sm">
                      檔案格式或大小不符，請選擇 2MB 以內的圖片檔案。
                    </div>
                  )}

                  {/* 上傳狀態顯示 */}
                  {isUploading && (
                    <div className="text-blue-600 text-sm flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                      圖片上傳中，請稍候...
                    </div>
                  )}

                  {/* 上傳提示 */}
                  <p className="text-xs text-gray-500">
                    建議尺寸：1280x720 像素，格式：JPG、PNG、GIF，大小不超過 2MB
                  </p>
                </div>
              </div>

              {/* 手機版封面區域 */}
              <div className="bg-white block md:hidden w-full max-w-full">
                <div className="px-4 pt-4 pb-2">
                  <Label className="block font-medium text-slate-800 text-lg">
                    封面圖片
                  </Label>
                </div>

                {/* 手機版圖片上傳區域 */}
                <div className="px-4 pb-2 space-y-2 w-full max-w-full">
                  <div className="relative group w-full max-w-full">
                    <div
                      {...getRootProps()}
                      className={`
                        h-48 sm:h-64 border-2 border-dashed transition cursor-pointer flex flex-col items-center justify-center w-full max-w-full
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
                            className="w-full h-full object-cover"
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
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
                        <div className="flex flex-col items-center px-2">
                          <ImagePlus
                            size={32}
                            className="text-slate-400 mb-2"
                          />
                          <div className="font-bold text-base text-slate-800 mb-1 text-center">
                            <p className="px-2 py-1 text-sm">
                              {isUploading ? "上傳中..." : "點擊以選擇圖片"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 手機版錯誤訊息和提示 */}
                  {fileRejections.length > 0 && (
                    <div className="text-red-500 text-sm break-words">
                      檔案格式或大小不符，請選擇 2MB 以內的圖片檔案。
                    </div>
                  )}

                  {isUploading && (
                    <div className="text-blue-600 text-sm flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                      圖片上傳中，請稍候...
                    </div>
                  )}

                  <p className="text-xs text-gray-500 break-words">
                    建議尺寸：1280x720 像素，格式：JPG、PNG、GIF，大小不超過 2MB
                  </p>
                </div>

                {/* 手機版按鈕區域 - 固定在底部 */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-3 block md:hidden z-50 shadow-lg">
                  <div className="flex space-x-3 w-full max-w-full">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isUpdating || isUploading}
                      className="flex-1 text-sm h-10"
                    >
                      取消
                    </Button>
                    <Button
                      type="submit"
                      disabled={isUpdating || isUploading}
                      className="bg-orange-600 hover:bg-orange-700 text-white flex-1 text-sm h-10"
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
          </div>
        </form>
      </div>

      {/* 全螢幕 Loading */}
      <ScreenLoading />
    </div>
  );
}
