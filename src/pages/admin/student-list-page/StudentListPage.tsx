import { useEffect } from "react";
import { TableCell, TableHead } from "@/components/ui/table";
import { TableWithPagination } from "@/components/common/TableWithPagination";
import { useStudentListStore } from "./studentListStore";
import { useScreenLoading } from "@/components/common/useScreenLoading";

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
      <div className="mt-8 px-4 w-full max-w-[1200px] mx-auto">
        <h1 className="font-semibold text-2xl mb-8">學生列表</h1>
        <main className="mb-8 bg-white rounded-lg p-4">
          <TableWithPagination
            isLoading={isLoading}
            data={studentList}
            pagination={pagination}
            columnCount={tableColumn.length}
            onPageChange={(newPage) => {
              fetchStudentList(newPage, 10);
            }}
            columns={
              <>
                <TableHead>{tableColumn[0].label}</TableHead>
                <TableHead>{tableColumn[1].label}</TableHead>
                <TableHead className="pr-6">{tableColumn[2].label}</TableHead>
                <TableHead className="text-right w-48 hidden md:table-cell">
                  {tableColumn[3].label}
                </TableHead>
                <TableHead className="text-right w-48 hidden md:table-cell">
                  {tableColumn[4].label}
                </TableHead>
              </>
            }
            renderRow={(student) => (
              <>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell className="pr-6">{student.phoneNumber}</TableCell>
                <TableCell className="text-right w-48 hidden md:table-cell">
                  {student.createdAt}
                </TableCell>
                <TableCell className="text-right w-48 hidden md:table-cell">
                  {student.updatedAt}
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
