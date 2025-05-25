import { FormValidateInput } from "@/components/common/FormValidateInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useOrderStore } from "./store/orderStore";
import catAvatar from "@/assets/cat-avatar.jpg";
import catschool_logotype from "@/assets/homepage/catschool_logotype.svg";
import { Badge } from "@/components/ui/badge";
import React from "@/assets/homepage/react-course-card.jpg";
import { CouponInfo } from "./service/type";
import { OrderStatus, CouponType } from "@/lib/enum";

type FormData = {
  name: string;
  phoneNumber: string;
  email: string;
};

const OrderPage = () => {
  const {
    register,
    // handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<FormData>();

  const { userData, orderData, courseData, couponData } = useOrderStore();

  const handleOrderStatus = (status: string) => {
    if (status == "") {
      return <></>;
    } else if (status == OrderStatus.PENDING) {
      return (
        <Badge className="bg-gray-100 text-gray-600 border border-gray-300 font-medium text-sm rounded-lg">
          待付款
        </Badge>
      );
    } else if (status == OrderStatus.PAID) {
      return (
        <Badge className="bg-lime-100 text-lime-600 border border-lime-300 font-medium text-sm rounded-lg">
          付款完成
        </Badge>
      );
    } else if (status == OrderStatus.FAILED) {
      return (
        <Badge className="bg-rose-100 text-rose-700 border border-rose-300 font-medium text-sm rounded-lg">
          付款失敗
        </Badge>
      );
    }
  };

  /** 處理訂單折扣種類 */
  const handleCouponTypeAndValueData = (couponData: CouponInfo) => {
    const { type, value } = couponData;
    if (type == "fix") {
      return `折扣${value}元`;
    } else if (type == "percentage") {
      return `折扣${value}%`;
    } else {
      return "";
    }
  };

  /** 計算 percentage 折扣 */
  const calculateDiscount = (originalPrice: number, percent: string) => {
    return originalPrice * (Number(percent) / 100);
  };

  /** 計算折扣結果 */
  const handleCalculateCouponResult = (
    originalPrice: number,
    couponData: CouponInfo
  ) => {
    const { type, value } = couponData;
    if (type == CouponType.FIXED) {
      return `-NT$${value}`;
    } else if (type == CouponType.PERCENTAGE) {
      return `-NT${calculateDiscount(originalPrice, value)}%`;
    } else {
      return "";
    }
  };

  console.log("userData in order", userData);

  return (
    <div className="mt-16 bg-slate-100 py-12">
      <div className="container flex gap-12">
        <div className="order-section rounded-lg bg-white basis-1/2 pt-4 pb-12 px-6 border border-slate-200">
          <div className="return-btn flex mb-6">
            <ChevronLeft className="me-2" />
            <span>返回</span>
          </div>

          <form id="orderForm" className="px-9 space-y-8 ">
            <div className="user-info flex space-x-2">
              <div className="img-wrap w-[48px] h-[48px] rounded-full overflow-hidden">
                <img className="w-full object-cover" src={catAvatar} alt="" />
              </div>
              <div className="text flex flex-col">
                <span>{userData.name}</span>
                <span className="text-slate-500">{userData.email}</span>
              </div>
            </div>

            <FormValidateInput
              id="name"
              label={"姓名"}
              type={"text"}
              placeholder={"請輸入姓名"}
              register={register}
              rules={{ required: "請輸入姓名" }}
              error={errors.name}
            />

            <FormValidateInput
              id="phoneNumber"
              label={"聯絡電話"}
              type={"text"}
              placeholder={"請輸入聯絡電話"}
              register={register}
              rules={{ required: "請輸入聯絡電話" }}
              error={errors.phoneNumber}
            />

            <FormValidateInput
              id="email"
              label={"電子郵件"}
              type={"email"}
              placeholder={"電子郵件"}
              register={register}
              rules={{
                required: "請輸入電子郵件",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "請輸入有效的電子郵件格式",
                },
              }}
              error={errors.email}
            />

            <div className="coupon-wrapper">
              <div className="btn-group flex items-end mb-2">
                <FormValidateInput
                  id="couponId"
                  className="flex-1 me-2"
                  label={"優惠代碼"}
                  type={"text"}
                  placeholder={"請輸入優惠代碼"}
                  register={register}
                />
                <Button
                  size={"sm"}
                  className="bg-orange-600 hover:bg-orange-500 px-4 py-5"
                >
                  套用
                </Button>
              </div>
              <span className="text-slate-500 text-sm font-normal">
                若無優惠請略過
              </span>
            </div>
          </form>
        </div>
        <div className="order-card-section basis-1/2">
          <Card className="rounded-lg p-6">
            <CardHeader className="border-b">
              <div className="header flex justify-between items-center">
                <img
                  src={catschool_logotype}
                  alt="程式喵學院"
                  className="h-8 mr-4"
                />
                {orderData?.status ? handleOrderStatus(orderData.status) : null}
              </div>
            </CardHeader>
            <CardContent className="border-b">
              <div className="grid grid-cols-2 gap-4 py-6">
                <img src={React} className="rounded-xl" alt="react" />
                <div className="text">
                  <h2 className="font-medium text-2xl mb-4">
                    {courseData.title}
                  </h2>
                  <h2 className="font-bold text-xl">
                    <span>NT${orderData.originalPrice?.toLocaleString() ?? ''}</span>
                  </h2>
                </div>
              </div>
            </CardContent>
            <CardContent className="border-b">
              <div className="order-summary py-6 space-y-3">
                <p className="flex justify-between">
                  <span className="text-slate-500">小計</span>
                  <span>{`NT$${orderData.originalPrice?.toLocaleString()  ?? ''}`}</span>
                </p>
                <p className="flex justify-between">
                  <span>{`${
                    couponData.couponName
                  } ${handleCouponTypeAndValueData(couponData)}`}</span>
                  <span>
                    {orderData.originalPrice
                      ? handleCalculateCouponResult(
                          orderData.originalPrice,
                          couponData
                        )
                      : ""}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
