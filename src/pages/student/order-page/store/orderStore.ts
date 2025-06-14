import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
    CouponInfo, UserInfo, CourseInfo, OrderStatus,
    CreateOrderRequestModel, ApplyCouponRequestModel
} from "../service/type";
import { applyCoupon, checkoutEcpay, createOrder, createOrderPreview, fetchOrder } from "../service/order.service";
import { initCouponData, initCourseData, initOrderData, initUserData } from "../constants/initialData";

/** 僅在頁面上有用到的訂單資料 */
type OrderInfo = {
    id: string;
    originalPrice: number | null;
    orderPrice: number | null;
    status: OrderStatus;
    paidAt: string;
};

interface OrderPageState {
    orderData: OrderInfo;
    couponData: CouponInfo;
    userData: UserInfo;
    courseData: CourseInfo;
    isLoading: boolean;
    isShowDialog: boolean;
}

interface OrderPageAction {
    setIsShowDialog: (isShowDialog: boolean) => void;
    resetStore: () => void;
    createOrderPreview: (requestData: CreateOrderRequestModel) => void;
    applyCoupon: (requestData: ApplyCouponRequestModel) => Promise<void>
    fetchOrder: (orderId: string) => void;
    createOrder: (requestData: CreateOrderRequestModel) => Promise<string>;
}

export const useOrderStore = create<OrderPageState & OrderPageAction>()(
    persist(
        immer((set, get) => ({
            userData: initUserData,
            orderData: initOrderData,
            couponData: initCouponData,
            courseData: initCourseData,
            isLoading: false,
            isShowDialog: false,
            setIsShowDialog: (isShowDialog) => {
                set((state) => {
                    state.isShowDialog = isShowDialog;
                });
            },
            createOrderPreview: async (requestData) => {
                get().resetStore();
                set((state) => {
                    state.isLoading = true;
                });
                try {
                    const response = await createOrderPreview(requestData);
                    const { originalPrice, orderPrice, status, course, user } = response;

                    set((state) => {
                        state.orderData.orderPrice = orderPrice;
                        state.orderData.originalPrice = originalPrice;
                        state.orderData.status = status;
                        state.courseData = course;
                        state.userData = user;
                    });
                } catch (error) {
                    console.error('Failed to createOrderPreview', error);
                    throw error;
                } finally {
                    set((state) => {
                        state.isLoading = false;
                    });
                }
            },
            applyCoupon: async (requestData) => {
                set((state) => {
                    state.isLoading = true;
                });
                try {
                    const response = await applyCoupon(requestData);
                    const { coupon, order } = response;
                    set((state) => {
                        state.couponData = coupon;
                        state.orderData.orderPrice = order.orderPrice;
                        state.orderData.originalPrice = order.originalPrice;
                    });
                } catch (error: any) {
                    console.error('Failed to applyCoupon', error.response.data);
                    throw error;
                } finally {
                    set((state) => {
                        state.isLoading = false;
                    });
                }
            },
            fetchOrder: async (orderId) => {
                set((state) => {
                    state.isLoading = true;
                });
                try {
                    const response = await fetchOrder(orderId);
                    const { coupon, user, course, id, originalPrice, orderPrice, status } = response;

                    set((state) => {
                        state.couponData = coupon;
                        state.userData = user;
                        state.courseData = course;
                        state.orderData.id = id;
                        state.orderData.originalPrice = originalPrice;
                        state.orderData.orderPrice = orderPrice;
                        state.orderData.status = status;
                    });
                } catch (error) {
                    console.error('Failed to fetchOrder', error);
                    throw error;
                } finally {
                    set((state) => {
                        state.isLoading = false;
                    });
                }
            },
            createOrder: async (requestData) => {
                set((state) => {
                    state.isLoading = true;
                });
                try {
                    const newOrderResData = await createOrder(requestData);
                    const { id: orderId, orderPrice, originalPrice, status } = newOrderResData.data;
                    if (orderPrice && orderPrice > 0) {
                        //拿到 id 打綠界
                        const ecpayFormString = await checkoutEcpay(orderId);
                        return ecpayFormString;
                    } else {
                        /** 免費課程，就不打綠界 */
                        set((state) => {
                            state.orderData.id = orderId;
                            state.orderData.originalPrice = originalPrice;
                            state.orderData.orderPrice = orderPrice;
                            state.orderData.status = status;
                        });
                        return `/checkout/${orderId}`
                    }

                } catch (error) {
                    console.error('Failed to createOrder', error);
                    throw error;
                } finally {
                    set((state) => {
                        state.isLoading = false;
                    });
                }
            },
            resetStore: () => {
                set((state) => {
                    state.userData = initUserData;
                    state.orderData = initOrderData;
                    state.couponData = initCouponData;
                    state.courseData = initCourseData;
                    state.isLoading = false;
                    state.isShowDialog = false;
                });
            },
        })),
        {
            name: "order-store",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                userData: state.userData,
                orderData: state.orderData,
                couponData: state.couponData,
                courseData: state.courseData,
                isShowDialog: state.isShowDialog,
            }),
        }
    )
);
