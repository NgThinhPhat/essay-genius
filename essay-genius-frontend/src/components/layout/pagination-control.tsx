import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) => {
  const getPageNumbers = () => {
    const maxDisplayed = 5;
    const pages: number[] = [];

    let startPage = Math.max(1, currentPage - Math.floor(maxDisplayed / 2));
    let endPage = startPage + maxDisplayed - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxDisplayed + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {/* First Page */}
        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(1);
            }}
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          >
            {"<<"}
          </PaginationLink>
        </PaginationItem>

        {/* Previous Page */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {getPageNumbers().map((pageNum) => (
          <PaginationItem key={pageNum}>
            <PaginationLink
              href="#"
              isActive={pageNum === currentPage}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(pageNum);
              }}
            >
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Ellipsis */}
        {totalPages > 5 && currentPage + 2 < totalPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Next Page */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* Last Page */}
        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(totalPages);
            }}
            aria-disabled={currentPage === totalPages}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          >
            {">>"}
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
