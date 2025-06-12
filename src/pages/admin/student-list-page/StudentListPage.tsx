import { useEffect } from "react";
import { TableCell, TableHead } from "@/components/ui/table";
import { TableWithPagination } from "@/components/common/TableWithPagination";
import { useStudentListStore } from "./studentListStore";

export default function StudentListPage() {
  const { studentList, pagination, fetchStudentList } = useStudentListStore();

  const tableColumn = [
    { label: "姓名", key: "name" },
    { label: "Email", key: "email" },
    { label: "電話號碼", key: "phoneNumber" },
    { label: "建立時間", key: "createdAt" },
    { label: "異動時間", key: "updatedAt" },
  ];

  useEffect(() => {
    fetchStudentList(pagination.currentPage, 10);
  }, []);

  return (
    <>
      <div className="mt-8 px-8 w-full md:w-[1200px] mx-auto">
        <h1 className="font-semibold text-3xl mb-16">學生列表</h1>
        <main className="mb-8">
          <TableWithPagination
            data={studentList}
            pagination={pagination}
            columnCount={tableColumn.length}
            onPageChange={(newPage) => {
              fetchStudentList(newPage, 10);
            }}
            columns={
              <>
                {tableColumn.map((col, index) => (
                  <TableHead key={index}>{col.label}</TableHead>
                ))}
              </>
            }
            renderRow={(student) => (
              <>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.phoneNumber}</TableCell>
                <TableCell>{student.createdAt}</TableCell>
                <TableCell>{student.updatedAt}</TableCell>
              </>
            )}
          />
        </main>
      </div>
    </>
  );
}
