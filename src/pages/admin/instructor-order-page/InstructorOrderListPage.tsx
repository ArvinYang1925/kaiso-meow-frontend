import { useEffect } from "react";
import { TableCell, TableHead } from "@/components/ui/table";
import { TableWithPagination } from "@/components/common/TableWithPagination";
import { useInstructorOrderListStore } from "./instructorOrderListStore";

export default function InstructorOrderListPage() {
  const { orderList, pagination, fetchOrderList } =
    useInstructorOrderListStore();

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
    fetchOrderList(pagination.currentPage, 10);
  }, []);

  return (
    <>
      <div className="px-8 w-full md:w-[1200px] mx-auto">
        <div className="mt-8">
          <h1 className="font-semibold text-3xl mb-16">訂單管理</h1>
          <main className="mb-8">
            <TableWithPagination
              data={orderList}
              pagination={pagination}
              columnCount={tableColumn.length}
              onPageChange={(newPage) => {
                fetchOrderList(newPage, 10);
              }}
              columns={
                <>
                  {tableColumn.map((col, index) => (
                    <TableHead key={index} className="whitespace-nowrap px-4">
                      {col.label}
                    </TableHead>
                  ))}
                </>
              }
              renderRow={(order) => (
                <>
                  <TableCell className="whitespace-nowrap px-4">
                    {order.id}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4">
                    {order.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4">
                    {order.title}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4">
                    {order.originalPrice}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4">
                    {order.orderPrice}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4">
                    {order.status}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4">
                    {order.couponType}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4">
                    {order.couponValue}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4">
                    {order.createdAt}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4">
                    {order.updatedAt}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4">
                    {order.paidAt}
                  </TableCell>
                </>
              )}
            />
          </main>
        </div>
      </div>
    </>
  );
}
