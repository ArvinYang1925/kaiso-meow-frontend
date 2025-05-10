import { useForm } from "react-hook-form";
import { RegisterFormData } from "@/services/types";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { useDialogStore } from "@/stores/commonDialogStore";
import { Button } from "@/components/ui/button";
import { FormValidateInput } from "@/components/common/FormValidateInput";
import { useState } from "react";

export const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const { isLoading, getHomeRedirect, register: registerUser } = useAuthStore();
  const navigate = useNavigate();
  const { showCommonDialog } = useDialogStore();
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(""); // 清除前次錯誤訊息
    if (data.password !== data.confirmPassword) {
      return;
    }

    try {
      const result = await registerUser(data);
      if (result.success) {
        navigate(getHomeRedirect());
      } else {
        // 顯示後端回傳錯誤（如有）
        setServerError(result.message || "帳號或密碼錯誤，請再試一次");
      }
    } catch (error) {
      showCommonDialog({
        title: "註冊失敗",
        description: "請稍後再試",
      });
      console.error("Register error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
        加入會員
      </h2> */}

      <FormValidateInput
        id="name"
        className="mb-4"
        label={"姓名"}
        type={"text"}
        placeholder={"姓名"}
        register={register}
        rules={{ required: "請輸入姓名" }}
        error={errors.name}
      />

      <FormValidateInput
        id="email"
        className="mb-4"
        label={"電子郵件"}
        type={"email"}
        placeholder={"電子郵件"}
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

      <FormValidateInput
        id="password"
        className="mb-4"
        label={"密碼"}
        type={"password"}
        placeholder="大小寫 8-12 位英數"
        register={register}
        rules={{
          required: "請輸入密碼",
          minLength: { value: 8, message: "密碼長度至少為 8 個字符" },
        }}
        error={errors.password}
      />

      <FormValidateInput
        id="confirmPassword"
        className="mb-4"
        label={"請再次輸入密碼"}
        type={"password"}
        placeholder="大小寫 8-12 位英數"
        register={register}
        rules={{
          required: "請再次輸入密碼",
          validate: (value: string) =>
            value === watch("password") || "密碼不一致",
        }}
        error={errors.confirmPassword}
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
        {isLoading ? "註冊中..." : "註冊帳號"}
      </Button>
    </form>
  );
};

export default RegisterForm;
