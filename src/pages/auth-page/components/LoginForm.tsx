import React, { useEffect, useState } from "react";
import "@/index.css";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/AuthStore";
import { useDialogStore } from "@/stores/CommonDialogStore";
import { useForm } from "react-hook-form";
import { FormValidateInput } from "@/components/common/FormValidateInput";

type FormData = {
  email: string;
  password: string;
};

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { showCommonDialog } = useDialogStore();
  const { login, isLoading, isAuthenticated, getHomeRedirect } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [serverError, setServerError] = useState("");

  const onSubmit = async (data: FormData) => {
    setServerError(""); // 清除前次錯誤訊息

    try {
      const result = await login(data);

      if (result.success) {
        navigate(getHomeRedirect());
      } else {
        // 顯示後端回傳錯誤（如有）
        setServerError(result.message || "帳號或密碼錯誤，請再試一次");
      }
    } catch (error) {
      showCommonDialog({
        title: "登入失敗",
        description: "請稍後再試",
      });
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(getHomeRedirect());
    }
  }, [isAuthenticated, navigate, getHomeRedirect]);

  return (
    <div className="bg-white rounded-2xl p-4 w-full">
      <div className="w-full max-w-md px-4">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            會員登入
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <FormValidateInput
              id="email"
              className="mb-4"
              label={"電子郵件"}
              type={"email"}
              placeholder={"請輸入電子郵件"}
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
              label="密碼"
              type="password"
              placeholder="請輸入密碼"
              register={register}
              rules={{
                required: "請輸入密碼",
                minLength: {
                  value: 8,
                  message: "密碼長度至少為8個字符",
                },
              }}
              error={errors.password}
            />
          </div>

          {/* API 回傳錯誤訊息 */}
          {serverError && (
            <div className="text-red-500 text-sm text-center">
              {serverError}
            </div>
          )}

          <div>
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-500 border-none"
              disabled={isLoading}
            >
              {isLoading ? "登入中..." : "登入"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
