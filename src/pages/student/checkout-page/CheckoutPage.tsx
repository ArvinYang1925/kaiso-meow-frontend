import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useOrderStore } from "../order-page/store/orderStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OrderStatusBadge } from "@/pages/student/order-page/components/OrderStatusBadge";
import LOGO from "@/components/common/LOGO";
import {
  formatCouponDiscount,
  formatPrice,
  handleCouponTypeLabel,
} from "@/lib/priceHelper";
import React from "@/assets/homepage/react-course-card.jpg";

const CheckoutPage = () => {
  const { orderId } = useParams();

  const { orderData, courseData, couponData, fetchOrder } = useOrderStore();

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);

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
              <img src={React} className="rounded-xl" alt="react" />
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
            <p className="flex justify-between font-bold text-base py-6">
              <span>總計</span>
              <span>{formatPrice(orderData.orderPrice)}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
