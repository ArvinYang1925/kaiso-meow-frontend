import axios from '@/services/axiosInstance'; //很重要，這邊必須確認呼叫到的是 axiosInstance!!
import { UpdateProfileModel, UpdateProfileResponseModel } from './types';

export const fetchProfile = async () => {
    const response = await axios.get('/api/v1/auth/profile');
    return response.data;
};

export const updateProfile = async (data: UpdateProfileModel): Promise<UpdateProfileResponseModel> => {
    const response = await axios.put<UpdateProfileResponseModel>('/api/v1/auth/profile', data);
    return response.data;
};