import node from '@/assets/homepage/node-course-card.jpg'
import react from '@/assets/homepage/react-course-card.jpg'
import typescript from '@/assets/homepage/ts-course-card.jpg'
import avatarUser01 from '@/assets/homepage/avatar_user01.jpg'
import avatarUser02 from '@/assets/homepage/avatar_user02.jpg'
import avatarUser03 from '@/assets/homepage/avatar_user03.jpg'

// 學生推薦資料型別
export interface StudentRecommendation {
  id: string;
  title: string;
  description: string;
  studentName: string;
  courseImageSrc: string;
  studentAvatarSrc: string;
  rating: number; // 1~5
}

// 學生推薦資料
export const studentRecommendations: StudentRecommendation[] = [
  {
    id: "1",
    title: "Node.js 後端開發全攻略",
    description: "課程內容豐富且實用，學完Node.js課程後，我成功找到了理想的後端工程師職位。",
    studentName: "虎斑君",
    courseImageSrc: node,
    studentAvatarSrc: avatarUser01,
    rating: 4,
  },
  {
    id: "2",
    title: "React 前端開發實戰",
    description: "程式喵的解說非常清晰，完全解決了我對React的困惑，現在我能自信開發複雜應用了！",
    studentName: "橘子貓",
    courseImageSrc: react,
    studentAvatarSrc: avatarUser03,
    rating: 5,
  },
  {
    id: "3",
    title: "TypeScript 強型別開發指南",
    description: "從其他平台跳槽過來的學生，程式喵的教學質量確實高出許多，推薦給所有想學編程的朋友。",
    studentName: "花貓醬",
    courseImageSrc: typescript,
    studentAvatarSrc: avatarUser02,
    rating: 5,
  },
];
