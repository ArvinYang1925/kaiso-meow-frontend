import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "@/app/route-path";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useInstructorProfileStore } from "@/pages/admin/instructor-info-page/stores/instructorInfoStore";
import { useScreenLoading } from "@/components/common/useScreenLoading";
import { useDialogStore } from "@/stores/commonDialogStore";
import cloudUpload from "@/assets/cloud-upload.svg";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { FileRejection } from "react-dropzone";

const DEFAULT_AVATAR =
  "https://storage.googleapis.com/kaiso-meow-backend.firebasestorage.app/images/instructor_avatar/instructor-59f470c5-cae0-4053-a168-3de51253e470-1748317241181.png";

// 表單驗證規則
const formSchema = z.object({
  name: z.string().min(1, "請輸入姓名"),
  email: z.string().email("請輸入有效的電子郵件"),
});

type FormValues = z.infer<typeof formSchema>;

export default function InstructorInfoPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { showCommonDialog } = useDialogStore();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isPageDragActive, setIsPageDragActive] = useState(false);

  // 全螢幕 Loading
  const { ScreenLoading, withLoading } = useScreenLoading();

  const {
    profile,
    isLoading,
    isUploading,
    avatarPreview,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    resetForm,
    resetToDefaultAvatar,
  } = useInstructorProfileStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const handleUploadAvatar = useCallback(
    async (file: File) => {
      // 防止重複上傳
      if (isUploading) {
        return;
      }

      // 檔案大小檢查
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "檔案過大",
          description: "圖片大小不能超過 2MB",
        });
        return;
      }

      // 檔案類型檢查
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "檔案格式錯誤",
          description: "請選擇圖片檔案",
        });
        return;
      }

      try {
        await withLoading(async () => {
          await uploadAvatar(file);
          setShowUploadModal(false);
          setIsPageDragActive(false);

          // 顯示上傳成功訊息，提醒用戶需要點擊更新按鈕
          toast({
            title: "圖片上傳成功",
            description: "請點擊「更新」按鈕以保存變更",
          });
        }, "正在上傳頭像...");
      } catch (error) {
        // 上傳失敗時顯示錯誤訊息
        const errorMessage =
          error instanceof Error ? error.message : "頭像上傳失敗，請稍後再試";
        toast({
          variant: "destructive",
          title: "上傳失敗",
          description: errorMessage,
        });
        setShowUploadModal(false);
        setIsPageDragActive(false);
      }
    },
    [uploadAvatar, toast, withLoading, isUploading]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
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
        handleUploadAvatar(file);
      }
    },
    [handleUploadAvatar, toast]
  );

  // Dropzone for modal (全頁拖曳)
  const {
    getRootProps: getModalRootProps,
    getInputProps: getModalInputProps,
    isDragActive: isModalDragActive,
    fileRejections,
  } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif"] },
    maxSize: 2 * 1024 * 1024,
    maxFiles: 1,
    noClick: false,
    noDrag: false,
    onDrop,
    onDragEnter: () => setIsPageDragActive(true),
    onDragLeave: () => setIsPageDragActive(false),
  });

  // 全頁 Dropzone（拖曳時顯示遮罩）
  const {
    getRootProps: getPageRootProps,
    getInputProps: getPageInputProps,
    isDragActive: isPageDragActiveGlobal,
  } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif"] },
    maxSize: 2 * 1024 * 1024,
    maxFiles: 1,
    noClick: true,
    noDrag: false,
    onDrop,
    onDragEnter: () => setIsPageDragActive(true),
    onDragLeave: () => setIsPageDragActive(false),
  });

  /** 初始載入資料 */
  useEffect(() => {
    const initializePage = async () => {
      await withLoading(() => fetchProfile(), "正在載入個人資料...");
    };

    initializePage();
  }, [fetchProfile, withLoading]);

  useEffect(() => {
    if (profile.name || profile.email) {
      form.reset({
        name: profile.name || "",
        email: profile.email || "",
      });
    }
  }, [form, profile]);

  // 表單提交處理
  const onSubmit = async (data: FormValues) => {
    try {
      await withLoading(async () => {
        const updateData = {
          name: data.name,
          avatar: avatarPreview,
        };

        await updateProfile(updateData);

        // 更新成功後顯示訊息
        toast({
          title: "更新成功",
          description: "個人資料已成功更新",
        });
      }, "正在更新個人資料...");
    } catch (error) {
      // 錯誤處理
      const errorMessage =
        error instanceof Error ? error.message : "更新失敗，請稍後再試";
      showCommonDialog({
        title: "更新失敗",
        description: errorMessage,
      });
    }
  };

  // 取消按鈕處理
  const handleCancel = () => {
    // 重置表單為原始資料
    form.reset({
      name: profile.name,
      email: profile.email,
    });
    // 重置頭像
    resetForm();
    // 導航回後台首頁
    navigate(ADMIN_ROUTES.DASHBOARD);
  };

  // 變更密碼按鈕處理
  const handleChangePassword = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(ADMIN_ROUTES.CHANGE_PASSWORD);
  };

  // 移除頭像處理 - 恢復預設頭像
  const handleRemoveAvatar = () => {
    resetToDefaultAvatar();
    toast({
      title: "已重置頭像",
      description: "已恢復使用預設頭像",
    });
  };

  const handleOpenUploadModal = () => {
    setShowUploadModal(true);
  };

  // 判斷是否為自定義頭像（非預設頭像）
  const hasCustomAvatar =
    avatarPreview &&
    avatarPreview !== DEFAULT_AVATAR &&
    !avatarPreview.includes(
      "instructor-59f470c5-cae0-4053-a168-3de51253e470-1748317241181.png"
    );

  return (
    <>
      <div {...getPageRootProps()} className="container mx-auto py-8 relative">
        <input {...getPageInputProps()} />
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">個人設定</h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* 頭像區塊 */}
              <div className="space-y-4">
                <Label className="block">頭像</Label>
                <div className="flex flex-col items-start gap-2 w-full">
                  <div className="w-full md:w-[200px] flex flex-col items-center">
                    {/* 上傳按鈕 */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mb-2 flex items-center justify-center w-full shadow-none border-none bg-transparent hover:bg-transparent focus:ring-0 focus:outline-none text-black hover:text-blue-600"
                      onClick={handleOpenUploadModal}
                      disabled={isUploading}
                    >
                      <img
                        src={cloudUpload}
                        alt="上傳圖標"
                        className="w-4 h-4 mr-2 filter-blue-500"
                      />
                      {hasCustomAvatar ? "重新上傳大頭照" : "上傳新的大頭照"}
                    </Button>

                    {/* 頭像容器 */}
                    <div className="w-full md:w-[200px] aspect-square relative">
                      <div className="w-full h-full border border-gray-300 rounded-xl overflow-hidden flex items-center justify-center bg-gray-50">
                        <img
                          src={avatarPreview}
                          alt="頭像"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = DEFAULT_AVATAR;
                          }}
                        />

                        {/* 上傳狀態指示器 */}
                        {isUploading && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                            <div className="text-white text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                              <p className="text-sm">上傳中...</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {hasCustomAvatar && !isUploading && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white p-0 border-2 border-white shadow-lg z-10"
                          onClick={handleRemoveAvatar}
                          title="移除頭像"
                        >
                          <X size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 姓名欄位 */}
              <div className="space-y-2">
                <Label htmlFor="name" className="block">
                  姓名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  className="w-full"
                  disabled={isLoading || isUploading}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* 電子郵件欄位 - 不可更改 */}
              <div className="space-y-2">
                <Label htmlFor="email" className="block">
                  電子郵件
                </Label>
                <Input
                  id="email"
                  className="w-full bg-gray-50"
                  value={profile.email || ""}
                  disabled
                />
              </div>

              {/* 變更密碼連結 */}
              <div className="mb-6">
                <Button
                  variant="link"
                  className="text-blue-600 hover:underline p-0 h-auto"
                  onClick={handleChangePassword}
                  disabled={isLoading || isUploading}
                >
                  變更密碼
                </Button>
              </div>

              {/* 按鈕區塊 */}
              <div className="flex flex-row justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading || isUploading}
                  className="w-1/2 md:w-auto"
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || isUploading}
                  className="w-1/2 md:w-auto bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isLoading ? "更新中..." : isUploading ? "上傳中..." : "更新"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 全頁上傳 Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div
              {...getModalRootProps()}
              className="fixed inset-0 flex items-center justify-center"
              style={{ cursor: "pointer" }}
            >
              <input {...getModalInputProps()} />
              <div
                className={`bg-white rounded-2xl border-2 border-dashed border-blue-400 shadow-2xl p-10 flex flex-col items-center transition-all ${
                  isPageDragActive || isModalDragActive
                    ? "bg-blue-50 border-blue-500"
                    : ""
                }`}
                style={{ minWidth: 340, minHeight: 260 }}
              >
                <img
                  src={cloudUpload}
                  alt="上傳圖標"
                  className="w-10 h-10 mb-4"
                />
                <div className="font-bold text-lg text-blue-600 mb-2 text-center">
                  {isPageDragActive || isModalDragActive
                    ? "放開以上傳圖片"
                    : "拖曳圖片到此處或點擊以上傳"}
                </div>
                <div className="text-slate-500 text-base text-center">
                  僅支援 JPG、PNG，最大 2MB
                </div>
                {fileRejections && fileRejections.length > 0 && (
                  <div className="text-red-500 text-sm mt-2">
                    檔案格式或大小不符，請選擇 2MB 以內的圖片檔案。
                  </div>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUploadModal(false);
                    setIsPageDragActive(false);
                  }}
                  disabled={isUploading}
                >
                  取消
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 全頁拖曳時遮罩提示 */}
        {isPageDragActiveGlobal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center pointer-events-none transition">
            <div className="bg-white/95 rounded-2xl p-10 flex flex-col items-center shadow-2xl border-2 border-blue-400 border-dashed">
              <img
                src={cloudUpload}
                alt="上傳圖標"
                className="w-10 h-10 mb-4"
              />
              <div className="font-bold text-2xl text-blue-600 mb-2 text-center">
                拖曳圖片到此處以上傳大頭照
              </div>
              <div className="text-slate-500 text-base text-center">
                僅支援 JPG、PNG，最大 2MB
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 全螢幕 Loading */}
      <ScreenLoading />
    </>
  );
}
