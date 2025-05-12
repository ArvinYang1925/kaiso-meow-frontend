import customer01 from "@/assets/homepage/customer_01.png";
import customer02 from "@/assets/homepage/customer_02.png";
import customer03 from "@/assets/homepage/customer_03.png";
import customer04 from "@/assets/homepage/customer_04.png";
import customer05 from "@/assets/homepage/customer_05.png";
import customer06 from "@/assets/homepage/customer_06.png";

export interface ExpertRecommendationData {
  name: string;
  role: string;
  description: string;
  imageSrc: string;
}

export const expertRecommendations: ExpertRecommendationData[] = [
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
