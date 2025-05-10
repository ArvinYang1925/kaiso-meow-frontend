import axios from '@/services/axiosInstance'; //很重要，這邊必須確認呼叫到的是 axiosInstance!!
import { UpdatePasswordResponseModel, PasswordModel, UpdateProfileModel, UpdateProfileResponseModel } from './types';

export const fetchProfile = async () => {
    const response = await axios.get('/api/v1/auth/profile');
    return response.data;
};

export const updateProfile = async (data: UpdateProfileModel): Promise<UpdateProfileResponseModel> => {
    const response = await axios.put<UpdateProfileResponseModel>('/api/v1/auth/profile', data);
    return response.data;
};

export const updatePassword = async (data: PasswordModel): Promise<UpdatePasswordResponseModel> => {
    const response = await axios.put<UpdatePasswordResponseModel>('/api/v1/auth/password/change', data);
    return response.data;
};