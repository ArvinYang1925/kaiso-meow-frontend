import { FormValidateInput } from "@/components/common/FormValidateInput";
import { Button } from "@/components/ui/button";
import { handleErrorMessageDialog } from "@/lib/helper";
import { useAuthStore } from "@/stores/authStore";
import { useDialogStore } from "@/stores/commonDialogStore";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
};

export const PasswordForgottenForm: React.FC = () => {
  const { isLoading, setIsShowPasswordForgotForm, sendPasswordForgotLetter } =
    useAuthStore();
  const { showCommonDialog } = useDialogStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const result = await sendPasswordForgotLetter(data);
      const { message, status } = result;

      if (status === "success") {
        showCommonDialog({
          type: "success",
          message,
        });
      } else {
        showCommonDialog({
          type: "failed",
          message,
        });
      }
    } catch (error) {
      handleErrorMessageDialog(error);
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
