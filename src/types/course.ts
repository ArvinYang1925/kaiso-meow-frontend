export interface Section {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  videoUrl1?: string;
  courseId: string;
  courseName?: string;
  order: number;
  progress: {
    isCompleted: boolean;
  };
  nextSection?: {
    id: string;
    title: string;
  } | null;
  prevSection?: {
    id: string;
    title: string;
  } | null;
}

export interface CourseProgress {
  sectionId: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface CourseSection {
  id: string;
  title: string;
  order: number;
  isCompleted: boolean;
  isActive?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  sections: CourseSection[];
  progress: {
    completedSections: number;
    totalSections: number;
    percentage: number;
  };
}

export interface SectionApiResponse {
  status: string;
  message: string;
  data: {
    section: Section;
  };
}

export interface CourseSectionsApiResponse {
  status: string;
  message: string;
  data: {
    course: {
      id: string;
      title: string;
    };
    sections: {
      id: string;
      title: string;
      order: number;
      content: string;
      videoUrl: string;
    }[];
  };
}

// New types for My Learning page
export interface MyCourse {
  courseId: string;
  title: string;
  coverUrl: string;
  progressPercentage: number;
  instructorName: string;
}

export interface MyLearningApiResponse {
  status: string;
  message: string;
  data: MyCourse[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}
