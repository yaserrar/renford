"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      {/* Mobile */}
      <div className="flex items-center justify-between gap-3 pt-4 md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-full"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Page précédente"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="min-w-0 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground">
          Page {currentPage} sur {totalPages}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-full"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Page suivante"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Desktop */}
      <div className="hidden items-center justify-between pt-4 md:flex">
        <Button
          variant="outline"
          className="rounded-full px-5 text-base"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Précédent
        </Button>

        <div className="inline-flex items-center gap-3 text-base text-foreground lg:gap-5">
          {pageNumbers.map((page) => (
            <button
              type="button"
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                page === currentPage
                  ? "border border-border bg-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {page}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          className="rounded-full px-5 text-base"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Suivant
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
