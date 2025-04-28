import React, { useState } from "react";
import "@/index.css";
import { Button } from "@/components/ui/button";
import { loginUser } from "./login.service";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/AuthStore";

type FormData = {
  email: string;
  password: string;
};

type FormErrors = {
  email?: string;
  password?: string;
};

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login); // 抓 login 方法

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
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
    } else if (formData.password.length < 6) {
      newErrors.password = "密碼長度至少為6個字符";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await loginUser(formData);
      console.log("查看response", response);

      // 假設後端會回傳一個 token
      const token = response.data.data.token;
      const userInfo = response.data.data.userInfo;

      login(token, userInfo); // 這邊用 authStore 的 login 方法

      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      alert("登入成功！");

      const { role } = userInfo;

      if (role == "student") {
        navigate("/home"); // 前台首頁
      } else if (role == "instructor") {
        navigate("/admin"); // 後台首頁
      }
    } catch (error) {
      setErrorMessage("登入失敗，請稍後再試");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
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

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-6 md:flex-row shadow-md">
        <div className="bg-white rounded-2xl p-7 shadow-md min-w-[40vw]">
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

export default LoginPage;
