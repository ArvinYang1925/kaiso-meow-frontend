import { useEffect } from "react";
import { TableCell, TableHead } from "@/components/ui/table";
import { TableWithPagination } from "@/components/common/TableWithPagination";
import { useOrderListStore } from "./orderListStore";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/stores/commonDialogStore";
import { Pagination } from "@/services/types";
import { Order } from "./types";
import axios from "axios";

// 訂單狀態對應的中文說明
const ORDER_STATUS_MAP = {
  待付款: "待付款",
  已購買課程: "已購買課程",
  付款失敗: "付款失敗",
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
    <div>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center py-3 sm:py-4 gap-3 sm:gap-4">
          <span className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
            第 {currentPage} 頁，共 {totalPages} 頁
          </span>
          <div className="flex items-center gap-1 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              className={`px-2 sm:px-3 py-2 text-xs sm:text-sm ${
                currentPage <= 1
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              上一頁
            </Button>

            {/* 桌面版：顯示所有頁碼 */}
            <div className="hidden md:flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "ghost"}
                    size="sm"
                    className={`px-3 py-2 min-w-[40px] ${
                      page === currentPage
                        ? "bg-gray-700 text-white hover:bg-gray-800 hover:text-white"
                        : "text-gray-600 hover:bg-gray-300 hover:text-gray-700"
                    }`}
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            {/* 手機版：簡化的頁碼顯示 */}
            <div className="md:hidden flex items-center gap-1">
              {totalPages <= 3 ? (
                // 如果總頁數少於等於3頁，顯示所有頁碼
                Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;
                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "ghost"}
                      size="sm"
                      className={`px-2 py-2 min-w-[32px] text-xs ${
                        page === currentPage
                          ? "bg-gray-700 text-white hover:bg-gray-800"
                          : "text-gray-600 hover:bg-gray-300"
                      }`}
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </Button>
                  );
                })
              ) : (
                // 如果總頁數大於3頁，顯示簡化版本
                <>
                  {currentPage > 2 && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-2 py-2 min-w-[32px] text-xs text-gray-600 hover:bg-gray-300"
                        onClick={() => onPageChange(1)}
                      >
                        1
                      </Button>
                      {currentPage > 3 && (
                        <span className="px-1 text-gray-400 text-xs">...</span>
                      )}
                    </>
                  )}

                  {/* 顯示當前頁前後各一頁 */}
                  {[currentPage - 1, currentPage, currentPage + 1]
                    .filter((page) => page >= 1 && page <= totalPages)
                    .map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "ghost"}
                        size="sm"
                        className={`px-2 py-2 min-w-[32px] text-xs ${
                          page === currentPage
                            ? "bg-gray-700 text-white hover:bg-gray-800"
                            : "text-gray-600 hover:bg-gray-300"
                        }`}
                        onClick={() => onPageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}

                  {currentPage < totalPages - 1 && (
                    <>
                      {currentPage < totalPages - 2 && (
                        <span className="px-1 text-gray-400 text-xs">...</span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-2 py-2 min-w-[32px] text-xs text-gray-600 hover:bg-gray-300"
                        onClick={() => onPageChange(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={`px-2 sm:px-3 py-2 text-xs sm:text-sm ${
                currentPage >= totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
            >
              下一頁
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 訂單項目組件 - 手機版卡片式布局
const OrderItem = ({
  order,
  onRepay,
}: {
  order: Order;
  onRepay: (orderId: string) => void;
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
      {/* 第一行：產品名稱和訂單狀態 */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
            {order.title}
          </h3>
        </div>
        <div className="ml-2 sm:ml-3 flex-shrink-0">
          <span
            className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${
              order.status === "已購買課程"
                ? "bg-green-100 text-green-800"
                : order.status === "待付款"
                ? "bg-yellow-100 text-yellow-800"
                : order.status === "付款失敗"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {ORDER_STATUS_MAP[order.status as keyof typeof ORDER_STATUS_MAP] ||
              order.status}
          </span>
        </div>
      </div>

      {/* 第二行：價格和購買日期 */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs sm:text-sm text-gray-600 mb-1">價格</p>
          <p className="text-sm sm:text-lg font-mono font-bold text-gray-900">
            $ {Math.floor(order.orderPrice).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-600 mb-1">購買日期</p>
          <p className="text-sm sm:text-base text-gray-900">{order.paidAt}</p>
        </div>
      </div>

      {/* 第三行：重新付款按鈕 */}
      {order.status === "待付款" && (
        <div className="border-t pt-2 sm:pt-3 flex justify-end">
          <Button
            onClick={() => onRepay(order.id)}
            variant="default"
            size="sm"
            className="w-full sm:w-auto text-sm"
          >
            重新付款
          </Button>
        </div>
      )}
    </div>
  );
};

export default function OrderListPage() {
  const { orderList, pagination, fetchOrder, checkoutEcpay, isLoading } =
    useOrderListStore();
  const { showCommonDialog } = useDialogStore();

  const tableColumn = [
    { label: "產品名稱", key: "title" },
    { label: "價格", key: "orderPrice" },
    { label: "購買日期", key: "paidAt" },
    { label: "操作紀錄", key: "status" },
    { label: "重新付款", key: "action" },
  ];

  const handleRepay = async (orderId: string) => {
    try {
      const response = await checkoutEcpay(orderId);

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
        showCommonDialog({
          title: "Error",
          description: "Something went wrong. Please try again later.",
        });
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchOrder(newPage, 10);
  };

  useEffect(() => {
    fetchOrder(pagination.currentPage, 10);
  }, [fetchOrder, pagination.currentPage]);

  return (
    <>
      <div className="mt-32 px-8 w-full md:w-[1200px] mx-auto">
        <h1 className="font-semibold text-3xl mb-16">購買紀錄</h1>
        <main className="mb-8">
          {/* 桌面版表格視圖 */}
          <div className="hidden lg:block">
            <TableWithPagination
              isLoading={isLoading}
              data={orderList}
              columnCount={tableColumn.length}
              pagination={pagination}
              onPageChange={handlePageChange}
              columns={
                <>
                  {tableColumn.map((col, index) => (
                    <TableHead key={index}>{col.label}</TableHead>
                  ))}
                </>
              }
              renderRow={(order) => (
                <>
                  <TableCell>{order.title}</TableCell>
                  <TableCell>
                    {Math.floor(order.orderPrice).toLocaleString()}
                  </TableCell>
                  <TableCell>{order.paidAt}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    {order.status === "待付款" && (
                      <Button
                        onClick={() => handleRepay(order.id)}
                        variant="default"
                        size="sm"
                      >
                        重新付款
                      </Button>
                    )}
                  </TableCell>
                </>
              )}
            />
          </div>

          {/* 手機版卡片視圖 */}
          <div className="lg:hidden">
            {/* 卡片區塊 */}
            <div className="space-y-3 sm:space-y-4">
              {orderList.map((order) => (
                <OrderItem key={order.id} order={order} onRepay={handleRepay} />
              ))}
            </div>

            {/* 分頁區塊 */}
            <div className="mt-4 sm:mt-6">
              <PaginationControls
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
