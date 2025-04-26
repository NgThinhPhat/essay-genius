"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { queryOptions, useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { api } from "@/lib/api"
import { listEssayResponseSchema } from "@/constracts/essay.constract"
import EssayPost from "@/components/layout/essay-post"
import { Filter, Search } from "lucide-react"

const getEssaysQueryOptions = ({
  searchTerm,
  bandRange,
  currentPage,
}: {
  searchTerm: string;
  bandRange: [number, number];
  currentPage: number;
}) =>
  queryOptions({
    queryKey: ["essays", searchTerm, bandRange, currentPage],
    queryFn: async () => {
      const { status, body } = await api.essay.getEssays({
        query: {
          promptText: searchTerm || undefined,
          bandFrom: bandRange[0],
          bandTo: bandRange[1],
          page: currentPage - 1,
          size: 6,
          visibility: "PUBLIC",
          ownByCurrentUser: false,
        },
      });

      switch (status) {
        case 200:
          return listEssayResponseSchema.parse(body);
        default:
          throw new Error(body?.message || "Failed to fetch essays");
      }
    },
    enabled: true,
    retry: false,
    refetchOnWindowFocus: false,
  });

export default function ScoredEssays() {
  const [searchTerm, setSearchTerm] = useState("");
  const [bandRange, setBandRange] = useState<[number, number]>([5.0, 9.0]);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery(
    getEssaysQueryOptions({ searchTerm, bandRange, currentPage })
  );

  const publicEssays = data?.content || [];
  const totalPages = data?.totalPages || 1;

  const handleApplyFilter = () => {
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="space-y-4 mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Public Scored Essays</h1>
        <p className="text-muted-foreground">Browse essays shared by other users</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by keywords in prompt..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Essays</SheetTitle>
              <SheetDescription>Adjust filters to find specific essays</SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Band Score Range</h3>
                <div className="px-1">
                  <Slider
                    defaultValue={[5.0, 9.0]}
                    max={9.0}
                    min={5.0}
                    step={0.5}
                    value={bandRange}
                    onValueChange={(val: number[]) => setBandRange([val[0], val[1]])}
                  />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Band {bandRange[0].toFixed(1)}</span>
                    <span>Band {bandRange[1].toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Task Type</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">Task 1</Button>
                  <Button variant="outline" size="sm">Task 2</Button>
                </div>
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button onClick={handleApplyFilter}>Apply Filters</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="space-y-8">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading essays...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error.message}</p>
        ) : publicEssays.length === 0 ? (
          <p className="text-center text-muted-foreground">No essays found</p>
        ) : (
          publicEssays.map((essay) => <EssayPost key={essay.id} essayPost={essay} />)
        )}
      </div>


      <Pagination className="mt-8">
        <PaginationContent>
          {/* First Page */}
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={() => setCurrentPage(1)}
              aria-disabled={currentPage === 1}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            >
              {"<<"}
            </PaginationLink>
          </PaginationItem>

          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => {
                if (currentPage > 1) setCurrentPage((prev) => prev - 1);
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
                onClick={() => setCurrentPage(pageNum)}
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

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => {
                if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
              }}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {/* Last Page */}
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={() => setCurrentPage(totalPages)}
              aria-disabled={currentPage === totalPages}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            >
              {">>"}
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}



