import React, { useEffect } from "react";
import "@/index.css";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useDialogStore } from "@/stores/commonDialogStore";
import { useForm } from "react-hook-form";
import { FormValidateInput } from "@/components/common/FormValidateInput";

type FormData = {
  email: string;
  password: string;
};

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { showCommonDialog } = useDialogStore();
  const {
    login,
    isLoading,
    isAuthenticated,
    setIsShowPasswordForgotForm,
    getHomeRedirect,
  } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const result = await login(data);
      const { status, message } = result;

      if (status == "success") {
        navigate(getHomeRedirect());
      } else {
        showCommonDialog({
          title: `${status}`,
          description: `${message}`,
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const { status, message } = error.response.data;
      showCommonDialog({
        title: `${status}`,
        description: `${message}`,
      });
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
          {/* <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            會員登入
          </h2> */}
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

          <div className="btn-wrapper flex justify-end">
            <Button
              type="button"
              className="bg-gray-400 hover:bg-gray-500"
              onClick={() => setIsShowPasswordForgotForm(true)}
            >
              忘記密碼
            </Button>
          </div>

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
