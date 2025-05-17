import { useEffect } from "react";
import { TableCell, TableHead } from "@/components/ui/table";
import { TableWithPagination } from "@/components/common/TableWithPagination";
import { useOrderStore } from "./orderStore";

export default function OrderPage() {
  const { orderList, pagination, fetchOrder } = useOrderStore();

  const tableColumn = [
    { label: "產品名稱", key: "title" },
    { label: "價格", key: "orderPrice" },
    { label: "購買日期", key: "paidAt" },
    { label: "操作紀錄", key: "status" },
  ];

  useEffect(() => {
    fetchOrder(pagination.currentPage, 10);
  }, []);

  return (
    <>
      <div className="container mt-32">
        <h1 className="font-semibold text-3xl mb-16">購買紀錄</h1>
        <main className="mb-8">
          <TableWithPagination
            data={orderList}
            pagination={pagination}
            onPageChange={(newPage) => {
              fetchOrder(newPage, 10);
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
                <TableCell>{order.title}</TableCell>
                <TableCell>{order.orderPrice}</TableCell>
                <TableCell>{order.paidAt}</TableCell>
                <TableCell>{order.status}</TableCell>
              </>
            )}
          />
        </main>
      </div>
    </>
  );
}
