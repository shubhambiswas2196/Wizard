"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export function LeadsSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const [value, setValue] = useState(searchParams.get("search") || "");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1"); // Reset to first page on search
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
    setIsSearching(false);
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setValue(term);
    setIsSearching(true);
    handleSearch(term);
  };

  const clearSearch = () => {
    setValue("");
    setIsSearching(true);
    handleSearch("");
  };

  return (
    <div className="relative w-full max-w-md group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors">
        {isSearching ? (
          <Loader2 size={18} className="animate-spin text-green-500" />
        ) : (
          <Search size={18} />
        )}
      </div>
      <Input
        type="text"
        placeholder="Real-time search across 1,000+ leads..."
        value={value}
        onChange={handleChange}
        className="h-12 pl-12 pr-10 border-slate-200 rounded-2xl focus:border-green-500 focus:ring-green-500/20 bg-white shadow-sm font-medium transition-all"
      />
      {value && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
