import { Controller, useForm } from "react-hook-form";
import Modal from "@/components/common/Modal";
import { useCommonModalStore } from "@/stores/commonModalStore";
import { CreateCouponModel } from "../types";
import { createCouponList } from "../coupon-list.service";
import { useDialogStore } from "@/stores/commonDialogStore";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FormValidateInput } from "@/components/common/FormValidateInput";
import { useCouponListStore } from "../couponListStore";
import { useEffect, useState } from "react";

export const CreateCouponModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    clearErrors,
    watch,
  } = useForm<{
    couponName: string;
    type: string;
    code: string;
    value: number;
    startsAt: Date;
    expiresAt: Date;
  }>({
    defaultValues: {
      type: "",
      couponName: "",
      value: 0,
      startsAt: new Date(),
      expiresAt: new Date(),
      code: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const watchedType = watch("type");

  const options = [
    { label: "固定金額", value: "fixed" },
    { label: "百分比", value: "percentage" },
  ];

  const { isShowModal, setIsShowModal } = useCommonModalStore();
  const { showCommonDialog } = useDialogStore();
  const { fetchCouponList } = useCouponListStore();

  // 根據折扣類型設定驗證規則
  const getValueValidationRules = () => {
    const baseRules = {
      required: "請輸入折抵數值",
      valueAsNumber: true,
      min: { value: 1, message: "折抵數值必須大於 0" },
      validate: (value: number) => {
        // 動態檢查當前選擇的折扣類型
        const currentType = watch("type");

        if (currentType === "percentage") {
          if (value < 1 || value > 99) {
            return "百分比折扣值必須介於 1% 到 99% 之間";
          }
        } else if (currentType === "fixed") {
          if (value < 1) {
            return "固定金額必須大於 0";
          }
        }
        return true;
      },
    };

    // 只對百分比類型設定上限
    if (watchedType === "percentage") {
      return {
        ...baseRules,
        max: { value: 99, message: "百分比折扣值必須介於 1% 到 99% 之間" },
      };
    }

    // 固定金額類型：只檢查最小值，沒有上限
    return baseRules;
  };

  const onSubmit = async (formData: {
    couponName: string;
    type: string;
    code: string;
    value: number;
    startsAt: Date;
    expiresAt: Date;
  }) => {
    try {
      setIsSubmitting(true);

      // 檢查日期是否有效
      if (!formData.startsAt || !formData.expiresAt) {
        showCommonDialog({
          type: "error",
          message: "請選擇有效的開始和結束日期",
        });
        return;
      }

      // 檢查結束日期是否在開始日期之後或相等
      if (formData.expiresAt < formData.startsAt) {
        showCommonDialog({
          type: "error",
          message: "結束日期不能早於開始日期",
        });
        return;
      }

      // 驗證必填欄位
      if (!formData.couponName.trim()) {
        showCommonDialog({
          type: "error",
          message: "請輸入折扣碼名稱",
        });
        return;
      }

      if (!formData.code.trim()) {
        showCommonDialog({
          type: "error",
          message: "請輸入折扣碼",
        });
        return;
      }

      if (!formData.type) {
        showCommonDialog({
          type: "error",
          message: "請選擇折扣類型",
        });
        return;
      }

      if (!formData.value || formData.value <= 0) {
        showCommonDialog({
          type: "error",
          message: "請輸入有效的折抵數值",
        });
        return;
      }

      // 根據不同類型進行數值驗證
      if (formData.type === "percentage") {
        if (formData.value < 1 || formData.value > 99) {
          showCommonDialog({
            type: "error",
            message: "百分比折扣值必須介於 1% 到 99% 之間",
          });
          return;
        }
      } else if (formData.type === "fixed") {
        if (formData.value < 1) {
          showCommonDialog({
            type: "error",
            message: "固定金額必須大於 0",
          });
          return;
        }
        // 固定金額沒有上限限制
      }

      // 直接傳送 Date 物件
      const couponData: CreateCouponModel = {
        couponName: formData.couponName.trim(),
        type: formData.type,
        code: formData.code.trim(),
        value: Number(formData.value),
        startsAt: formData.startsAt,
        expiresAt: formData.expiresAt,
      };

      const response = await createCouponList(couponData);

      if (response.status === "success") {
        showCommonDialog({
          type: "success",
          message: response.message || "新增折扣碼成功",
          onClose: () => {
            fetchCouponList(1, 10);
            setIsShowModal(false);
          },
        });
      } else {
        showCommonDialog({
          type: "error",
          message: response.message || "新增折扣碼失敗",
        });
      }
    } catch (error) {
      let errorMessage = "新增折扣碼時發生錯誤";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      showCommonDialog({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isShowModal) {
      const today = new Date();

      reset({
        couponName: "",
        value: 0,
        startsAt: today,
        expiresAt: today,
        type: "",
        code: "",
      });
      clearErrors();
    }
  }, [isShowModal, reset, clearErrors]);

  // 動態生成提示文字
  const getValueHint = () => {
    if (watchedType === "percentage") {
      return "百分比折扣值必須介於 1% 到 99% 之間";
    } else if (watchedType === "fixed") {
      return "固定金額折扣，例如：50 表示折扣 50 元";
    }
    return "請先選擇折扣類型";
  };

  return (
    <Modal
      isOpen={isShowModal}
      onClose={() => setIsShowModal(false)}
      title="新增折扣碼"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <FormValidateInput
              id="couponName"
              label="折扣碼名稱"
              type="string"
              placeholder="請輸入折扣碼名稱"
              register={register}
              rules={{
                required: "請輸入折扣碼名稱",
              }}
              error={errors.couponName}
            />
          </div>

          <div className="space-y-2">
            <FormValidateInput
              id="code"
              label="折扣碼"
              type="string"
              placeholder="請輸入折扣碼"
              register={register}
              rules={{
                required: "請輸入折扣碼",
              }}
              error={errors.code}
            />
          </div>

          <div className="space-y-2">
            <Controller
              name="type"
              control={control}
              rules={{ required: "請選擇折扣類型" }}
              render={({ field }) => (
                <div className="space-y-2">
                  <label
                    htmlFor="select-option"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900"
                  >
                    折扣類型
                  </label>

                  <select
                    id="select-option"
                    value={field.value}
                    onChange={field.onChange}
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:outline-none focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 8px center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "16px",
                    }}
                  >
                    <option value="" disabled>
                      請選擇折扣類型
                    </option>
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormValidateInput
              id="value"
              label="折抵數值"
              type="number"
              placeholder="請輸入折抵數值"
              register={register}
              rules={getValueValidationRules()}
              error={errors.value}
            />
            {/* 動態提示文字 */}
            <p className="text-xs text-gray-500">{getValueHint()}</p>
          </div>

          <div className="space-y-2">
            <Controller
              name="startsAt"
              control={control}
              rules={{ required: "請選擇折扣碼開始時間" }}
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-slate-900 select-none">
                    折扣碼開始時間
                  </label>
                  <DatePicker
                    placeholderText="yyyy-MM-dd"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="yyyy-MM-dd"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer hover:bg-slate-50 transition-all duration-200 text-slate-900"
                    wrapperClassName="w-full"
                    popperClassName="z-50"
                    calendarClassName="shadow-lg border border-slate-200 rounded-md bg-white"
                  />
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <Controller
              name="expiresAt"
              control={control}
              rules={{ required: "請選擇折扣碼過期時間" }}
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-slate-900 select-none">
                    折扣碼過期時間
                  </label>
                  <DatePicker
                    placeholderText="yyyy-MM-dd"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="yyyy-MM-dd"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer hover:bg-slate-50 transition-all duration-200 text-slate-900"
                    wrapperClassName="w-full"
                    popperClassName="z-50"
                    calendarClassName="shadow-lg border border-slate-200 rounded-md bg-white"
                  />
                </div>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsShowModal(false);
            }}
          >
            取消
          </Button>
          <Button
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "處理中..." : "儲存折扣碼"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
