import { Modal } from "@/components/common/Modal";
import Select from "@/components/common/Select";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/stores/commonDialogStore";
import { useModalStore } from "@/stores/modalStore";
import { createCouponList, fetchCouponList } from "../coupon-list.service";
import { Controller, useForm } from "react-hook-form";
import { CreateCouponModel } from "../types";
import { FormValidateInput } from "@/components/common/FormValidateInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateCouponModal() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateCouponModel>({
    defaultValues: {
      type: "fixed", // type 欄位的預設值
    },
  });

  const { openModal, closeModal } = useModalStore();
  const { showCommonDialog } = useDialogStore();

  const options = [
    { label: "固定金額", value: "fixed" },
    { label: "百分比", value: "percentage" },
  ];

  const onSubmit = async (couponData: CreateCouponModel) => {
    try {
      const response = await createCouponList(couponData);
      const { status, message } = response;

      showCommonDialog({
        title: `${status}`,
        description: `${message}`,
      });
      closeModal();
      fetchCouponList(1, 10);
    } catch (error: any) {
      console.error(error);
      const { status, message } = error.response.data;
      showCommonDialog({
        title: `${status}`,
        description: `${message}`,
      });
    }
  };

  const handleOpenModal = () => {
    openModal({
      title: "新增折扣碼",
      body: (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <FormValidateInput
                id="couponName"
                className="mb-4"
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
                className="mb-2"
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
                    <label className="block text-sm font-medium">
                      折扣類型
                    </label>
                    <Select
                      options={options}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormValidateInput
                id="value"
                label="折抵金額"
                type="number"
                placeholder="請輸入折抵金額"
                register={register}
                rules={{
                  required: "請輸入折抵金額",
                  valueAsNumber: true,
                }}
                error={errors.value}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Controller
              name="startsAt"
              control={control}
              rules={{ required: "請選擇折扣碼開始時間" }}
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    折扣碼開始時間
                  </label>
                  <DatePicker
                    placeholderText="yyyy-MM-dd"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="yyyy-MM-dd"
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
                  <label className="block text-sm font-medium">
                    折扣碼過期時間
                  </label>
                  <DatePicker
                    placeholderText="yyyy-MM-dd"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                closeModal();
              }}
            >
              取消
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600" type="submit">
              送出
            </Button>
          </div>
        </form>
      ),
    });
  };

  return (
    <div className="p-6">
      <Button
        onClick={handleOpenModal}
        className="bg-blue-500 hover:bg-blue-600"
      >
        新增折扣碼
      </Button>
      <Modal />
    </div>
  );
}
