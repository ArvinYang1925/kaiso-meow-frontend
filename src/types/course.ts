export interface Section {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  courseId: string;
  order: number;
  progress: {
    isCompleted: boolean;
  };
  nextSection?: {
    id: string;
    title: string;
  };
  prevSection?: {
    id: string;
    title: string;
  };
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
