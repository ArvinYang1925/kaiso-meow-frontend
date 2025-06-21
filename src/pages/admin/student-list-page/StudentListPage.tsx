import { useEffect } from "react";
import { TableCell, TableHead } from "@/components/ui/table";
import { TableWithPagination } from "@/components/common/TableWithPagination";
import { useStudentListStore } from "./studentListStore";
import { useScreenLoading } from "@/components/common/useScreenLoading";
import { Button } from "@/components/ui/button";
import { Student } from "./types";
import { Pagination } from "@/services/types";

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

// 手機版學生卡片組件
const StudentCard = ({ student }: { student: Student }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* 第一行：學生姓名 */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
      </div>

      {/* 第二行：Email */}
      <div className="mb-3">
        <p className="text-xs text-gray-600 mb-1">Email</p>
        <p className="text-sm text-gray-900 break-all" title={student.email}>
          {student.email}
        </p>
      </div>

      {/* 第三行：電話號碼 */}
      <div className="mb-4">
        <p className="text-xs text-gray-600 mb-1">電話號碼</p>
        <p className="text-sm text-gray-900">{student.phoneNumber}</p>
      </div>

      {/* 第四行：時間資訊 */}
      <div className="grid grid-cols-1 gap-2 p-3 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-600 mb-1">建立時間</p>
          <p className="text-sm text-gray-900">{student.createdAt}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">異動時間</p>
          <p className="text-sm text-gray-900">{student.updatedAt}</p>
        </div>
      </div>
    </div>
  );
};

export default function StudentListPage() {
  const { studentList, pagination, fetchStudentList, isLoading } =
    useStudentListStore();
  // 全螢幕 Loading
  const { ScreenLoading, withLoading } = useScreenLoading();

  const tableColumn = [
    { label: "姓名", key: "name" },
    { label: "Email", key: "email" },
    { label: "電話號碼", key: "phoneNumber" },
    { label: "建立時間", key: "createdAt" },
    { label: "異動時間", key: "updatedAt" },
  ];

  const handlePageChange = (newPage: number) => {
    fetchStudentList(newPage, 10);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      return withLoading(async () => {
        await fetchStudentList(pagination.currentPage, 10);
      });
    };

    loadInitialData();
  }, [fetchStudentList, pagination.currentPage, withLoading]);

  return (
    <>
      <div className="mt-8 px-6 w-full max-w-full mx-auto">
        <h1 className="font-semibold text-xl sm:text-2xl mb-6 sm:mb-8">
          學生列表
        </h1>

        <main className="mb-8">
          {/* 桌面版表格視圖 */}
          <div className="hidden lg:block max-w-[1200px]">
            <div className="bg-white rounded-lg p-4">
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  <TableWithPagination
                    isLoading={isLoading}
                    data={studentList}
                    pagination={pagination}
                    columnCount={tableColumn.length}
                    onPageChange={handlePageChange}
                    columns={
                      <>
                        <TableHead className="text-sm">
                          {tableColumn[0].label}
                        </TableHead>
                        <TableHead className="text-sm">
                          {tableColumn[1].label}
                        </TableHead>
                        <TableHead className="text-sm">
                          {tableColumn[2].label}
                        </TableHead>
                        <TableHead className="text-sm text-right">
                          {tableColumn[3].label}
                        </TableHead>
                        <TableHead className="text-sm text-right">
                          {tableColumn[4].label}
                        </TableHead>
                      </>
                    }
                    renderRow={(student) => (
                      <>
                        <TableCell className="p-4">{student.name}</TableCell>
                        <TableCell className="p-4" title={student.email}>
                          {student.email}
                        </TableCell>
                        <TableCell className="p-4">
                          {student.phoneNumber}
                        </TableCell>
                        <TableCell className="p-4 text-right">
                          {student.createdAt}
                        </TableCell>
                        <TableCell className="p-4 text-right">
                          {student.updatedAt}
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
              {studentList.map((student) => (
                <StudentCard
                  key={student.id || student.email}
                  student={student}
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

      {/* 全螢幕 Loading */}
      <ScreenLoading />
    </>
  );
}
