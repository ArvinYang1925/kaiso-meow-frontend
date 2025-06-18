import { useEffect, useState } from "react";
import { useInstructorOrderListStore } from "./instructorOrderListStore";
import { useScreenLoading } from "@/components/common/useScreenLoading";
import { InstructorOrder } from "./types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/services/types";

// 訂單狀態對應的中文說明
const ORDER_STATUS_MAP = {
  pending: "待付款",
  paid: "已購買課程",
  failed: "付款失敗",
} as const;

// 獨立的分頁器組件
const PaginationControls = ({
  pagination,
  onPageChange,
}: {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}) => {
  const { currentPage, totalPages } = pagination;

  return (
    <div className="flex justify-between items-center p-4">
      <span className="text-sm text-muted-foreground hidden lg:block">
        第 {currentPage} 頁，共 {totalPages} 頁
      </span>
      <div className="space-x-2 flex items-center lg:ml-auto">
        <Button
          variant="outline"
          size="sm"
          className={
            currentPage <= 1
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "text-gray-700 border-gray-300 hover:bg-gray-200"
          }
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          上一頁
        </Button>

        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          return (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "ghost"}
              size="sm"
              className={
                page === currentPage
                  ? "bg-gray-700 text-white hover:bg-gray-800 hover:text-white"
                  : "text-gray-600 hover:bg-gray-300 hover:text-gray-700"
              }
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={
            currentPage >= totalPages
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "text-gray-700 border-gray-300 hover:bg-gray-200"
          }
        >
          下一頁
        </Button>
      </div>
    </div>
  );
};

