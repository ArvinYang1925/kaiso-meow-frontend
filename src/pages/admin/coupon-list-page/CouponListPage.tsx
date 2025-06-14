import { useEffect } from "react";
import { TableCell, TableHead } from "@/components/ui/table";
import { TableWithPagination } from "@/components/common/TableWithPagination";
import { useCouponListStore } from "./couponListStore";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/stores/commonDialogStore";
import { useCommonModalStore } from "@/stores/commonModalStore";
import { CreateCouponModal } from "./components/CreateCouponModal";
import { getInteger } from "@/lib/priceHelper";
import { Plus } from "lucide-react";
import { useScreenLoading } from "@/components/common/useScreenLoading";

export default function CouponListPage() {
  const { couponList, pagination, fetchCouponList, deleteCouponList } =
    useCouponListStore();

  // 全螢幕 Loading
  const { ScreenLoading, withLoading } = useScreenLoading();

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

    // 重新載入資料時也使用 withLoading
    await withLoading(async () => {
      await fetchCouponList(1, 10);
    });
  };

  useEffect(() => {
    const loadInitialData = async () => {
      return withLoading(async () => {
        await fetchCouponList(pagination.currentPage, 10);
      });
    };

    loadInitialData();
  }, [fetchCouponList, pagination.currentPage, withLoading]);

  return (
    <>
      <div className="mt-8 px-4 w-full max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-semibold text-2xl">折扣碼列表</h1>
          <Button
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => setIsShowModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            新增折扣碼
          </Button>
        </div>
        <main className="mb-8 bg-white rounded-lg p-4">
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
                    size="sm"
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
      {/* 全螢幕 Loading */}
      <ScreenLoading />
    </>
  );
}
