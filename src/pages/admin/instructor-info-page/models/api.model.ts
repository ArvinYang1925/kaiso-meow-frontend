export interface ApiResponseModel<T = void> {
  status: 'success' | 'error';
  message: string;
  data?: T;
} 