import axios from '@/services/axiosInstance'; //很重要，這邊必須確認呼叫到的是 axiosInstance
import {
    OrderPreviewRequestModel,
    OrderPreviewResponseModel,
    ApplyCouponRequestModel,
    ApplyCouponResponseModel,
    CreateOrderRequestModel,
    CreateOrderResponseModel,
    FetchOrderResponseModel,
} from './type';

/** 訂單預覽 */
export const createOrderPreview = async (data: OrderPreviewRequestModel): Promise<OrderPreviewResponseModel> => {
    const response = await axios.post('/api/v1/orders/preview', data);
    return response.data;
};

/** 驗證折扣碼 */
export const applyCoupon = async (data: ApplyCouponRequestModel): Promise<ApplyCouponResponseModel> => {
    const response = await axios.post('/api/v1/orders/preview/apply-coupon', data);
    return response.data;
};

/** 顯示訂單資訊 */
export const fetchOrder = async (orderId: string): Promise<FetchOrderResponseModel> => {
    const response = await axios.get(`/api/v1/orders/${orderId}`);
    return response.data;
};

/** 建立訂單 */
export const createOrder = async (data: CreateOrderRequestModel): Promise<CreateOrderResponseModel> => {
    const response = await axios.post('/api/v1/orders', data);
    return response.data;
}