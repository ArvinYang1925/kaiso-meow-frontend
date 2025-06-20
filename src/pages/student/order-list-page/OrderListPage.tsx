import { useEffect } from "react";
import { TableCell, TableHead } from "@/components/ui/table";
import { TableWithPagination } from "@/components/common/TableWithPagination";
import { useOrderListStore } from "./orderListStore";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/stores/commonDialogStore";
import axios from "axios";

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

  useEffect(() => {
    fetchOrder(pagination.currentPage, 10);
  }, []);

  return (
    <>
      <div className="mt-32 px-8 w-full md:w-[1200px] mx-auto">
        <h1 className="font-semibold text-3xl mb-16">購買紀錄</h1>
        <main className="mb-8">
          <TableWithPagination
            isLoading={isLoading}
            data={orderList}
            columnCount={tableColumn.length}
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
        </main>
      </div>
    </>
  );
}
