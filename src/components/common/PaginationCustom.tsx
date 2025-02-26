import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

export default function PaginationCustom({
  currentPage,
  totalPage,
  onPageChange,
}: PaginationProps) {
  if (totalPage <= 1) return null; // Không hiển thị nếu chỉ có 1 trang

  return (
    <Pagination className="flex justify-center mt-4">
      <PaginationContent className="flex items-center gap-2">
        {/* Nút Trước */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {/* Các số trang */}
        {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <Button
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          </PaginationItem>
        ))}

        {/* Nút Sau */}
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPage && onPageChange(currentPage + 1)
            }
            className={
              currentPage === totalPage ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
