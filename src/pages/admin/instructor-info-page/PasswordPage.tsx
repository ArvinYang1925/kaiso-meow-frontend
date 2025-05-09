import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "@/app/route-path";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePasswordStore } from "./stores/passwordStore";


// 定義表單驗證 schema
const formSchema = z.object({
  currentPassword: z.string().min(1, "目前密碼為必填欄位"),
  newPassword: z.string().min(1, "新密碼為必填欄位"),
  confirmPassword: z.string().min(1, "確認密碼為必填欄位"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "新密碼與確認密碼不相符",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export default function PasswordPage() {
  const navigate = useNavigate();
  const { isLoading, changePassword } = usePasswordStore();

  // 使用 react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // 表單提交處理
  const onSubmit = async (data: FormValues) => {
    const success = await changePassword(data);
    
    if (success) {
      form.reset();
      navigate(ADMIN_ROUTES.ME);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">變更密碼</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* 隱藏的用戶名字段 */}
            <div className="hidden">
              <Input
                type="text"
                autoComplete="username"
                value={localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")!).email : ""}
                readOnly
              />
            </div>

            {/* 目前密碼欄位 */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="block">
                目前密碼 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="currentPassword"
                type="password"
                {...form.register("currentPassword")}
                className="w-full"
                autoComplete="current-password"
              />
              {form.formState.errors.currentPassword && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* 新密碼欄位 */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="block">
                新密碼 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="newPassword"
                type="password"
                {...form.register("newPassword")}
                className="w-full"
                autoComplete="new-password"
              />
              {form.formState.errors.newPassword && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            {/* 確認密碼欄位 */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="block">
                確認密碼 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                {...form.register("confirmPassword")}
                className="w-full"
                autoComplete="new-password"
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            
            {/* 按鈕區塊 */}
            <div className="flex justify-start space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  navigate(ADMIN_ROUTES.ME);
                }}
              >
                取消
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "更新中..." : "更新密碼"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 