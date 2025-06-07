import { useEffect, useState } from "react";
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
import cloudUpload from "@/assets/cloud-upload.svg";
import { useDropzone } from "react-dropzone";
import { Trash2 } from "lucide-react";

const DEFAULT_AVATAR = "https://storage.googleapis.com/kaiso-meow-backend.firebasestorage.app/images/instructor_avatar/instructor-59f470c5-cae0-4053-a168-3de51253e470-1748317241181.png";

// 表單驗證規則
const formSchema = z.object({
  name: z.string().min(1, "請輸入姓名"),
  email: z.string().email("請輸入有效的電子郵件"),
});

type FormValues = z.infer<typeof formSchema>;

export default function InstructorInfoPage() {
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isPageDragActive, setIsPageDragActive] = useState(false);

  const {
    profile,
    isLoading,
    avatarPreview,
    fetchProfile,
    updateProfile,
    setAvatarPreview,
    uploadAvatar,
    resetForm,
  } = useInstructorProfileStore();

  // 使用 react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

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
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        await uploadAvatar(acceptedFiles[0]);
        setShowUploadModal(false);
        setIsPageDragActive(false);
      }
    },
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
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        await uploadAvatar(acceptedFiles[0]);
        setShowUploadModal(false);
        setIsPageDragActive(false);
      }
    },
    onDragEnter: () => setIsPageDragActive(true),
    onDragLeave: () => setIsPageDragActive(false),
  });

  /** 初始載入資料 */
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /** 監聽 profile 變化，更新表單值 */
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
      await updateProfile({
        name: data.name,
        avatar: avatarPreview,
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
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
    setAvatarPreview(profile.profileUrl || "");
    // 導航回後台首頁
    navigate(ADMIN_ROUTES.DASHBOARD);
  };

  // 變更密碼按鈕處理
  const handleChangePassword = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(ADMIN_ROUTES.CHANGE_PASSWORD);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">載入中...</div>
        </div>
      </div>
    );
  }

  return (
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
              <div className="flex flex-col items-start gap-2">
                <div className="w-[200px] flex flex-col items-center">
                  {/* 按鈕切換顯示 */}
                  {avatarPreview ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mb-2 flex items-center justify-center w-full shadow-none border-none bg-transparent hover:bg-transparent focus:ring-0 focus:outline-none text-black hover:text-blue-600 group"
                      onClick={() => {
                        setAvatarPreview("");
                      }}
                    >
                      <Trash2
                        size={18}
                        className="mr-2 text-blue-600 group-hover:text-blue-600 transition-colors"
                      />
                      取消上傳
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mb-2 flex items-center justify-center w-full shadow-none border-none bg-transparent hover:bg-transparent focus:ring-0 focus:outline-none text-black hover:text-blue-600"
                      onClick={() => setShowUploadModal(true)}
                    >
                      <img
                        src={cloudUpload}
                        alt="上傳圖標"
                        className="w-4 h-4 mr-2 filter-blue-500"
                      />
                      上傳新的大頭照
                    </Button>
                  )}
                  <div className="w-[200px] h-[200px] border border-gray-300 rounded-xl overflow-hidden flex items-center justify-center bg-gray-50">
                    <img
                      src={avatarPreview}
                      alt="頭像"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = DEFAULT_AVATAR;
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 姓名欄位 */}
            <div className="space-y-2">
              <Label htmlFor="name" className="block">
                姓名 <span className="text-red-500">*</span>
              </Label>
              <Input id="name" {...form.register("name")} className="w-full" />
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
              >
                變更密碼
              </Button>
            </div>

            {/* 按鈕區塊 */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                取消
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isLoading ? "更新中..." : "更新"}
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
            <img src={cloudUpload} alt="上傳圖標" className="w-10 h-10 mb-4" />
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
  );
}
