import { CourseDetailResponse } from './course-detail.service';

export const mockCourseDetail: CourseDetailResponse = {
  id: 'course-001',
  title: 'React 前端開發實戰',
  subtitle: '從 HTML 到 React 一次搞懂',
  description: '從零開始學習React框架，\n掌握組件開發、狀態管理和前端路由',
  highlight: '專為初學者設計，包含實戰專案與作業。',
  duration: 480, // 單位：分鐘
  isPublished: false,
  price: 1999,
  isFree: false,
  coverUrl: '@/assets/homepage/react-course-card.jpg',
  instructor: {
    id: 'instructor-001',
    name: '王小明',
    profileUrl: 'https://example.com/instructor-profile.jpg',
  },
  sections: [
    {
      id: 'section-001',
      title: '課程介紹',
      orderIndex: 1,
    },
    {
      id: 'section-002',
      title: 'HTML 基礎',
      orderIndex: 2,
    },
    {
      id: 'section-003',
      title: 'CSS 入門',
      orderIndex: 3,
    },
  ],
};
