import { FormValidateInput } from "@/components/common/FormValidateInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useOrderStore } from "./store/orderStore";
import catAvatar from "@/assets/cat-avatar.jpg";
import { useDialogStore } from "@/stores/commonDialogStore";
import { useNavigate, useParams } from "react-router-dom";
import axios, { isAxiosError } from "axios";
import { OrderStatusBadge } from "./components/OrderStatusBadge";
import LOGO from "@/components/common/LOGO";
import {
  handleCouponTypeLabel,
  formatCouponDiscount,
  formatPrice,
} from "@/lib/priceHelper";
import { useState } from "react";

type FormData = {
  name: string;
  phoneNumber: string;
  email: string;
  couponId: string;
};

const OrderPage = () => {
  const navigate = useNavigate();

  const {
    userData,
    orderData,
    courseData,
    couponData,
    applyCoupon,
    createOrder,
    // resetStore,
  } = useOrderStore();

  const {
    register,
    // handleSubmit,
    // watch,
    getValues,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    defaultValues: {
      name: userData.name || "",
      phoneNumber: userData.phoneNumber || "",
      email: userData.email || "",
      couponId: "",
    },
  });

  const { showCommonDialog } = useDialogStore();
  const { courseId } = useParams();
  const [isShowCouponErrorHint, setIsShowCouponErrorHint] = useState(false);
  const [couponErrorMsg, setCouponErrorMsg] = useState("");

  /** 套用折扣碼 */
  const handleApplyCoupon = async () => {
    const couponCode = getValues("couponId");

    if (couponCode && orderData.originalPrice) {
      try {
        const reqData = { couponCode, originalPrice: orderData.originalPrice };
        await applyCoupon(reqData);
        showCommonDialog({
          title: "success",
          description: "折扣碼套用成功",
        });
        setIsShowCouponErrorHint(false);
        setCouponErrorMsg("");
      } catch (error) {
        if (isAxiosError(error) && error.response?.data) {
          const { message } = error.response.data;
          setCouponErrorMsg(message);
        }
        setIsShowCouponErrorHint(true);
      }
    } else {
      showCommonDialog({
        title: "請確認資料格式",
        description: "折扣碼或課程價格不得為空",
      });
    }
  };

  /** 送出訂單、跳轉綠界 */
  const handleSubmitOrder = async () => {
    // 手動觸發驗證
    const isValid = await trigger();

    if (!isValid) {
      showCommonDialog({
        title: "表單資料填寫不完整",
        description: "請確認表單資料已填寫完整！",
      });
      return;
    }

    const couponId = couponData?.id ?? "";
    const course_id = courseId ?? "";
    const reqData = { couponId, courseId: course_id };
    const { originalPrice, orderPrice } = orderData || {};

    if (!courseId) {
      showCommonDialog({
        title: "請確認資料格式",
        description: "課程 id 或折扣碼 id 不得為空",
      });
      return;
    }

    try {
      /** response 為綠界的 form HTML 字串 */
      const response = await createOrder(reqData);
      /** 免費課程，就不打綠界 */
      if (originalPrice === 0 && orderPrice === 0) {
        navigate(response);
        return;
      }
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
        // 非 Axios 的錯誤處理
        showCommonDialog({
          title: "Error",
          description: "Something went wrong. Please try again later.",
        });
      }
    }
  };

  return (
    <div className="bg-slate-100 px-4 pt-6 pb-4 md:px-80 md:py-12">
      <div className="px-4 flex flex-col-reverse md:flex-row gap-6 md:gap-12">
        {/* 左邊的表單區塊 */}
        <div className="order-section rounded-lg bg-white w-full md:basis-1/2 pt-4 pb-12 px-0 md:px-6 border border-slate-200">
          <div className="return-btn mb-6 hidden md:block">
            <a
              className="wrap flex w-[80px] cursor-pointer items-center"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="me-2" />
              <span>返回</span>
            </a>
          </div>

          <form id="orderForm" className="px-4 md:px-9 space-y-8 ">
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
              rules={{ required: "姓名為必填欄位" }}
              error={errors.name}
            />

            <FormValidateInput
              id="phoneNumber"
              label={"聯絡電話"}
              type={"text"}
              placeholder={"請輸入聯絡電話"}
              register={register}
              rules={{ required: "聯絡電話為必填欄位" }}
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
              <div className="btn-wrapper flex items-end">
                <FormValidateInput
                  id="couponId"
                  className="flex-1 me-2"
                  label={"優惠代碼"}
                  type={"text"}
                  placeholder={"請輸入優惠代碼"}
                  register={register}
                />
                <Button
                  type="button"
                  size={"sm"}
                  className="bg-orange-600 hover:bg-orange-500 px-4 py-5"
                  onClick={(e) => {
                    e.preventDefault();
                    handleApplyCoupon();
                  }}
                >
                  套用
                </Button>
              </div>
              {isShowCouponErrorHint ? (
                <span className="text-red-500 text-sm font-normal">
                  {`您的優惠券 ${getValues("couponId")}
                  無效。${couponErrorMsg}。`}
                </span>
              ) : (
                <span className="text-slate-500 text-sm font-normal">
                  若無優惠請略過
                </span>
              )}
            </div>
          </form>
        </div>

        {/* 右邊邊的明細列表 */}
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
                <img
                  src={courseData.cover_url}
                  className="rounded-xl"
                  alt="課程縮圖"
                />
                <div className="text">
                  <h2 className="font-medium text-xl md:text-2xl mb-4">
                    {courseData.title}
                  </h2>
                  <h2 className="font-bold text-small md:text-xl">
                    <span>{formatPrice(orderData.originalPrice)}</span>
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
              <Button
                type="button"
                form="orderForm"
                className="bg-orange-600 hover:bg-orange-500 w-full h-[44px] hidden md:block"
                onClick={handleSubmitOrder}
              >
                確定送出
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4 md:hidden z-50 grid grid-cols-2">
        <div className="text-base flex items-center">
          <p className="order-price font-bold">
            <span>{formatPrice(orderData.orderPrice)}</span>
          </p>
        </div>
        <Button
          type="button"
          form="orderForm"
          className="bg-orange-600 hover:bg-orange-500 w-full h-[44px] md:hidden"
          onClick={handleSubmitOrder}
        >
          確定送出
        </Button>
      </div>
    </div>
  );
};

export default OrderPage;
