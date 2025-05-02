import React, { useEffect, useState } from "react";
import "@/index.css";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/AuthStore";
import { useDialogStore } from "@/stores/CommonDialogStore";

type FormData = {
  email: string;
  password: string;
};

type FormErrors = {
  email?: string;
  password?: string;
};

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { showCommonDialog } = useDialogStore();
  const { login, isLoading, isAuthenticated, getHomeRedirect } = useAuthStore();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "請輸入電子郵件";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "請輸入有效的電子郵件格式";
    }

    if (!formData.password) {
      newErrors.password = "請輸入密碼";
    } else if (formData.password.length < 8) {
      newErrors.password = "密碼長度至少為8個字符";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setErrorMessage("");

    try {
      const result = await login(formData); // 這邊用 authStore 的 login 方法

      if (result.success) navigate(getHomeRedirect());
    } catch (error) {
      showCommonDialog({
        title: "登入失敗",
        description: "請稍後再試",
      });
      console.error("Login error:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 清除對應的錯誤信息
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // 已登入的用戶直接導航到首頁
  useEffect(() => {
    if (isAuthenticated) {
      navigate(getHomeRedirect());
    }
  }, []);

  return (
    <>
      <div className="bg-white rounded-2xl p-4 w-full">
        <div className="w-full max-w-md px-4">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              會員登入
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  電子郵件
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="電子郵件"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  密碼
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="密碼"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            </div>

            {errorMessage && (
              <div className="text-red-500 text-sm text-center">
                {errorMessage}
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-500 border-none"
                // className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                //   isLoading
                //     ? "bg-indigo-400 cursor-not-allowed"
                //     : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                // }`}
                disabled={isLoading}
              >
                {isLoading ? "登入中..." : "登入"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