// 訂單詳情彈窗組件
const OrderDetailModal = ({
  order,
  isOpen,
  onClose,
}: {
  order: InstructorOrder | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>訂單詳情</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 第一列：學生姓名 */}
          <div>
            <label className="text-sm font-medium text-gray-500">
              學生姓名
            </label>
            <p className="text-lg font-semibold">{order.name}</p>
          </div>

          {/* 第二列：訂單編號、訂單名稱 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-gray-200">
            <div>
              <label className="text-sm font-medium text-gray-500">
                訂單編號
              </label>
              <p className="font-mono text-sm break-all">{order.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                訂單名稱
              </label>
              <p className="text-sm">{order.title}</p>
            </div>
          </div>

          {/* 第三列：訂單原價、實付金額、訂單狀態、折扣類型、折扣金額 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                訂單原價
              </label>
              <p className="font-mono text-lg">
                {order.originalPrice.toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                實付金額
              </label>
              <p className="font-mono text-lg font-semibold">
                {order.orderPrice.toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                訂單狀態
              </label>
              <div className="mt-1">
                <Badge
                  variant={
                    order.status === "paid"
                      ? "default"
                      : order.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                  className={
                    order.status === "paid"
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      : "bg-red-100 text-red-800 hover:bg-red-200"
                  }
                >
                  {ORDER_STATUS_MAP[
                    order.status as keyof typeof ORDER_STATUS_MAP
                  ] || order.status}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                折扣類型
              </label>
              <p className="text-sm">{order.couponType || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                折扣金額
              </label>
              <p className="font-mono text-sm">
                {order.couponValue ? order.couponValue.toLocaleString() : "-"}
              </p>
            </div>
          </div>

          {/* 時間資訊 */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">時間資訊</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  建立時間
                </label>
                <p className="font-mono text-sm">{order.createdAt}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  異動時間
                </label>
                <p className="font-mono text-sm">{order.updatedAt}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  付款時間
                </label>
                <p className="font-mono text-sm">{order.paidAt || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// 訂單項目組件
const OrderItem = ({
  order,
  onViewDetail,
}: {
  order: InstructorOrder;
  onViewDetail: (order: InstructorOrder) => void;
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* 第一行：訂單編號、學生姓名、訂單狀態 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4">
          <div className="text-xs text-gray-500">訂單編號</div>
          <div
            className="font-mono text-sm font-medium truncate max-w-[120px]"
            title={order.id}
          >
            {order.id}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium">{order.name}</div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              order.status === "paid"
                ? "bg-green-100 text-green-800"
                : order.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : order.status === "failed"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
            title={
              ORDER_STATUS_MAP[order.status as keyof typeof ORDER_STATUS_MAP] ||
              order.status
            }
          >
            {ORDER_STATUS_MAP[order.status as keyof typeof ORDER_STATUS_MAP] ||
              order.status}
          </span>
        </div>
      </div>

      {/* 第二行：訂單名稱 */}
      <div className="mb-3">
        <div className="text-sm font-medium truncate" title={order.title}>
          {order.title}
        </div>
      </div>

      {/* 第三行：價格資訊和折扣資訊 */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">原價:</span>
            <span className="font-mono">
              {order.originalPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">實付:</span>
            <span className="font-mono font-semibold">
              {order.orderPrice.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">折扣類型:</span>
            <span
              className="truncate max-w-[80px]"
              title={order.couponType || "-"}
            >
              {order.couponType || "-"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">折扣金額:</span>
            <span
              className="font-mono"
              title={
                order.couponValue ? order.couponValue.toLocaleString() : "-"
              }
            >
              {order.couponValue ? order.couponValue.toLocaleString() : "-"}
            </span>
          </div>
        </div>
      </div>

      {/* 第四行：查看詳情按鈕 */}
      <div className="border-t pt-3 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetail(order)}
          className="text-xs whitespace-nowrap"
        >
          查看詳情
        </Button>
      </div>
    </div>
  );
};

// 表格組件 - 只包含表格，不包含分頁器
const OrderTable = ({
  orders,
  onViewDetail,
}: {
  orders: InstructorOrder[];
  onViewDetail: (order: InstructorOrder) => void;
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* 表頭 */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-[1fr_150px_150px_100px_100px_120px_100px_100px_100px] text-sm font-medium text-gray-700">
          <div className="px-4 py-4">訂單編號</div>
          <div className="px-4 py-4">學生姓名</div>
          <div className="px-4 py-4">訂單名稱</div>
          <div className="px-4 py-4 text-right">訂單原價</div>
          <div className="px-4 py-4 text-right">實付金額</div>
          <div className="px-4 py-4">訂單狀態</div>
          <div className="px-4 py-4">折扣類型</div>
          <div className="px-4 py-4 text-right">折扣金額</div>
          <div className="px-4 py-4 text-center">操作</div>
        </div>
      </div>

      {/* 表格內容 */}
      <div className="divide-y divide-gray-200">
        {orders.map((order, index) => (
          <div
            key={order.id}
            className={`grid grid-cols-[1fr_150px_150px_100px_100px_120px_100px_100px_100px] text-sm items-center hover:bg-blue-50 transition-colors ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
            }`}
          >
            <div
              className="px-4 py-4 font-mono text-xs truncate text-gray-900"
              title={order.id}
            >
              {order.id}
            </div>
            <div className="px-4 py-4 text-gray-900">{order.name}</div>
            <div
              className="px-4 py-4 text-gray-900 truncate"
              title={order.title}
            >
              {order.title}
            </div>
            <div className="px-4 py-4 text-right font-mono text-gray-900">
              {order.originalPrice.toLocaleString()}
            </div>
            <div className="px-4 py-4 text-right font-mono font-semibold text-gray-900">
              {order.orderPrice.toLocaleString()}
            </div>
            <div className="px-4 py-4">
              <span
                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === "paid"
                    ? "bg-green-100 text-green-800"
                    : order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "failed"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
                title={
                  ORDER_STATUS_MAP[
                    order.status as keyof typeof ORDER_STATUS_MAP
                  ] || order.status
                }
              >
                {ORDER_STATUS_MAP[
                  order.status as keyof typeof ORDER_STATUS_MAP
                ] || order.status}
              </span>
            </div>
            <div
              className="px-4 py-4 truncate text-gray-900"
              title={order.couponType || "-"}
            >
              {order.couponType || "-"}
            </div>
            <div className="px-4 py-4 text-right font-mono text-gray-900">
              {order.couponValue ? order.couponValue.toLocaleString() : "-"}
            </div>
            <div className="px-4 py-4 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetail(order)}
                className="text-xs whitespace-nowrap"
              >
                查看詳情
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function InstructorOrderListPage() {
  const { orderList, pagination, fetchOrderList } =
    useInstructorOrderListStore();
  const { ScreenLoading, withLoading } = useScreenLoading();
  const [selectedOrder, setSelectedOrder] = useState<InstructorOrder | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleViewDetail = (order: InstructorOrder) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

  const handlePageChange = (newPage: number) => {
    fetchOrderList(newPage, 10);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      return withLoading(async () => {
        await fetchOrderList(pagination.currentPage, 10);
      });
    };

    loadInitialData();
  }, [fetchOrderList, pagination.currentPage, withLoading]);

  return (
    <>
      <div className="mt-8 px-4 w-full max-w-[1400px] mx-auto">
        <h1 className="font-semibold text-2xl mb-8">訂單管理</h1>

        <main className="mb-8">
          {/* 桌面版表格視圖 */}
          <div className="hidden lg:block">
            {/* 表格區塊 */}
            <OrderTable orders={orderList} onViewDetail={handleViewDetail} />

            {/* 分頁區塊 */}
            <div className="mt-2">
              <PaginationControls
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          </div>

          {/* 行動版卡片視圖 */}
          <div className="lg:hidden">
            {/* 卡片區塊 */}
            <div className="space-y-4">
              {orderList.map((order) => (
                <OrderItem
                  key={order.id}
                  order={order}
                  onViewDetail={handleViewDetail}
                />
              ))}
            </div>

            {/* 分頁區塊 */}
            <div className="mt-2">
              <PaginationControls
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </main>
      </div>

      {/* 訂單詳情彈窗 */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
      />

      <ScreenLoading />
    </>
  );
}
