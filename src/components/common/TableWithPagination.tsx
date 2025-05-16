import {
  Table,
  TableBody,
  TableCell,
  // TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { Pagination } from "@/services/types";

type TableWithPaginationProps<T> = {
  data: T[];
  pagination: Pagination;
  onPageChange: (newPage: number) => void;
  columns: ReactNode;
  renderRow: (item: T) => ReactNode;
};

export function TableWithPagination<T>({
  data,
  pagination,
  onPageChange,
  columns,
  renderRow,
}: TableWithPaginationProps<T>) {
  const { currentPage, totalPages } = pagination;

  return (
    <div className="space-y-4">
      <Table className="h-[24rem]">
        <TableHeader>
          <TableRow>{columns}</TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <TableRow key={index}>{renderRow(item)}</TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center">
                查無資料
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          第 {currentPage} 頁，共 {totalPages} 頁
        </span>
        <div className="space-x-2 flex items-center">
          <Button
            variant="outline"
            size="sm"
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
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
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
          >
            下一頁
          </Button>
        </div>
      </div>
    </div>
  );
}
