import { useEffect } from "react";
import { TableCell, TableHead } from "@/components/ui/table";
import { TableWithPagination } from "@/components/common/TableWithPagination";
import { useCouponListStore } from "./couponListStore";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/stores/commonDialogStore";
import { useCommonModalStore } from "@/stores/commonModalStore";
import { CreateCouponModal } from "./components/CreateCouponModal";
import { getInteger } from "@/lib/priceHelper";
import { Plus, Trash2 } from "lucide-react";
import { useScreenLoading } from "@/components/common/useScreenLoading";
import { Coupon } from "./types";
import { Pagination } from "@/services/types";

// 折扣類型對應的中文說明
const COUPON_TYPE_MAP = {
  percentage: "百分比",
  fixed: "固定金額",
} as const;

// 分頁控制組件
const PaginationControls = ({
  pagination,
  onPageChange,
}: {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}) => {
  const { currentPage, totalPages } = pagination;

  return (
    <div className="px-2 py-4">
      {/* 桌面版：單行布局 */}
      <div className="hidden sm:flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          第 {currentPage} 頁，共 {totalPages} 頁
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className={`px-3 py-2 text-sm ${
              currentPage <= 1
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            上一頁
          </Button>

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            return (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "ghost"}
                size="sm"
                className={`px-3 py-2 min-w-[40px] text-sm ${
                  page === currentPage
                    ? "bg-gray-700 text-white hover:bg-gray-800"
                    : "text-gray-600 hover:bg-gray-300"
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`px-3 py-2 text-sm ${
              currentPage >= totalPages
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            下一頁
          </Button>
        </div>
      </div>

      {/* 手機版：兩列布局 */}
      <div className="sm:hidden space-y-3">
        {/* 第一列：頁碼切換 */}
        <div className="flex justify-center items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className={`px-3 py-2 text-xs ${
              currentPage <= 1
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            上一頁
          </Button>

          {Array.from({ length: totalPages }, (_, index) => {
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
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`px-3 py-2 text-xs ${
              currentPage >= totalPages
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            下一頁
          </Button>
        </div>

        {/* 第二列：總數統計 */}
        <div className="flex justify-center">
          <span className="text-xs text-muted-foreground">
            第 {currentPage} 頁，共 {totalPages} 頁
          </span>
        </div>
      </div>
    </div>
  );
};

// 手機版折扣碼卡片組件
const CouponCard = ({
  coupon,
  onDelete,
}: {
  coupon: Coupon;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* 第一行：折扣碼名稱和類型 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <h3
            className="text-base font-semibold text-gray-900 truncate"
            title={coupon.couponName}
          >
            {coupon.couponName}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            折扣碼：
            <span className="font-mono text-gray-900">{coupon.code}</span>
          </p>
        </div>
        <div className="flex-shrink-0">
          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {COUPON_TYPE_MAP[coupon.type as keyof typeof COUPON_TYPE_MAP] ||
              coupon.type}
          </span>
        </div>
      </div>

      {/* 第二行：折抵金額 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 mb-1">折抵</p>
        <p className="text-lg font-bold text-orange-600">
          {getInteger(coupon.value)
            ? `${getInteger(coupon.value).toLocaleString()}${
                coupon.type === "percentage" ? "%" : ""
              }`
            : "-"}
        </p>
      </div>

      {/* 第三行：時間資訊 */}
      <div className="grid grid-cols-1 gap-2 mb-4">
        <div>
          <p className="text-xs text-gray-600 mb-1">起始時間</p>
          <p className="text-sm text-gray-900">{coupon.startsAt}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">過期時間</p>
          <p className="text-sm text-gray-900">{coupon.expiresAt}</p>
        </div>
      </div>

      {/* 第四行：操作按鈕 */}
      <div className="border-t pt-3 flex justify-end">
        <Button
          size="sm"
          onClick={() => onDelete(coupon.id)}
          className="bg-red-500 hover:bg-red-600 text-white text-sm"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          刪除
        </Button>
      </div>
    </div>
  );
};

export default function CouponListPage() {
  const {
    couponList,
    pagination,
    fetchCouponList,
    deleteCouponList,
    isLoading,
  } = useCouponListStore();

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

  const handlePageChange = (newPage: number) => {
    fetchCouponList(newPage, 10);
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
      {/* 調整容器寬度以顯示漢堡選單 */}
      <div className="mt-8 px-4 sm:px-6 w-full max-w-full mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h1 className="font-semibold text-xl sm:text-2xl">折扣碼列表</h1>
          <Button
            className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto text-sm sm:text-base flex items-center justify-center"
            onClick={() => setIsShowModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            新增折扣碼
          </Button>
        </div>

        <main className="mb-8">
          {/* 桌面版表格視圖 */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg p-4">
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <TableWithPagination
                    isLoading={isLoading}
                    data={couponList}
                    pagination={pagination}
                    columnCount={tableColumn.length}
                    onPageChange={handlePageChange}
                    columns={
                      <>
                        {tableColumn.map((col, index) => (
                          <TableHead key={index} className="text-sm">
                            {col.label}
                          </TableHead>
                        ))}
                      </>
                    }
                    renderRow={(coupon) => (
                      <>
                        <TableCell className="p-4">
                          {coupon.couponName}
                        </TableCell>
                        <TableCell className="p-4 font-mono text-sm">
                          {coupon.code}
                        </TableCell>
                        <TableCell className="p-4">
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {COUPON_TYPE_MAP[
                              coupon.type as keyof typeof COUPON_TYPE_MAP
                            ] || coupon.type}
                          </span>
                        </TableCell>
                        <TableCell className="p-4">
                          {getInteger(coupon.value)
                            ? `${getInteger(coupon.value).toLocaleString()}${
                                coupon.type === "percentage" ? "%" : ""
                              }`
                            : "-"}
                        </TableCell>
                        <TableCell className="p-4">{coupon.startsAt}</TableCell>
                        <TableCell className="p-4">
                          {coupon.expiresAt}
                        </TableCell>
                        <TableCell className="p-4">
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
                </div>
              </div>
            </div>
          </div>

          {/* 手機版卡片視圖 */}
          <div className="lg:hidden">
            {/* 卡片區塊 */}
            <div className="space-y-4">
              {couponList.map((coupon) => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  onDelete={handleDeleteCoupon}
                />
              ))}
            </div>

            {/* 分頁區塊 */}
            <div className="mt-6">
              <PaginationControls
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </main>
      </div>

      <CreateCouponModal />
      {/* 全螢幕 Loading */}
      <ScreenLoading />
    </>
  );
}
