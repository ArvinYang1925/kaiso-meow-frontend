import { FC } from "react";
import decorationSvg from "@/assets/homepage/decoration.svg";
import customer01 from "@/assets/homepage/customer_01.png";
import customer02 from "@/assets/homepage/customer_02.png";
import customer03 from "@/assets/homepage/customer_03.png";
import customer04 from "@/assets/homepage/customer_04.png";
import customer05 from "@/assets/homepage/customer_05.png";
import customer06 from "@/assets/homepage/customer_06.png";
import vector from "@/assets/homepage/vector.svg";

interface ExpertRecommendationProps {
  name: string;
  role: string;
  description: string;
  imageSrc: string;
}

const ExpertRecommendation: FC<ExpertRecommendationProps> = ({
  name,
  role,
  description,
  imageSrc,
}) => {
  return (
    // <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm p-0 relative">
    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm p-6 relative">
      <div className="grid grid-cols-[2fr_3fr] gap-4">
        <div className="w-full h-full rounded-full overflow-visible">
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover transform scale-110"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-gray-600 mb-3">{role}</p>
          <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="absolute -bottom-2 right-4 text-3xl text-gray-200 overflow-visible">
        <img src={vector} alt="vector" className="" />
      </div>
    </div>
  );
};

const ExpertRecommendationSection: FC = () => {
  const teamMembers = [
    {
      name: "象折師",
      role: "資深前端顧問",
      description:
        "程式喵不只教技術，她能讓你真的『理解』網頁背後的運作邏輯。React 和 Vue 就像拼圖，在她的指導下，自然地一塊塊拼上去。",
      imageSrc: customer01,
    },
    {
      name: "數據豹",
      role: "資料科學研究員",
      description:
        "程式喵不只教技術，她能讓你真的『理解』網頁背後的運作邏輯。React 和 Vue 就像拼圖，在她的指導下，自然地一塊塊拼上去。",
      imageSrc: customer02,
    },
    {
      name: "牛工匠",
      role: "系統架構師",
      description:
        "全端開發需要的不只是技能，還要耐心與結構思維。程式喵一步步帶你打好底層，程式碼才撐得起真實世界的需求。",
      imageSrc: customer03,
    },
    {
      name: "容器虎",
      role: "DevOps 工程師",
      description:
        "Docker 與 Kubernetes 課程超貼地，尤其喜歡貓咪講師在部署環節中用的比喻，邊學邊笑，還真的懂了容器是怎麼運作的！",
      imageSrc: customer04,
    },
    {
      name: "鷹攀教",
      role: "機器學習 & 前工程經理",
      description:
        "我見過很多技術人卡在職涯轉換期，但程式喵能用最溫柔又犀利的方式，幫你找到方向。她的教學像一雙翅膀，幫助學生飛得更遠。",
      imageSrc: customer05,
    },
    {
      name: "獅算師",
      role: "演算法導師",
      description:
        "程式喵讓演算法不再是冷冰冰的公式，而是變成像故事一樣的邏輯冒險。我學生準備面試，幾乎都靠這套課程進 FAANG。",
      imageSrc: customer06,
    },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Yellow dot pattern decorations */}
      <div className="absolute top-0 left-0 w-48 h-48 opacity-100">
        <img src={decorationSvg} alt="Decoration" className="w-full h-full" />
      </div>
      <div className="absolute bottom-0 right-0 w-48 h-48 opacity-100">
        <img src={decorationSvg} alt="Decoration" className="w-full h-full" />
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-2">專家推薦</h2>
          <div className="w-12 h-1 bg-black mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <ExpertRecommendation
              key={index}
              name={member.name}
              role={member.role}
              description={member.description}
              imageSrc={member.imageSrc}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertRecommendationSection;
