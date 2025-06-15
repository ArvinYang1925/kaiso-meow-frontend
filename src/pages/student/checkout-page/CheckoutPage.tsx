import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrderStore } from "../order-page/store/orderStore";
import { useOrderListStore } from "../order-list-page/orderListStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OrderStatusBadge } from "@/pages/student/order-page/components/OrderStatusBadge";
import LOGO from "@/components/common/LOGO";
import {
  formatCouponDiscount,
  formatPrice,
  handleCouponTypeLabel,
} from "@/lib/priceHelper";
import { Button } from "@/components/ui/button";
import { CLIENT_ROUTES } from "@/app/route-path";
import axios from "axios";
import { useDialogStore } from "@/stores/commonDialogStore";

const CheckoutPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { showCommonDialog } = useDialogStore();
  const { checkoutEcpay } = useOrderListStore();
  const { orderData, courseData, couponData, fetchOrder,createOrderPreview } = useOrderStore();
  

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);

  // 繼續購買：跳轉到課程列表
  const handleBackToHome = () => {
    navigate(CLIENT_ROUTES.COURSE_LIST);
  };

  // 開始觀看 : 跳轉到我的學習頁面
  const handleStartWatching = () => {
    navigate(CLIENT_ROUTES.MY_LEARNING);
  };

  // 重新下單: 跳轉到訂單預覽頁面 
  const handleRebuy = async() => {
    try {
      

      navigate(`/order/${courseData.id}`); 
      const reqData = {
        courseId: courseData.id,
        couponId: "",
      };
      
      await createOrderPreview(reqData);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { status, message } = error.response.data;
        showCommonDialog({
          title: status,
          description: message,
        });
      } else {
        // 非 Axios 的錯誤處理
        showCommonDialog({
          title: "Error",
          description: "Something went wrong. Please try again later.",
        });
      }
    }
  };
  
  // 重新付款 : 跳轉到綠界付款頁面
  const handleRepay = async (orderId: string) => {
    try {
      const response = await checkoutEcpay(orderId);
      
      const wrapper = document.createElement("div");
      wrapper.innerHTML = response;
      const form = wrapper.querySelector("form");

      if (form) {
        document.body.appendChild(form);
        form.submit();
      } else {
        showCommonDialog({
          title: "發生錯誤",
          description: "未取得綠界付款表單，請稍後再試。",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { status, message } = error.response.data;
        showCommonDialog({
          title: status,
          description: message,
        });
      } else {
        showCommonDialog({
          title: "Error",
          description: "Something went wrong. Please try again later.",
        });
      }
    }
  };

  
  // 處理根據訂單狀態渲染不同的按鈕
  const renderActionButtons = () => {
    // 左邊的按鈕 - 固定是回到課程頁面
    const leftButton = (
      <Button 
        variant="default" 
        className="h-9 text-sm bg-gray-600 hover:bg-gray-700 w-full md:w-[30%] text-white"
        onClick={handleBackToHome}
      >
        繼續購買
      </Button>
    );
    
    // 右邊的按鈕 - 根據訂單狀態變化
    let rightButton;
    
    switch (orderData.status) {
      case 'paid':
        rightButton = (
          <Button 
            variant="default" 
            className="h-9 text-sm bg-orange-600 hover:bg-orange-700 w-full md:w-[30%] text-white"
            onClick={handleStartWatching}
          >
            開始觀看
          </Button>
        );
        break;
      case 'failed':
        rightButton = (
          <Button 
            variant="default" 
            className="px-4 py-2 h-9 text-sm bg-orange-500 hover:bg-orange-600 w-full md:w-[30%] text-white"
            onClick={handleRebuy}
          >
            重新下單
          </Button>
        );
        break;
      case 'pending':
        rightButton = (
          <Button 
            variant="default" 
            className="px-4 py-2 h-9 text-sm bg-orange-500 hover:bg-orange-600 w-full md:w-[30%] text-white"
            onClick={() => handleRepay(orderData.id)}
          >
            重新付款
          </Button>
        );
        break;
    }
    
    return (
      <div className="flex justify-end gap-2 mt-2">
        {leftButton}
        {rightButton}
      </div>
    );
  };

  return (
    <div className="bg-slate-100 px-4 pt-6 pb-4 md:px-80 md:py-12">
      <div className="order-card-section w-full md:basis-1/2">
        <Card className="rounded-lg p-4 md:p-6">
          <CardHeader className="border-b">
            <div className="header flex justify-between items-center">
              <LOGO className="h-8 mr-4" />
              <OrderStatusBadge status={orderData.status} />
            </div>
          </CardHeader>
          <CardContent className="border-b">
            <div className="grid grid-cols-2 gap-4 p-4 md:py-6">
              <img src= {courseData.cover_url} className="rounded-xl" alt="課程縮圖" />
              <div className="text">
                <h2 className="font-medium text-xl md:text-2xl mb-4">
                  {courseData.title}
                </h2>
              </div>
            </div>
          </CardContent>
          <CardContent className="border-b py-6 text-sm">
            <div className="order-summary space-y-3">
              <p className="flex justify-between">
                <span className="text-slate-500">小計</span>
                <span>{formatPrice(orderData.originalPrice)}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">
                  {handleCouponTypeLabel(couponData)}
                </span>
                <span className="text-red-600">
                  {formatCouponDiscount(orderData.originalPrice, couponData)}
                </span>
              </p>
            </div>
          </CardContent>
          <CardContent>
            <p className="flex justify-between font-bold text-base py-3">
              <span>總計</span>
              <span>{formatPrice(orderData.orderPrice)}</span>
            </p>
            {renderActionButtons()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
