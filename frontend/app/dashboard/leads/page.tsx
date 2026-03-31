import { proxyToDjango } from "@/lib/django";
import { redirect } from "next/navigation";
import { Users, Plus, Filter, MoreHorizontal, Mail, Phone, Globe, MapPin, Search } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CreateLeadDialog } from "@/components/leads/create-lead-dialog";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { LeadsSearch } from "@/components/leads/leads-search";
import { LeadQuickView } from "@/components/leads/lead-quick-view";

async function getLeads(page: number = 1, search: string = "") {
  let url = `/crm/api/leads/?page=${page}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  
  const response = await proxyToDjango(url);
  if (response.status === 401) redirect("/login");
  if (!response.ok) return { count: 0, results: [] };
  return response.json();
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

  // We convert params to string dict for URLSearchParams
  const currentParamsDict: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) currentParamsDict[k] = String(v);
  }

  const getRowLink = (id: string) => {
    const sp = new URLSearchParams(currentParamsDict);
    sp.set("leadId", id);
    return `?${sp.toString()}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 relative">
      <LeadQuickView />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 font-medium mb-2 px-3 tracking-wide uppercase text-[10px]">
              CRM Core
           </Badge>
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Lead Management</h1>
           <p className="text-slate-500 mt-1">Manage, capture and nurture your prospecting pipeline.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-sm font-medium text-slate-500 bg-slate-100/50 px-4 py-2 rounded-2xl border border-slate-200">
             {totalCount.toLocaleString()} Prospect Records
           </div>
           <CreateLeadDialog />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50 p-4 rounded-[2rem] border border-slate-100">
         <LeadsSearch />
         <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-xl h-10 border-slate-200 font-bold px-4 hover:bg-white transition-all">
               <Filter size={16} className="mr-2 text-slate-400" />
               Advanced Filters
            </Button>
            <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:block">Displaying {leads.length} of {totalCount}</p>
         </div>
      </div>

      <div className="bg-white border rounded-[2.5rem] shadow-sm border-slate-200 overflow-hidden relative group">
        <div className="overflow-x-auto scrollbar-hide">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-[200px] font-bold py-5 pl-8">Full Name</TableHead>
                <TableHead className="font-bold py-5">Company & Website</TableHead>
                <TableHead className="font-bold py-5">Location</TableHead>
                <TableHead className="font-bold py-5">Contact</TableHead>
                <TableHead className="font-bold py-5">Status</TableHead>
                <TableHead className="text-right font-bold py-5 pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead: any) => (
                <TableRow key={lead.id} className="group hover:bg-slate-50/30 transition-colors">
                  <TableCell className="py-5 pl-8">
                     <Link href={getRowLink(lead.id)} scroll={false} className="block group/link">
                        <div className="font-bold text-slate-900 group-hover/link:text-green-600 transition-colors">{lead.name}</div>
                        <div className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tight">{lead.assigned_to || "Unassigned"}</div>
                     </Link>
                  </TableCell>
                  <TableCell className="py-5">
                    <div className="space-y-1">
                       <div className="text-sm font-bold text-slate-700 flex items-center gap-1.5 capitalize">
                          {lead.company || "Individual"}
                       </div>
                       {lead.website && (
                         <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            <Globe size={10} className="text-green-400" />
                            {lead.website.replace(/^https?:\/\//, '')}
                         </div>
                       )}
                    </div>
                  </TableCell>
                  <TableCell className="py-5">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium text-xs">
                       <MapPin size={12} className="text-slate-300" />
                       {lead.city && lead.country ? `${lead.city}, ${lead.country}` : lead.country || "Global"}
                    </div>
                  </TableCell>
                  <TableCell className="py-5">
                     <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 group/icon transition-all">
                           <div className="h-6 w-6 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover/icon:bg-green-100 group-hover/icon:text-green-600">
                              <Mail size={12} />
                           </div>
                           <span className="text-[10px] font-bold text-slate-600 truncate max-w-[120px]">{lead.email}</span>
                        </div>
                     </div>
                  </TableCell>
                  <TableCell className="py-5">
                    <Badge variant="outline" 
                      className={cn(
                        "font-bold py-1 px-3 shadow-none border-0 text-[10px] tracking-tight",
                        lead.status === 'NEW' ? "bg-blue-50 text-blue-600" : 
                        lead.status === 'CONTACTED' ? "bg-amber-50 text-amber-600" :
                        lead.status === 'QUALIFIED' ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right py-5 pr-8">
                     <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-slate-50 hover:bg-slate-100">
                        <MoreHorizontal size={18} className="text-slate-400" />
                     </Button>
                  </TableCell>
                </TableRow>
              ))}
              {leads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center py-10">
                     <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center border border-dashed border-slate-200 mb-2">
                           <Search size={32} strokeWidth={1} />
                        </div>
                        <p className="font-bold text-sm">No leads match your search criteria.</p>
                        <p className="text-xs">Try adjusting your filters or search terms.</p>
                     </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <PaginationControls 
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={25}
          basePath="/dashboard/leads"
        />
      </div>
    </div>
  );
}
