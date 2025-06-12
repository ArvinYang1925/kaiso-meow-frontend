import { useEffect } from "react";
import { TableCell, TableHead } from "@/components/ui/table";
import { TableWithPagination } from "@/components/common/TableWithPagination";
import { useCouponListStore } from "./couponListStore";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/stores/commonDialogStore";
import { useCommonModalStore } from "@/stores/commonModalStore";
import { CreateCouponModal } from "./components/CreateCouponModal";
import { getInteger } from "@/lib/priceHelper";

export default function CouponListPage() {
  const { couponList, pagination, fetchCouponList, deleteCouponList } =
    useCouponListStore();

  const { showCommonDialog } = useDialogStore();
  const { setIsShowModal } = useCommonModalStore();

  const tableColumn = [
    { label: "折扣碼名稱", key: "couponName" },
    { label: "折扣碼", key: "code" },
    { label: "折扣類型", key: "type" },
    { label: "折抵", key: "value" },
    { label: "起始時間", key: "startsAt" },
    { label: "過期時間", key: "expiresAt" },
    { label: "操作", key: "action" },
  ];

  const handleDeleteCoupon = async (id: string) => {
    const response = await deleteCouponList(id);
    const { status, message } = response;
    showCommonDialog({
      title: `${status}`,
      description: `${message}`,
    });
    fetchCouponList(1, 10);
  };

  useEffect(() => {
    fetchCouponList(pagination.currentPage, 10);
  }, []);

  return (
    <>
      <div className="mt-8 px-8 w-full md:w-[1200px] mx-auto">
        <h1 className="font-semibold text-3xl mb-16">折扣碼列表</h1>
        <main className="mb-8">
          <div className="table-header grid justify-items-end mb-4 pe-4">
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => setIsShowModal(true)}
            >
              新增折扣碼
            </Button>
          </div>
          <TableWithPagination
            data={couponList}
            pagination={pagination}
            columnCount={tableColumn.length}
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
                <TableCell>{getInteger(coupon.value)}</TableCell>
                <TableCell>{coupon.startsAt}</TableCell>
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
      <CreateCouponModal />
    </>
  );
}
