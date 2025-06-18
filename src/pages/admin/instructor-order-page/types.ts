export type InstructorOrder = {
  id: string;
  name: string;
  title: string;
  originalPrice: number;
  orderPrice: number;
  status: "pending" | "paid" | "failed";
  couponType?: string;
  couponValue?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
};
