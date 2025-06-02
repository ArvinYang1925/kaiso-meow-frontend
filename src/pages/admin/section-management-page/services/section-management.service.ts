import axios from "@/services/axiosInstance"; //很重要，這邊必須確認呼叫到的是 axiosInstance!!
import { Section } from './type'


export const fetchSectionList = async (
    courseId: string
): Promise<Section> => {
    const response = await axios.get(`/api/v1/instructor/courses/${courseId}/sections`);
    return response.data.data;
};
