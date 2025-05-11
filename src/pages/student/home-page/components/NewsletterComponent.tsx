import newsletterBackgroundImg from "@/assets/homepage/subscribe-background.jpg";
import newsletterCat from "@/assets/homepage/subscribe-cat.png";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const NewsletterComponent: React.FC = () => {
  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-24"
      style={{
        backgroundImage: `url(${newsletterBackgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "891px",
        width: "100%",
      }}
    >
      <div className="newsletter-info flex flex-col items-center text-center text-white mb-6 max-w-3xl">
        <img src={newsletterCat} className="w-[96px] h-[87px] mb-6" />
        <div className="text-content text-white space-y-2">
          <div className="title">
            <h1 className="font-medium text-[48px]">
              免費加入 12000+ 人訂閱的
            </h1>
            <h1 className="font-medium text-[48px]">「程式喵月報」</h1>
          </div>

          <p>每個月，寄送ㄧ則簡潔有力的喵報給你，</p>
          <p>讓你在資訊爆炸的時代，鎖定目標，穩定升級你的程式技能樹。</p>
        </div>
      </div>

      <Card className="p-12 w-[628px]">
        <Button className="bg-orange-500 w-full">加入訂閱</Button>
      </Card>
    </div>
  );
};
export default NewsletterComponent;
