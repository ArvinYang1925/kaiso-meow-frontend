import { useEffect } from "react";
import { TableCell, TableHead } from "@/components/ui/table";
import { TableWithPagination } from "@/components/common/TableWithPagination";
import { useCouponListStore } from "./couponListStore";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/stores/commonDialogStore";
import CreateCouponModal from "./components/CreateCouponModal";

export default function CouponListPage() {
  const { couponList, pagination, fetchCouponList, deleteCouponList } =
    useCouponListStore();

  const { showCommonDialog } = useDialogStore();

  const tableColumn = [
    { label: "折扣碼名稱", key: "couponName" },
    { label: "折扣碼", key: "code" },
    { label: "折扣類型", key: "type" },
    { label: "折抵", key: "value" },
    { label: "過期時間", key: "expiresAt" },
    { label: "操作", key: "action" },
  ];

  const handleDeleteCoupon = async (id: string) => {
    console.log("要刪除的折扣馬id 1", id);
    const response = await deleteCouponList(id);
    const { status, message } = response;
    if (status === "success") {
      showCommonDialog({
        title: status,
        description: message ?? "刪除成功",
      });
      fetchCouponList(1, 10);
    }
  };

  useEffect(() => {
    fetchCouponList(pagination.currentPage, 10);
  }, []);

  return (
    <>
      <div className="container mt-8">
        <h1 className="font-semibold text-3xl mb-16">折扣碼列表</h1>
        <main className="mb-8">
          <div className="table-header grid justify-items-end">
            <CreateCouponModal />
          </div>
          <TableWithPagination
            data={couponList}
            pagination={pagination}
            onPageChange={(newPage) => {
              fetchCouponList(newPage, 10);
            }}
            columns={
              <>
                {tableColumn.map((col, index) => (
                  <TableHead key={index}>{col.label}</TableHead>
                ))}
              </>
            }
            renderRow={(coupon) => (
              <>
                <TableCell>{coupon.couponName}</TableCell>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>{coupon.type}</TableCell>
                <TableCell>{coupon.value}</TableCell>
                <TableCell>{coupon.expiresAt}</TableCell>
                <TableCell>
                  <Button
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => handleDeleteCoupon(coupon.id)}
                  >
                    刪除
                  </Button>
                </TableCell>
              </>
            )}
          />
        </main>
      </div>
    </>
  );
}
