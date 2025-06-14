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
import { useEffect } from "react";

export const CreateCouponModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateCouponModel>({
    defaultValues: {
      type: "", // type 欄位的預設值
    },
  });

  const options = [
    { label: "固定金額", value: "fixed" },
    { label: "百分比", value: "percentage" },
  ];

  const { isShowModal, setIsShowModal } = useCommonModalStore();
  const { showCommonDialog } = useDialogStore();
  const { fetchCouponList } = useCouponListStore();

  const onSubmit = async (couponData: CreateCouponModel) => {
    try {
      const response = await createCouponList(couponData);
      const { status, message } = response;

      showCommonDialog({
        title: `${status}`,
        description: `${message}`,
        onClose: () => {
          fetchCouponList(1, 10);
        },
      });
      setIsShowModal(false);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const errorResponse = error as {
          response: { data: { status: string; message: string } };
        };
        const { status, message } = errorResponse.response.data;
        showCommonDialog({
          title: `${status}`,
          description: `${message}`,
        });
      }
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
    }
  }, [isShowModal, reset]);

  return (
    <Modal
      isOpen={isShowModal}
      onClose={() => setIsShowModal(false)}
      title="新增折扣碼"
      size="lg" // md | lg | full
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

          <div className="">
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
              rules={{
                required: "請輸入折抵數值",
                valueAsNumber: true,
              }}
              error={errors.value}
            />
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
          {/* <Button className="bg-blue-500 hover:bg-blue-600" type="submit"></Button> */}
          <Button className="bg-orange-600 hover:bg-orange-700" type="submit">
            儲存折扣碼
          </Button>
        </div>
      </form>
    </Modal>
  );
};
