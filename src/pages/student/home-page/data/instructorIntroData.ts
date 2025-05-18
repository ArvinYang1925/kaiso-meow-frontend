import teacher from "@/assets/homepage/teacher.png";

export interface instructorIntro {
  title: string;
  description: string;
  imageSrc: string;
}

export const instructorIntroData: instructorIntro[] = [
  {
    title: "嗨嗨！我是程式喵，一位熱愛程式的貓咪老師！",
    description:
      "擁有 15 年軟體開發的經驗，曾在多家知名外商科技公司擔任資深工程師。" +
      "\n前端、後端、DevOps、系統架構都難不倒我啦！各種程式語言在我面前都乖乖聽話，就像我的小貓咪一樣可愛！" + 
      "\n8年前，我決定不只寫程式，還要教程式！憑藉著滿滿熱情和滿滿的愛，我已幫助上萬名學生成功轉職進入科技業。看到學生們找到夢想的工作，我超開心 der!" +
      "\n創立「程式喵學院」，希望用最生動、最有趣的方式讓大家發現：原來程式設計可以這麼可愛！不再害怕艱深的程式概念，跟著我學，保證學習路上充滿歡笑！喵～～",
    imageSrc: teacher,
  },
];
