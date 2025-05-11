import { FormValidateInput } from "@/components/common/FormValidateInput";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/stores/commonDialogStore";
import { useForm } from "react-hook-form";
import { resetPassword } from "./reset-password.service";
import { useResetPasswordStore } from "./resetPasswordStore";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { CommonDialog } from "@/components/common/CommonDialog";

export type ResetPasswordFormData = {
  newPassword: string;
  confirmNewPassword: string;
};

const ResetPasswordPage: React.FC = () => {
  const { isLoading, serverError, setServerError } = useResetPasswordStore();
  const { showCommonDialog } = useDialogStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  const { token = "" } = useParams();

  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerError(""); // 清除前次錯誤訊息

    if (token == "") {
      showCommonDialog({
        title: "請求失敗",
        description: `token 不可為空`,
      });
    }

    const postData = {
      token, //路由取得
      newPassword: data.newPassword,
    };

    try {
      const result = await resetPassword(postData);

      if (result.status === "success") {
        showCommonDialog({
          title: "請求成功",
          description: `${result.message}`,
        });
      } else {
        // 顯示後端回傳錯誤（如有）
        setServerError(result.message || "請求失敗，請再試一次");
      }
    } catch (error: any) {
      console.error("error:", error);
      const { status, message } = error.response.data;
      showCommonDialog({
        title: `${status}`,
        description: `${message}`,
      });
    }

    reset();
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-200 flex items-center justify-center">
        <div className="relative z-10 w-full max-w-md">
          <Card
            className="w-full max-w-md shadow-lg overflow-hidden"
            style={{ height: "400px" }}
          >
            <CardHeader>
              <h5 className="text-center font-medium pt-4">程式喵學院</h5>
              {/* <img src="" alt="" /> */}
            </CardHeader>

            <CardContent className="p-6 bg-white">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                <div className="content space-y-4">
                  <div className="space-y-1">
                    <FormValidateInput
                      id="newPassword"
                      label={"重設密碼"}
                      type={"password"}
                      placeholder="大小寫 8-12 位英數"
                      register={register}
                      rules={{
                        required: "請輸入密碼",
                        minLength: {
                          value: 8,
                          message: "密碼長度至少為 8 個字符",
                        },
                      }}
                      error={errors.newPassword}
                    />
                  </div>

                  <div className="space-y-1">
                    <FormValidateInput
                      id="confirmNewPassword"
                      label={"再次確認密碼"}
                      type={"password"}
                      placeholder={"請再次輸入您的密碼"}
                      register={register}
                      rules={{
                        required: "請再次輸入密碼",
                        validate: (value: string) =>
                          value === watch("newPassword") || "密碼不一致",
                      }}
                      error={errors.confirmNewPassword}
                    />
                  </div>

                  {/* API 回傳錯誤訊息 */}
                  {serverError && (
                    <div className="text-red-500 text-sm text-center">
                      {serverError}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-600 hover:bg-orange-500 border-none"
                >
                  {isLoading ? "發送中..." : "設定密碼"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
      <CommonDialog />
    </>
  );
};

export default ResetPasswordPage;
