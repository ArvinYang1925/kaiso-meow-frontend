import {
  Table,
  TableBody,
  // TableCell,
  // TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { Pagination } from "@/services/types";
import { Skeleton } from "../ui/skeleton";

type TableWithPaginationProps<T> = {
  isLoading: boolean;
  data: T[];
  pagination: Pagination;
  onPageChange: (newPage: number) => void;
  columns: ReactNode;
  renderRow: (item: T) => ReactNode;
  skeletonRowCount?: number;
  columnCount: number;
};

export function TableWithPagination<T>({
  isLoading,
  data,
  pagination,
  onPageChange,
  columns,
  renderRow,
  skeletonRowCount = 5,
  columnCount = 10,
}: TableWithPaginationProps<T>) {
  const { currentPage, totalPages } = pagination;

  return (
    <div className="space-y-4">
      <Table className="h-[24rem]">
        <TableHeader>
          <TableRow className="text-nowrap">{columns}</TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
              <tr key={`skeleton-${rowIndex}`} className="border-b">
                {Array.from({ length: columnCount }).map((_, colIndex) => (
                  <td key={colIndex} className="p-4">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columnCount}
                className="text-center p-6 text-gray-400 italic bg-gray-50 border rounded-md"
              >
                <div className="flex flex-col items-center space-y-2">
                  <svg
                    className="w-8 h-8 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4m5-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>目前尚無資料</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <TableRow className="text-nowrap" key={index}>
                {renderRow(item)}
              </TableRow>
            ))
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
            className={
              currentPage <= 1
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-gray-700 border-gray-300 hover:bg-gray-200"
            }
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
                variant={page === currentPage ? "outline" : "ghost"}
                size="sm"
                className={
                  page === currentPage
                    ? "text-gray-600 hover:bg-gray-100 hover:text-gray-500 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-300 hover:text-gray-700"
                }
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
            className={
              currentPage >= totalPages
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-gray-700 border-gray-300 hover:bg-gray-200"
            }
          >
            下一頁
          </Button>
        </div>
      </div>
    </div>
  );
}
