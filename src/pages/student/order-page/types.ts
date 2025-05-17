export type Order = {
  id: string;
  title: string;
  orderPrice: number;
  status: "購買課程" | "付款失敗" | string; // 可以加上其他已知狀態
  createdAt: string;
  updatedAt: string;
  paidAt: string;
};
