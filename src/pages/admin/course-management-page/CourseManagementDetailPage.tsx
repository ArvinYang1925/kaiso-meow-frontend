import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ADMIN_ROUTES } from "@/app/route-path";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import RichTextEditor from "@/components/utils/RichTextEditor";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { ImagePlus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCourseStore } from "./courseManagementStore";
import {
  useImageWithFallback,
  DEFAULT_COURSE_COVER,
} from "@/components/utils/courseImageUtils";
import type { FileRejection, FileError } from "react-dropzone";
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

  const {
    currentCourse,
    isLoading,
    isUpdating,
    isUploading,
    coverPreview,
    fetchCourseDetail,
    updateCourseDetail,
    uploadCourseImage,
    setCoverPreview,
    resetCurrentCourse,
  } = useCourseStore();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedCoverUrl, setUploadedCoverUrl] = useState<string>("");
  const [fileObjectUrl, setFileObjectUrl] = useState<string | null>(null);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  // 防止重複上傳的 ref
  const uploadingRef = useRef<boolean>(false);
  const lastUploadedFileRef = useRef<File | null>(null);

  const currentImageSrc = useMemo(() => {
    if (fileObjectUrl) return fileObjectUrl;
    if (uploadedCoverUrl) return uploadedCoverUrl;
    if (coverPreview) return coverPreview;
    return DEFAULT_COURSE_COVER;
  }, [fileObjectUrl, uploadedCoverUrl, coverPreview]);

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

  useEffect(() => {
    if (!courseId) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "無效的課程 ID",
      });
      navigate(ADMIN_ROUTES.COURSES);
      return;
    }

    resetCurrentCourse();
    setIsFormInitialized(false);
    fetchCourseDetail(courseId);
  }, [courseId, fetchCourseDetail, resetCurrentCourse, navigate, toast]);

  // 當課程資料載入完成時，初始化表單
  useEffect(() => {
    if (currentCourse && !isFormInitialized) {
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

      if (currentCourse.coverUrl) {
        setCoverPreview(currentCourse.coverUrl);
        setUploadedCoverUrl(currentCourse.coverUrl);
      }

      setIsFormInitialized(true);
    }
  }, [currentCourse, isFormInitialized, setCoverPreview, reset]);

  const clearFormAndState = useCallback(() => {
    reset();
    setSelectedFile(null);
    setUploadedCoverUrl("");
    setFileObjectUrl(null);
    uploadingRef.current = false;
    lastUploadedFileRef.current = null;
    setCoverPreview(DEFAULT_COURSE_COVER);

    if (fileObjectUrl) {
      URL.revokeObjectURL(fileObjectUrl);
    }
  }, [reset, setCoverPreview, fileObjectUrl]);

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setFileObjectUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      if (fileObjectUrl) {
        URL.revokeObjectURL(fileObjectUrl);
        setFileObjectUrl(null);
      }
    }
  }, [selectedFile, fileObjectUrl]);

  const handleUploadImage = useCallback(
    async (file: File) => {
      if (uploadingRef.current || lastUploadedFileRef.current === file) {
        return;
      }

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
        uploadingRef.current = true;
        lastUploadedFileRef.current = file;

        const uploadedUrl = await uploadCourseImage(file);

        if (uploadedUrl) {
          setUploadedCoverUrl(uploadedUrl);
          setCoverPreview(uploadedUrl);

          toast({
            title: "上傳成功",
            description: "課程封面已成功上傳",
          });
        } else {
          throw new Error("上傳返回空值");
        }
      } catch (error) {
        setSelectedFile(null);
        lastUploadedFileRef.current = null;

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
        uploadingRef.current = false;
      }
    },
    [uploadCourseImage, setCoverPreview, toast]
  );

  const dropzoneOptions: DropzoneOptions = {
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
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections && fileRejections.length > 0) {
        const isSizeError = fileRejections.some((rej: FileRejection) =>
          rej.errors.some((err: FileError) => err.code === "file-too-large")
        );

        const isTypeError = fileRejections.some((rej: FileRejection) =>
          rej.errors.some((err: FileError) => err.code === "file-invalid-type")
        );

        const isTooManyFiles = fileRejections.some((rej: FileRejection) =>
          rej.errors.some((err: FileError) => err.code === "too-many-files")
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
        } else {
          const errorMessages = fileRejections
            .flatMap((rej) => rej.errors.map((err) => err.message))
            .join(", ");

          toast({
            variant: "destructive",
            title: "檔案處理錯誤",
            description: errorMessages,
          });
        }
        return;
      }

      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        if (uploadingRef.current) {
          toast({
            variant: "destructive",
            title: "請稍候",
            description: "圖片正在上傳中，請等待完成",
          });
          return;
        }

        setSelectedFile(file);

        setTimeout(() => {
          handleUploadImage(file);
        }, 100);
      }
    },
    [toast, handleUploadImage]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({ ...dropzoneOptions, onDrop });

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

      const courseData: UpdateCourseModel = {
        title: data.title.trim(),
        subtitle: data.subtitle?.trim() || undefined,
        description: data.description.trim(),
        highlight: data.highlight?.trim() || undefined,
        duration: data.duration ? parseFloat(data.duration) : 0,
        price: data.courseType === "free" ? 0 : parseFloat(data.price || "0"),
        isFree: data.courseType === "free",
        coverUrl:
          uploadedCoverUrl || currentCourse?.coverUrl || DEFAULT_COURSE_COVER,
      };

      const success = await updateCourseDetail(courseId, courseData);

      if (success) {
        toast({
          title: "更新成功",
          description: "課程已成功更新，正在跳轉到章節管理...",
        });

        if (fileObjectUrl) {
          URL.revokeObjectURL(fileObjectUrl);
        }

        // 跳轉到章節管理頁面
        navigate(`${ADMIN_ROUTES.COURSES}/${courseId}/sections`);
      } else {
        throw new Error("更新課程失敗");
      }
    } catch (error) {
      let errorMessage = "更新課程時發生錯誤，請稍後再試";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "更新失敗",
        description: errorMessage,
      });
    }
  };

  const handleCancel = useCallback(() => {
    clearFormAndState();
    navigate(ADMIN_ROUTES.COURSES);
  }, [clearFormAndState, navigate]);

  // 優化的移除封面函數 - 與 CREATE 頁面相同
  const handleRemoveCover = useCallback(() => {
    if (selectedFile) {
      setSelectedFile(null);
    }

    uploadingRef.current = false;
    lastUploadedFileRef.current = null;

    setUploadedCoverUrl("");
    setCoverPreview(DEFAULT_COURSE_COVER);
  }, [selectedFile, setCoverPreview]);

  // 檢查是否有自定義圖片（非預設圖片）
  const hasCustomImage =
    selectedFile ||
    uploadedCoverUrl ||
    (coverPreview && coverPreview !== DEFAULT_COURSE_COVER);
  const hasPreview = true;

  if (isLoading || !isFormInitialized) {
    return <LoadingSkeleton />;
  }

  if (!currentCourse) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">找不到課程</h2>
          <p className="text-gray-500 mb-6">您要編輯的課程不存在或已被刪除。</p>
          <Button onClick={() => navigate(ADMIN_ROUTES.COURSES)}>
            返回課程列表
          </Button>
        </div>
      </div>
    );
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

                {/* 圖片預覽或上傳區域 - 完全使用 CREATE 頁面的樣式 */}
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
                          : uploadedCoverUrl
                          ? "border-green-400 bg-green-50"
                          : "border-blue-300 bg-blue-50"
                      }
                      ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                    style={{ minHeight: 260 }}
                  >
                    <input {...getInputProps()} disabled={isUploading} />

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
                            disabled={isUploading}
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

                {/* 錯誤訊息 - 與 CREATE 頁面相同 */}
                {fileRejections.length > 0 && (
                  <div className="text-red-500 text-sm mt-2">
                    檔案格式或大小不符，請選擇 2MB 以內的圖片檔案。
                  </div>
                )}

                {/* 上傳狀態顯示 - 與 CREATE 頁面相同 */}
                {isUploading && (
                  <div className="text-blue-600 text-sm mt-2 flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                    圖片上傳中，請稍候...
                  </div>
                )}

                {/* 上傳提示 - 與 CREATE 頁面相同 */}
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

const LoadingSkeleton = () => (
  <div className="container mx-auto py-8">
    <div className="flex items-center gap-4 mb-8">
      <Skeleton className="h-8 w-8" />
      <Skeleton className="h-8 w-32" />
    </div>

    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <Skeleton className="h-6 w-24 mb-6" />
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="space-y-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:w-4/12 w-full">
        <Skeleton className="h-6 w-24 mb-6" />
        <div className="bg-white border border-blue-100 rounded-2xl p-4">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);
