import { useEffect, useRef } from "react";
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

// 表單驗證規則
const formSchema = z.object({
  name: z.string().min(1, "請輸入姓名"),
  email: z.string().email("請輸入有效的電子郵件"),
});

type FormValues = z.infer<typeof formSchema>;

export default function InstructorInfoPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    profile,
    isLoading,
    avatarPreview,
    selectedFile,
    fetchProfile,
    updateProfile,
    setAvatarPreview,
    setSelectedFile,
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

  // 處理檔案選擇
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // 建立預覽 URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 觸發檔案選擇
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // 表單提交處理
  const onSubmit = async (data: FormValues) => {
    let avatarUrl = profile.profileUrl;

    // 如果有選擇新頭像，需要先上傳圖片
    if (selectedFile) {
      // 這裡應該有上傳圖片的邏輯
      // 假設上傳後會返回圖片URL
      // 範例：const uploadResult = await uploadImage(selectedFile);
      // avatarUrl = uploadResult.url;

      // 因為沒有實際的上傳邏輯，這裡暫時使用預覽URL
      avatarUrl = avatarPreview;
    }

    try {
      await updateProfile({
        name: data.name,
        profileUrl: avatarUrl,
      });
      console.log("Profile updated successfully");
      // 重置選擇的檔案
      setSelectedFile(null);
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
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">個人設定</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* 頭像區塊 */}
            <div className="space-y-4">
              <Label className="block">頭像</Label>
              <div className="flex flex-col space-y-4">
                <div className="w-48 flex justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-fit flex items-center bg-transparent hover:bg-transparent text-black hover:text-blue-500 p-0"
                    onClick={handleUploadClick}
                  >
                    <img
                      src="/src/assets/cloud-upload.svg"
                      alt="上傳圖標"
                      className="w-4 h-4 mr-2 filter-blue-500"
                    />
                    上傳新頭像
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </div>
                <div className="relative">
                  <div className="h-48 w-48 rounded-md flex items-center justify-center overflow-hidden border border-gray-300">
                    <img
                      src={avatarPreview}
                      alt="個人頭像"
                      className="h-full w-full object-cover"
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
            <div className="flex justify-start space-x-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                取消
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "更新中..." : "更新"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
