import newsletterBackgroundImg from "@/assets/homepage/subscribe-background.jpg";
import newsletterCat from "@/assets/homepage/subscribe-cat.png";
import { FormValidateInput } from "@/components/common/FormValidateInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { NewsletterFormData } from "../services/home-page.service";
import { useHomePageStore } from "../store/homePageStore";
import { useDialogStore } from "@/stores/commonDialogStore";
import { handleErrorMessageDialog } from "@/lib/helper";

const NewsletterComponent: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsletterFormData>();

  const { createNewsletter } = useHomePageStore();
  const { showCommonDialog } = useDialogStore();

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      const result = await createNewsletter(data);
      const { message } = result;

      showCommonDialog({
        type: "success",
        message,
      });
    } catch (error) {
      handleErrorMessageDialog(error);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${newsletterBackgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "891px",
        width: "100%",
      }}
    >
      <div className="newsletter-info px-8">
        <div className="container flex flex-col items-center text-center text-white mb-6">
          <img src={newsletterCat} className="w-[96px] h-[87px] mb-6" />
          <div className="text-content text-white space-y-2">
            <div className="title">
              <h1 className="font-medium text-[24px] md:text-[48px]">
                免費加入 12000+ 人訂閱的
              </h1>
              <h1 className="font-medium text-[24px] md:text-[48px]">
                「程式喵月報」
              </h1>
            </div>

            <p>每個月，寄送ㄧ則簡潔有力的喵報給你，</p>
            <p>讓你在資訊爆炸的時代，鎖定目標，穩定升級你的程式技能樹。</p>
          </div>
        </div>

        <Card className="p-12 w-full">
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm space-y-px">
              <FormValidateInput
                id="name"
                className="mb-4"
                label={"名稱"}
                type={"text"}
                placeholder={"請輸入名稱"}
                register={register}
                rules={{
                  required: "名稱為必填",
                  pattern: {
                    value: /^[\u4e00-\u9fa5_a-zA-Z0-9\s]{2,30}$/, // 範例：中英數，長度2~30
                    message: "名稱格式不正確",
                  },
                }}
                error={errors.name}
              />

              <FormValidateInput
                id="email"
                className="mb-4"
                label={"Email"}
                type={"email"}
                placeholder={"請輸入 Email"}
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
            </div>
            <Button className="bg-orange-500 w-full hover:bg-orange-600">
              加入訂閱
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
export default NewsletterComponent;
