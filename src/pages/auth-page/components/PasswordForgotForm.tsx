import { FormValidateInput } from "@/components/common/FormValidateInput";
import { Button } from "@/components/ui/button";
import { sendPasswordForgotLetter } from "@/services/auth.service";
import { useAuthStore } from "@/stores/authStore";
import { useDialogStore } from "@/stores/commonDialogStore";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
};

export const PasswordForgottenForm: React.FC = () => {
  const { isLoading, setIsShowPasswordForgotForm } = useAuthStore();

  const [serverError, setServerError] = useState(""); //可以整合
  const { showCommonDialog } = useDialogStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setServerError(""); // 清除前次錯誤訊息

    try {
      const result = await sendPasswordForgotLetter(data);

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
  };

  return (
    <>
      <div className="header mb-8">
        <div className="btn-wrap flex items-center mb-4">
          <Button
            size={"sm"}
            className="bg-transparent border hover:bg-gray-100 px-2 text-gray me-4"
            onClick={() => setIsShowPasswordForgotForm(false)}
          >
            返回
          </Button>
          <h5 className="text-lg font-bold">忘記密碼</h5>
        </div>

        <p className="text-sm">
          請輸入您的電子郵件，我們將發送密碼重設連結給您。
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormValidateInput
          id="email"
          className="mb-4"
          label={"電子郵件"}
          type={"email"}
          placeholder={"請輸入您的電子郵件"}
          register={register}
          rules={{
            required: "請輸入電子郵件",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "請輸入有效的電子郵件格式",
            },
          }}
          error={errors.email}
        />

        {/* API 回傳錯誤訊息 */}
        {serverError && (
          <div className="text-red-500 text-sm text-center">{serverError}</div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-600 hover:bg-orange-500 border-none"
        >
          {isLoading ? "發送中..." : "發送密碼重設信"}
        </Button>
      </form>
    </>
  );
};

export default PasswordForgottenForm;
