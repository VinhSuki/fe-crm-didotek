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

  // Tạo danh sách số trang hiển thị
  const generatePageNumbers = (): (number | string)[] => {
    if (totalPage <= 5)
      return Array.from({ length: totalPage }, (_, i) => i + 1);

    const pages: (number | string)[] = [1];

    if (currentPage > 3) {
      pages.push("...");
    }

    const middlePages = [currentPage - 1, currentPage, currentPage + 1].filter(
      (p) => p > 1 && p < totalPage
    );
    pages.push(...middlePages);

    if (currentPage < totalPage - 2) {
      pages.push("...");
    }

    pages.push(totalPage);
    return pages;
  };

  return (
    <Pagination className="flex justify-center mt-4">
      <PaginationContent className="flex items-center gap-2">
        {/* Nút Trước */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {/* Các số trang */}
        {generatePageNumbers().map((page, index) => (
          <PaginationItem key={index}>
            {typeof page === "number" ? (
              <Button
                type="button"
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ) : (
              <span className="px-2">...</span>
            )}
          </PaginationItem>
        ))}

        {/* Nút Sau */}
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPage && onPageChange(currentPage + 1)
            }
            className={
              currentPage === totalPage
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
