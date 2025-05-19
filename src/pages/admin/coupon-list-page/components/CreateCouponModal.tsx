import { Modal } from "@/components/common/Modal";
import Select from "@/components/common/Select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModalStore } from "@/stores/modalStore";
import { useState } from "react";

export default function CreateCouponModal() {
  const { openModal, closeModal } = useModalStore();

  const [discountType, setDiscountType] = useState("");

  const options = [
    { label: "-- 請選擇 --", value: "default" },
    { label: "固定金額", value: "fixed" },
    { label: "百分比", value: "percentage" },
  ];

  const handleOpenModal = () => {
    openModal({
      title: "新增折扣碼",
      body: (
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium">折扣碼名稱</label>
            <Input placeholder="請輸入折扣碼名稱" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">折扣碼</label>
            <Input placeholder="請輸入折扣碼" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">折扣類型</label>
            <Select
              options={options}
              value={discountType}
              onValueChange={setDiscountType}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">折抵金額</label>
            <Input placeholder="請輸入折抵金額" />
          </div>
        </div>
      ),
      footer: (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={closeModal}>
            取消
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => alert("送出成功")}
          >
            送出
          </Button>
        </div>
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
