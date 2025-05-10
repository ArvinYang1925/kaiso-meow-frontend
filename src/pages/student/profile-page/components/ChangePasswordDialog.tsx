import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "../profileStore";
import { FormValidateInput } from "@/components/common/FormValidateInput";
import { useForm } from "react-hook-form";
import { PasswordModel } from "../types";
import { updatePassword } from "../profile.service";
import { useDialogStore } from "@/stores/commonDialogStore";

export default function ChangePasswordDialog() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordModel>();

  const [serverError, setServerError] = useState("");
  const { isLoading, isShowDialog, setIsShowDialog } =
    useProfileStore();
  const { showCommonDialog } = useDialogStore();

  const onSubmit = async (data: PasswordModel) => {
    setServerError(""); // 清除前次錯誤訊息

    if (data.newPassword !== data.confirmNewPassword) {
      return;
    }

    try {
      const result = await updatePassword(data);
      if (result.status === "success") {
        showCommonDialog({
          title: "密碼更新成功",
          description: "",
        });
      } else {
        // 顯示後端回傳錯誤（如有）
        setServerError(result.message || "請求發生錯誤，請再試一次");
      }
    } catch (error) {
      showCommonDialog({
        title: "密碼變更失敗",
        description: "請稍後再試",
      });
      console.error("error:", error);
    }

    // resetStore();
    reset();
  };

  return (
    <Dialog open={isShowDialog} onOpenChange={setIsShowDialog}>
      <DialogTrigger asChild>
        <Button className="w-24" variant="outline">
          重設密碼
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>重設密碼</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <FormValidateInput
                id="oldPassword"
                className="mb-4"
                label={"舊密碼"}
                type={"password"}
                placeholder="大小寫 8-12 位英數"
                register={register}
                rules={{
                  required: "請輸入密碼",
                  minLength: { value: 8, message: "密碼長度至少為 8 個字符" },
                }}
                error={errors.oldPassword}
              />
            </div>

            <div className="space-y-1">
              <FormValidateInput
                id="newPassword"
                className="mb-4"
                label={"新密碼"}
                type={"password"}
                placeholder="大小寫 8-12 位英數"
                register={register}
                rules={{
                  required: "請輸入密碼",
                  minLength: { value: 8, message: "密碼長度至少為 8 個字符" },
                }}
                error={errors.newPassword}
              />
            </div>

            <div className="space-y-1">
              <FormValidateInput
                id="confirmNewPassword"
                label={"再次確認密碼"}
                type={"password"}
                placeholder={"請再次輸入新密碼"}
                register={register}
                rules={{
                  required: "請再次輸入密碼",
                  validate: (value: string) =>
                    value === watch("newPassword") || "密碼不一致",
                }}
                error={errors.confirmNewPassword}
              />
            </div>
          </div>

          {/* API 回傳錯誤訊息 */}
          {serverError && (
            <div className="text-red-500 text-sm text-center">
              {serverError}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" onClick={() => setIsShowDialog(false)}>
                取消
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              設定密碼
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
