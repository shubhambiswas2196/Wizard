import { proxyToDjango } from "@/lib/django";
import { redirect } from "next/navigation";
import { 
  IconUsers, 
  IconPlus, 
  IconFilter, 
  IconDots, 
  IconSearch, 
  IconSettings, 
  IconDownload,
  IconChevronDown,
  IconLayoutGrid,
  IconList
} from "@tabler/icons-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CreateLeadDialog } from "@/components/leads/create-lead-dialog";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { LeadQuickView } from "@/components/leads/lead-quick-view";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";

async function getLeads(page: number = 1, search: string = "") {
  try {
    let url = `/crm/api/leads/?page=${page}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    
    const response = await proxyToDjango(url);
    if (response.status === 401) redirect("/login");
    if (!response.ok) return { count: 0, results: [] };
    return response.json();
  } catch (err) {
    console.error("[LeadsPage] Failed to fetch leads:", err);
    return { count: 0, results: [] };
  }
}

export default async function LeadsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const search = typeof params.search === 'string' ? params.search : "";
  
  const data = await getLeads(currentPage, search);
  const leads = data.results || [];
  const totalCount = data.count || 0;

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <LeadQuickView />
      
      <div className="flex flex-col gap-1">
         <h1 className="text-xl font-black text-slate-900 px-4">Accounts</h1>
         <div className="flex items-center gap-6 border-b border-border px-4 pt-2">
            <button className="pb-3 border-b-2 border-primary text-primary font-black text-xs tracking-tight">
               My accounts <span className="ml-1 bg-primary/10 px-1.5 py-0.5 rounded text-[10px]">{totalCount}</span>
            </button>
            <button className="pb-3 text-slate-400 font-bold text-xs tracking-tight flex items-center gap-1 hover:text-slate-600 transition-colors">
               + 5 more...
               <span className="text-[10px] bg-slate-100 text-slate-400 px-1 py-0.5 rounded">Ctrl Q</span>
            </button>
            <div className="ml-auto flex items-center gap-4 pb-3">
               <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <IconSettings size={16} />
               </button>
               <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <IconDownload size={16} />
               </button>
               <CreateLeadDialog />
            </div>
         </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2">
         <div className="flex items-center gap-2">
            <div className="flex items-center border border-border rounded-lg bg-white px-3 h-9 shadow-sm">
               <IconList size={14} className="text-slate-400 mr-2" />
               <span className="text-xs font-bold text-slate-900 border-r border-border pr-3 mr-3">Table</span>
               <IconChevronDown size={14} className="text-slate-400" />
            </div>
            <Button variant="ghost" size="sm" className="h-9 font-bold text-slate-500 text-xs">
               <IconLayoutGrid size={14} className="mr-2" />
               Bulk actions
            </Button>
            <div className="h-4 w-[1px] bg-slate-200 mx-1" />
            <Button variant="ghost" size="sm" className="h-9 font-bold text-slate-500 text-xs">
               <IconFilter size={14} className="mr-2 text-primary" />
               1 filter applied
            </Button>
         </div>
      </div>

      <div className="bg-white border-t border-border group">
        <div className="overflow-x-auto">
          <table className="crm-table">
            <thead>
              <tr className="hover:bg-transparent">
                <th className="w-10 pl-4"><Checkbox className="border-slate-300 rounded-[4px]" /></th>
                <th className="pl-2">Name</th>
                <th>Related contacts</th>
                <th>Website</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Industry type</th>
                <th>Sales owner</th>
                <th className="pr-4 text-center"><IconPlus size={14} /></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead: any) => (
                <TableRow key={lead.id} className="group border-b border-border/50 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-4 py-3">
                     <Checkbox className="border-slate-300 rounded-[4px] data-[state=checked]:bg-primary" />
                  </TableCell>
                  <TableCell className="pl-2 py-3 font-bold text-primary hover:underline cursor-pointer">
                     <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-lg border border-slate-100 flex-shrink-0">
                           <AvatarFallback className={cn(
                              "text-white text-[10px] font-black rounded-lg",
                              lead.id % 2 === 0 ? "bg-cyan-500" : "bg-purple-500"
                           )}>
                              {lead.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                           </AvatarFallback>
                        </Avatar>
                        {lead.name}
                     </div>
                  </TableCell>
                  <TableCell className="py-3">
                     <div className="flex -space-x-2">
                        <Avatar className="h-6 w-6 border-2 border-white rounded-full">
                           <AvatarFallback className="bg-orange-100 text-orange-600 font-bold text-[8px]">JD</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-white rounded-full">
                           <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-[8px]">MK</AvatarFallback>
                        </Avatar>
                     </div>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-500 font-medium">{lead.website || "—"}</TableCell>
                  <TableCell className="py-3 text-xs text-slate-500 font-medium">{lead.phone || "—"}</TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className={cn(
                       "tag-badge",
                       lead.status === 'QUALIFIED' ? "high-value" : 
                       lead.status === 'LOST' ? "low-value" : "mid-market"
                    )}>
                      {lead.status === 'QUALIFIED' ? 'High-Value' : lead.status === 'LOST' ? 'Small Business' : 'Mid-Market'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-500 font-medium">Technology</TableCell>
                  <TableCell className="py-3">
                     <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 rounded-full">
                           <AvatarFallback className="bg-slate-100 text-slate-500 font-bold text-[8px]">SB</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-slate-700 font-bold">Shubham Biswas</span>
                     </div>
                  </TableCell>
                  <TableCell className="pr-4 py-3 text-right">
                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-200/50">
                        <IconDots size={14} className="text-slate-300" />
                     </Button>
                  </TableCell>
                </TableRow>
              ))}
              {leads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="h-64 text-center py-20 text-slate-400 font-medium italic">
                     No matching accounts found.
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex items-center justify-between bg-white/50">
           <PaginationControls 
             currentPage={currentPage}
             totalCount={totalCount}
             pageSize={25}
             basePath="/dashboard/leads"
           />
        </div>
      </div>
    </div>
  );
}

