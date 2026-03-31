import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface PaginationControlsProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  basePath: string;
}

export function PaginationControls({ 
  currentPage, 
  totalCount, 
  pageSize, 
  basePath 
}: PaginationControlsProps) {
  const totalPages = Math.ceil(totalCount / pageSize);
  
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
      <div className="text-sm text-slate-500 font-medium">
        Showing <span className="font-bold text-slate-900">{Math.min((currentPage - 1) * pageSize + 1, totalCount)}</span> to <span className="font-bold text-slate-900">{Math.min(currentPage * pageSize, totalCount)}</span> of <span className="font-bold text-slate-900">{totalCount}</span> results
      </div>
      <div className="flex items-center gap-2">
        <Link 
          href={`${basePath}?page=${currentPage - 1}`}
          className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
        >
          <Button variant="outline" size="sm" className="rounded-xl font-bold border-slate-200 h-9">
            <IconChevronLeft size={16} className="mr-1" />
            Previous
          </Button>
        </Link>
        <div className="flex items-center gap-1">
          {currentPage > 2 && (
             <span className="text-slate-400 px-2">...</span>
          )}
          <Badge className="bg-green-600 text-white rounded-lg h-9 w-9 flex items-center justify-center font-bold">
             {currentPage}
          </Badge>
          {currentPage < totalPages && (
             <span className="text-slate-400 px-2">...</span>
          )}
        </div>
        <Link 
          href={`${basePath}?page=${currentPage + 1}`}
          className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
        >
          <Button variant="outline" size="sm" className="rounded-xl font-bold border-slate-200 h-9">
            Next
            <IconChevronRight size={16} className="ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
