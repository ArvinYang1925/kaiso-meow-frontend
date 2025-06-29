import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "@/app/route-path";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { usePasswordStore } from "./stores/passwordStore";
import { FormValidateInput } from "@/components/common/FormValidateInput";
import { PasswordFormValues } from "./models/password.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDialogStore } from "@/stores/commonDialogStore";

/**
 * 密碼表單驗證 Schema
 */
const passwordFormSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, "密碼長度至少為 8 個字符")
      .max(12, "密碼長度最多為 12 個字符")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,12}$/,
        "密碼必須包含大小寫字母和數字"
      ),
    newPassword: z
      .string()
      .min(8, "密碼長度至少為 8 個字符")
      .max(12, "密碼長度最多為 12 個字符")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,12}$/,
        "密碼必須包含大小寫字母和數字"
      ),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "兩次輸入的密碼不一致",
    path: ["confirmNewPassword"],
  });

export default function PasswordPage() {
  const navigate = useNavigate();
  const { isLoading, error, changePassword } = usePasswordStore();
  const { showCommonDialog } = useDialogStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
  });

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      const success = await changePassword(data);
      if (success) {
        reset();
        navigate(ADMIN_ROUTES.ME);
      }
    } catch (error) {
      showCommonDialog({
        type: "failed",
        message: error instanceof Error ? error.message : "密碼變更失敗",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">變更密碼</h1>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <FormValidateInput
                  id="oldPassword"
                  className="mb-4"
                  label="舊密碼"
                  type="password"
                  placeholder="大小寫 8-12 位英數"
                  register={register}
                  error={errors.oldPassword}
                />
                {error?.includes("舊密碼") && (
                  <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
              </div>

              <div className="space-y-2">
                <FormValidateInput
                  id="newPassword"
                  className="mb-4"
                  label="新密碼"
                  type="password"
                  placeholder="大小寫 8-12 位英數"
                  register={register}
                  error={errors.newPassword}
                />
                {error?.includes("新密碼") && (
                  <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
              </div>

              <div className="space-y-2">
                <FormValidateInput
                  id="confirmNewPassword"
                  label="再次確認密碼"
                  type="password"
                  placeholder="請再次輸入新密碼"
                  register={register}
                  error={errors.confirmNewPassword}
                />
                {error?.includes("確認密碼") && (
                  <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(ADMIN_ROUTES.ME)}
              >
                取消
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-orange-600 hover:bg-orange-700 text-white">
                {isLoading ? "更新中..." : "更新密碼"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
