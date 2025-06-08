import axiosInstance from "./axiosInstance";
import { SectionApiResponse, CourseSectionsApiResponse } from "@/types/course";

export const learningService = {
  // Fetch course sections list for sidebar menu
  async getCourseSectionsList(
    courseId: string
  ): Promise<CourseSectionsApiResponse> {
    try {
      const response = await axiosInstance.get(
        `/api/v1/courses/${courseId}/sections`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching course sections list:", error);
      throw error;
    }
  },

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
