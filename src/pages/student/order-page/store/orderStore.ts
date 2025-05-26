import { create } from "zustand";
import { immer } from 'zustand/middleware/immer';
import { CouponInfo, UserInfo, CourseInfo, OrderStatus, CreateOrderRequestModel, ApplyCouponRequestModel } from "../service/type";
import { applyCoupon, createOrder, createOrderPreview, fetchOrder } from "../service/order.service";
import { initCouponData, initCourseData, initOrderData, initUserData } from "../constants/initialData";

/** 僅在頁面上有用到的訂單資料 */
type OrderInfo = {
    id: string;
    originalPrice: number | null;
    orderPrice: number | null;
    status: OrderStatus;
    paidAt: string;
}

interface OrderPageState {
    orderData: OrderInfo;
    couponData: CouponInfo;
    userData: UserInfo;
    courseData: CourseInfo;
    isLoading: boolean;
    isShowDialog: boolean;
}

interface OrderPageAction {
    // setIsLoading: (loading: boolean) => void;
    setIsShowDialog: (isShowDialog: boolean) => void;
    resetStore: () => void;
    createOrderPreview: (requestData: CreateOrderRequestModel) => void;
    applyCoupon: (requestData: ApplyCouponRequestModel) => void;
    fetchOrder: (orderId: string) => void;
    createOrder: (requestData: CreateOrderRequestModel) => void;
}

export const useOrderStore = create<OrderPageState & OrderPageAction>()(
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
            } catch (error) {
                console.error('Failed to applyCoupon', error);
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
                const response = await createOrder(requestData);
                const { user, course, coupon, id, originalPrice, orderPrice, status } = response;
                set((state) => {
                    state.userData = user;
                    state.courseData = course;
                    state.couponData = coupon;
                    state.orderData.id = id;
                    state.orderData.originalPrice = originalPrice;
                    state.orderData.orderPrice = orderPrice;
                    state.orderData.status = status;
                });
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
    })
    )
)