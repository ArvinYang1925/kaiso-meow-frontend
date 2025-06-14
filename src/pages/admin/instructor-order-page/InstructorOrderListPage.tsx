import { useEffect } from "react";
import { TableCell, TableHead } from "@/components/ui/table";
import { TableWithPagination } from "@/components/common/TableWithPagination";
import { useInstructorOrderListStore } from "./instructorOrderListStore";
import { useScreenLoading } from "@/components/common/useScreenLoading";

// 訂單狀態對應的中文說明
const ORDER_STATUS_MAP = {
  pending: "待付款",
  paid: "已購買課程",
  failed: "付款失敗",
} as const;

export default function InstructorOrderListPage() {
  const { orderList, pagination, fetchOrderList } =
    useInstructorOrderListStore();
  // 全螢幕 Loading
  const { ScreenLoading, withLoading } = useScreenLoading();

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
      <div className="mt-8 px-4 w-full max-w-[1200px] mx-auto">
        <h1 className="font-semibold text-2xl mb-8">訂單管理</h1>
        <main className="mb-8 bg-white rounded-lg p-4">
          <TableWithPagination
            data={orderList}
            pagination={pagination}
            columnCount={tableColumn.length}
            onPageChange={(newPage) => {
              fetchOrderList(newPage, 10);
            }}
            columns={
              <>
                <TableHead className="whitespace-nowrap">
                  {tableColumn[0].label}
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  {tableColumn[1].label}
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  {tableColumn[2].label}
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  {tableColumn[3].label}
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  {tableColumn[4].label}
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  {tableColumn[5].label}
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  {tableColumn[6].label}
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  {tableColumn[7].label}
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  {tableColumn[8].label}
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  {tableColumn[9].label}
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  {tableColumn[10].label}
                </TableHead>
              </>
            }
            renderRow={(order) => (
              <>
                <TableCell className="font-mono text-xs whitespace-nowrap">
                  {order.id}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {order.name}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {order.title}
                </TableCell>
                <TableCell className="text-right font-mono whitespace-nowrap">
                  {order.originalPrice}
                </TableCell>
                <TableCell className="text-right font-mono font-semibold whitespace-nowrap">
                  {order.orderPrice}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {ORDER_STATUS_MAP[
                      order.status as keyof typeof ORDER_STATUS_MAP
                    ] || order.status}
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {order.couponType}
                </TableCell>
                <TableCell className="text-right font-mono whitespace-nowrap">
                  {order.couponValue}
                </TableCell>
                <TableCell className="text-right text-sm text-gray-600 whitespace-nowrap">
                  {order.createdAt}
                </TableCell>
                <TableCell className="text-right text-sm text-gray-600 whitespace-nowrap">
                  {order.updatedAt}
                </TableCell>
                <TableCell className="text-right text-sm text-gray-600 whitespace-nowrap">
                  {order.paidAt}
                </TableCell>
              </>
            )}
          />
        </main>
      </div>

      {/* 全螢幕 Loading */}
      <ScreenLoading />
    </>
  );
}
