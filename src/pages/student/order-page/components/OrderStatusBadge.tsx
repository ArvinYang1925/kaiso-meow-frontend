import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/lib/enum";

type OrderStatusBadgeProps = {
  status: null | "pending" | "paid" | "failed";
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  if (!status) return null;

  const badgeMap = {
    [OrderStatus.PENDING]: (
      <Badge className="bg-gray-100 text-gray-600 border border-gray-300 font-medium text-sm rounded-lg">
        待付款
      </Badge>
    ),
    [OrderStatus.PAID]: (
      <Badge className="bg-lime-100 text-lime-600 border border-lime-300 font-medium text-sm rounded-lg">
        付款完成
      </Badge>
    ),
    [OrderStatus.FAILED]: (
      <Badge className="bg-rose-100 text-rose-700 border border-rose-300 font-medium text-sm rounded-lg">
        付款失敗
      </Badge>
    ),
  };

  return badgeMap[status] ?? null;
};
