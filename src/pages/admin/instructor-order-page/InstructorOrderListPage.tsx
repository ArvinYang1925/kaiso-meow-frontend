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

// 折扣類型對應的中文說明
const COUPON_TYPE_MAP = {
  percentage: "百分比",
  fixed: "固定金額",
} as const;

// 表格欄位配置
const tableColumn = [
  { label: "訂單編號", key: "id" },
  { label: "學生姓名", key: "name" },
  { label: "訂單名稱", key: "title" },
  { label: "訂單原價", key: "originalPrice" },
  { label: "訂單實付金額", key: "orderPrice" },
  { label: "訂單狀態", key: "status" },
  { label: "折扣碼類型", key: "couponType" },
  { label: "折扣金額", key: "couponValue" },
  { label: "建立時間", key: "createdAt" },
  { label: "異動時間", key: "updatedAt" },
  { label: "付款時間", key: "paidAt" },
];

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-8">
          <DialogHeader className="pb-3 sm:pb-4">
            <DialogTitle className="text-lg sm:text-xl lg:text-2xl">
              訂單詳情
            </DialogTitle>
          </DialogHeader>

          {/* 手機版和平板版布局 */}
          <div className="lg:hidden space-y-3 sm:space-y-4">
            {/* 第一列：學生姓名 */}
            <div className="pb-2 sm:pb-3 border-b border-gray-200">
              <label className="text-xs sm:text-sm font-medium text-gray-500 block mb-1">
                學生姓名
              </label>
              <p className="text-base sm:text-lg font-semibold">{order.name}</p>
            </div>

            {/* 第二列：訂單編號、訂單名稱 */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 pb-2 sm:pb-3 border-b border-gray-200">
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-500 block mb-1">
                  訂單編號
                </label>
                <p className="font-mono text-xs sm:text-sm break-all bg-gray-50 p-2 rounded">
                  {order.id}
                </p>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-500 block mb-1">
                  課程名稱
                </label>
                <p
                  className="text-sm sm:text-base font-medium text-gray-900"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                  title={order.title}
                >
                  {order.title}
                </p>
              </div>
            </div>

            {/* 第三列：價格資訊 */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 pb-2 sm:pb-3 border-b border-gray-200">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                <label className="text-xs sm:text-sm font-medium text-gray-500 block mb-2">
                  價格資訊
                </label>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">
                      訂單原價：
                    </span>
                    <span className="font-mono text-sm sm:text-lg">
                      NT$ {order.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                      實付金額：
                    </span>
                    <span className="font-mono text-sm sm:text-lg font-bold text-green-600">
                      NT$ {order.orderPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                <label className="text-xs sm:text-sm font-medium text-gray-500 block mb-2">
                  訂單狀態
                </label>
                <div className="flex items-center">
                  <Badge
                    variant={
                      order.status === "paid"
                        ? "default"
                        : order.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                    className={`text-xs sm:text-base px-3 sm:px-4 py-1 sm:py-2 ${
                      order.status === "paid"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    {ORDER_STATUS_MAP[
                      order.status as keyof typeof ORDER_STATUS_MAP
                    ] || order.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* 折扣資訊 */}
            {(order.couponType || order.couponValue) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pb-2 sm:pb-3 border-b border-gray-200">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 block mb-1">
                    折扣類型
                  </label>
                  <span className="inline-flex px-2 sm:px-3 py-1 sm:py-2 bg-blue-100 text-blue-800 rounded-lg text-xs sm:text-sm">
                    {COUPON_TYPE_MAP[
                      order.couponType as keyof typeof COUPON_TYPE_MAP
                    ] ||
                      order.couponType ||
                      "-"}
                  </span>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 block mb-1">
                    折扣金額
                  </label>
                  <p className="font-mono text-sm sm:text-lg bg-gray-50 p-2 rounded">
                    {order.couponValue
                      ? `${order.couponValue.toLocaleString()}${
                          order.couponType === "percentage" ? "%" : ""
                        }`
                      : "-"}
                  </p>
                </div>
              </div>
            )}

            {/* 時間資訊 */}
            <div className="border-t pt-3 sm:pt-4">
              <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                時間資訊
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                  <label className="text-xs sm:text-sm font-medium text-gray-500 block mb-1">
                    建立時間
                  </label>
                  <p className="font-mono text-xs sm:text-sm">
                    {order.createdAt}
                  </p>
                </div>
                <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                  <label className="text-xs sm:text-sm font-medium text-gray-500 block mb-1">
                    異動時間
                  </label>
                  <p className="font-mono text-xs sm:text-sm">
                    {order.updatedAt}
                  </p>
                </div>
                <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                  <label className="text-xs sm:text-sm font-medium text-gray-500 block mb-1">
                    付款時間
                  </label>
                  <p className="font-mono text-xs sm:text-sm">
                    {order.paidAt || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 桌機版布局 */}
          <div className="hidden lg:block space-y-6">
            {/* 第一列：學生姓名 */}
            <div className="pb-4 border-b border-gray-200">
              <label className="text-sm font-medium text-gray-500 block mb-2">
                學生姓名
              </label>
              <p className="text-xl font-semibold">{order.name}</p>
            </div>

            {/* 第二列：訂單編號、課程名稱 */}
            <div className="pb-4 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">
                    訂單編號
                  </label>
                  <p className="font-mono text-sm break-all bg-gray-50 p-3 rounded">
                    {order.id}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">
                    課程名稱
                  </label>
                  <p
                    className="text-base font-medium text-gray-900"
                    title={order.title}
                  >
                    {order.title}
                  </p>
                </div>
              </div>
            </div>

            {/* 第三列：價格、訂單狀態 */}
            <div className="pb-4 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-500 block mb-3">
                    價格資訊
                  </label>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">訂單原價：</span>
                      <span className="font-mono text-lg">
                        NT$ {order.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-sm font-medium text-gray-900">
                        實付金額：
                      </span>
                      <span className="font-mono text-lg font-bold text-green-600">
                        NT$ {order.orderPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {/* 折扣資訊 */}
                  {(order.couponType || order.couponValue) && (
                    <div className="mt-4 pt-3 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500 block mb-1">
                            折扣類型
                          </label>
                          <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {COUPON_TYPE_MAP[
                              order.couponType as keyof typeof COUPON_TYPE_MAP
                            ] ||
                              order.couponType ||
                              "-"}
                          </span>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 block mb-1">
                            折扣金額
                          </label>
                          <p className="font-mono text-sm">
                            {order.couponValue
                              ? `${order.couponValue.toLocaleString()}${
                                  order.couponType === "percentage" ? "%" : ""
                                }`
                              : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-500 block mb-3">
                    訂單狀態
                  </label>
                  <div className="flex items-center">
                    <Badge
                      variant={
                        order.status === "paid"
                          ? "default"
                          : order.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className={`text-base px-4 py-2 ${
                        order.status === "paid"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {ORDER_STATUS_MAP[
                        order.status as keyof typeof ORDER_STATUS_MAP
                      ] || order.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* 第四列：時間資訊 */}
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-3">
                時間資訊
              </label>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-xs font-medium text-gray-500 block mb-1">
                    建立時間
                  </label>
                  <p className="font-mono text-sm">{order.createdAt}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-xs font-medium text-gray-500 block mb-1">
                    異動時間
                  </label>
                  <p className="font-mono text-sm">{order.updatedAt}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-xs font-medium text-gray-500 block mb-1">
                    付款時間
                  </label>
                  <p className="font-mono text-sm">{order.paidAt || "-"}</p>
                </div>
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
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
      {/* 第一行：學生姓名和訂單狀態 */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
            {order.name}
          </h3>
        </div>
        <div className="ml-2 sm:ml-3 flex-shrink-0">
          <span
            className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${
              order.status === "paid"
                ? "bg-green-100 text-green-800"
                : order.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : order.status === "failed"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {ORDER_STATUS_MAP[order.status as keyof typeof ORDER_STATUS_MAP] ||
              order.status}
          </span>
        </div>
      </div>

      {/* 第二行：訂單名稱 */}
      <div className="mb-2 sm:mb-3">
        <p className="text-xs sm:text-sm text-gray-600 mb-1">課程名稱</p>
        <p
          className="text-sm sm:text-base font-medium text-gray-900"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          title={order.title}
        >
          {order.title}
        </p>
      </div>

      {/* 第三行：訂單編號 */}
      <div className="mb-3 sm:mb-4">
        <p className="text-xs sm:text-sm text-gray-600 mb-1">訂單編號</p>
        <p
          className="font-mono text-xs sm:text-sm text-gray-900 break-all"
          title={order.id}
        >
          {order.id}
        </p>
      </div>

      {/* 第四行：價格資訊 */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs sm:text-sm text-gray-600 mb-1">原價</p>
          <p className="text-sm sm:text-lg font-mono text-gray-900">
            NT$ {order.originalPrice.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-600 mb-1">實付金額</p>
          <p className="text-sm sm:text-lg font-mono font-bold text-green-600">
            NT$ {order.orderPrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 第五行：折扣資訊 */}
      {(order.couponType || order.couponValue) && (
        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">折扣類型</p>
            <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs sm:text-sm">
              {COUPON_TYPE_MAP[
                order.couponType as keyof typeof COUPON_TYPE_MAP
              ] ||
                order.couponType ||
                "-"}
            </span>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">折扣金額</p>
            <p className="font-mono text-xs sm:text-sm text-gray-900">
              {order.couponValue
                ? `${order.couponValue.toLocaleString()}${
                    order.couponType === "percentage" ? "%" : ""
                  }`
                : "-"}
            </p>
          </div>
        </div>
      )}

      {/* 第六行：查看詳情按鈕 */}
      <div className="border-t pt-2 sm:pt-3 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetail(order)}
          className="w-full sm:w-auto text-sm"
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
          {tableColumn.slice(0, 8).map((column, index) => (
            <div
              key={column.key}
              className={`px-4 py-4 whitespace-nowrap ${
                index === 3 || index === 4 || index === 7 ? "text-right" : ""
              }`}
            >
              {column.label}
            </div>
          ))}
          <div className="px-4 py-4 text-center whitespace-nowrap">操作</div>
        </div>
      </div>

      {/* 表格內容 */}
      <div className="divide-y divide-gray-200">
        {orders.map((order, index) => (
          <div
            key={order.id}
            className={`grid grid-cols-[1fr_150px_150px_100px_100px_120px_100px_100px_100px] text-sm items-center hover:bg-slate-100 transition-colors ${
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
            <div className="px-4 py-4">
              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {COUPON_TYPE_MAP[
                  order.couponType as keyof typeof COUPON_TYPE_MAP
                ] ||
                  order.couponType ||
                  "-"}
              </span>
            </div>
            <div className="px-4 py-4 text-right font-mono text-gray-900">
              {order.couponValue
                ? `${order.couponValue.toLocaleString()}${
                    order.couponType === "percentage" ? "%" : ""
                  }`
                : "-"}
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
      <div className="mt-8 px-6 w-full max-w-full mx-auto">
        <h1 className="font-semibold text-xl sm:text-2xl mb-6 sm:mb-8 px-2 sm:px-0">
          訂單管理
        </h1>

        <main className="mb-8">
          {/* 桌面版表格視圖 */}
          <div className="hidden lg:block max-w-[1400px]">
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
            <div className="space-y-3 sm:space-y-4">
              {orderList.map((order) => (
                <OrderItem
                  key={order.id}
                  order={order}
                  onViewDetail={handleViewDetail}
                />
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
