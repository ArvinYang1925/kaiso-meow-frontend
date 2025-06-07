import axiosInstance from "./axiosInstance";
import { SectionApiResponse, Section } from "@/types/course";

export const learningService = {
  // Fetch section data by courseId and sectionId (new endpoint)
  async getCourseSection(
    courseId: string,
    sectionId: string
  ): Promise<SectionApiResponse> {
    try {
      const response = await axiosInstance.get(
        `/api/v1/courses/${courseId}/sections/${sectionId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching course section:", error);
      throw error;
    }
  },

  // Fetch section data by ID (legacy endpoint)
  async getSection(sectionId: string): Promise<SectionApiResponse> {
    try {
      const response = await axiosInstance.get(`/api/v1/sections/${sectionId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching section:", error);
      throw error;
    }
  },

  // Update section progress
  async updateProgress(
    sectionId: string,
    progress: { isCompleted: boolean; currentTime?: number }
  ): Promise<void> {
    try {
      await axiosInstance.put(
        `/api/v1/sections/${sectionId}/progress`,
        progress
      );
    } catch (error) {
      console.error("Error updating progress:", error);
      throw error;
    }
  },

  // Get course sections list
  async getCourseSections(courseId: string) {
    try {
      const response = await axiosInstance.get(
        `/api/v1/courses/${courseId}/sections`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching course sections:", error);
      throw error;
    }
  },

  // Mark section as completed
  async markAsCompleted(sectionId: string): Promise<void> {
    try {
      await axiosInstance.post(`/api/v1/sections/${sectionId}/complete`);
    } catch (error) {
      console.error("Error marking section as completed:", error);
      throw error;
    }
  },
};

// Mock data for development
export const mockSectionResponse: SectionApiResponse = {
  status: "success",
  message: "成功取得章節資料",
  data: {
    section: {
      id: "uuid-section-2",
      title: "Express 框架介紹",
      content: `<p><a href="http://google.com" rel="noopener noreferrer" target="_blank"><strong>http://google.com</strong></a></p>
                <p><a href="http://www.xxx.com.tw" rel="noopener noreferrer" target="_blank">http://www.xxx.com.tw</a></p>
                <p>在這個章節中，我們將深入了解 Express 框架的核心概念和基本用法。Express 是 Node.js 最受歡迎的 Web 應用程式框架之一，它提供了豐富的功能來建立 Web 應用程式和 API。</p>
                <h3>學習目標</h3>
                <ul>
                  <li>理解 Express 框架的基本概念</li>
                  <li>學會建立基本的 Express 應用程式</li>
                  <li>了解路由和中間件的使用方法</li>
                </ul>`,
      videoUrl:
        "http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8",
      courseId: "uuid-course-1",
      order: 2,
      progress: {
        isCompleted: false,
      },
      nextSection: {
        id: "uuid-section-3",
        title: "路由與中間件",
      },
      prevSection: {
        id: "uuid-section-1",
        title: "Node.js 基礎入門",
      },
    },
  },
};
