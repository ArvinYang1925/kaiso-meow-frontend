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
      <div className="container mt-8">
        <h1 className="font-semibold text-3xl mb-16">訂單管理</h1>
        <main className="mb-8">
          <TableWithPagination
            data={orderList}
            pagination={pagination}
            onPageChange={(newPage) => {
              fetchOrderList(newPage, 10);
            }}
            columns={
              <>
                {tableColumn.map((col, index) => (
                  <TableHead key={index}>{col.label}</TableHead>
                ))}
              </>
            }
            renderRow={(order) => (
              <>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.name}</TableCell>
                <TableCell>{order.title}</TableCell>
                <TableCell>{order.originalPrice}</TableCell>
                <TableCell>{order.orderPrice}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.couponType}</TableCell>
                <TableCell>{order.couponValue}</TableCell>
                <TableCell>{order.createdAt}</TableCell>
                <TableCell>{order.updatedAt}</TableCell>
                <TableCell>{order.paidAt}</TableCell>
              </>
            )}
          />
        </main>
      </div>
    </>
  );
}
