import React, { useState } from "react";
import "@/index.css";
import { Button } from "@/components/ui/button";
import { registerUser } from "./register.service";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "請輸入姓名";
    }

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

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "密碼不一致";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      console.log("送出註冊資料", formData);
      const requestData: { email: string; name: string; password: string } = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const response = await registerUser(requestData);
      console.log("查看response", response);

      // 假設後端會回傳一個 token
      const token = response.data.data.token;
      localStorage.setItem("token", token);

      alert("註冊成功！");
    } catch (error: any) {
      console.error("註冊錯誤", error);
      setErrorMessage(error.response?.data?.message || "註冊失敗，請稍後再試");
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

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-7">
      <div className="bg-white rounded-2xl p-7 shadow-md min-w-[40vw]">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          加入會員
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* name */}
          <div>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="姓名"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          {/* email */}
          <div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="電子郵件"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
          {/* password */}
          <div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="密碼"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>
          {/* confirmPassword */}
          <div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="確認密碼"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          {/* error message */}
          {errorMessage && (
            <div className="text-red-500 text-sm text-center">
              {errorMessage}
            </div>
          )}
          {/* submit */}
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
              {isLoading ? "註冊中..." : "註冊帳號"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
