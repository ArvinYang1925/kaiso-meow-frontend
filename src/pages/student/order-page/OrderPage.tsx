import { useEffect } from "react";
import { TableCell, TableHead } from "@/components/ui/table";
import { TableWithPagination } from "@/components/common/TableWithPagination";
import { useOrderStore } from "./orderStore";

export default function OrderPage() {
  const { orderList, pagination, fetchOrder } = useOrderStore();

  useEffect(() => {
    fetchOrder(pagination.currentPage, 10);
  }, []);

  return (
    <main className="p-4">
      <TableWithPagination
        data={orderList}
        pagination={pagination}
        onPageChange={(newPage) => {
          fetchOrder(newPage, 10);
        }}
        columns={
          <>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Created</TableHead>
          </>
        }
        renderRow={(student) => (
          <>
            <TableCell>{student.id}</TableCell>
            {/* <TableCell>{student.name}</TableCell>
            <TableCell>{student.email}</TableCell>
            <TableCell>{student.phoneNumber}</TableCell>
            <TableCell>{student.createdAt}</TableCell> */}
          </>
        )}
      />
    </main>
  );
}
