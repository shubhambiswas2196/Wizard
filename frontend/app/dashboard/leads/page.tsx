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
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <LeadQuickView />
      
      <div className="space-y-1">
        <nav className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Projects</Link>
          <span>/</span>
          <Link href="/dashboard" className="hover:text-primary transition-colors">Wizard CRM</Link>
          <span>/</span>
          <span className="text-slate-900">Leads</span>
        </nav>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <h1 className="text-2xl font-semibold tracking-tight text-[#172B4D]">Leads</h1>
          <div className="flex items-center gap-2">
             <div className="text-[12px] font-medium text-slate-500 px-2 py-1 rounded bg-slate-100">
               {totalCount} leads
             </div>
             <CreateLeadDialog />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 py-2">
         <LeadsSearch />
         <Button variant="outline" size="sm" className="h-9 px-3 border-slate-300 font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
            <Filter size={14} className="mr-2 text-slate-500" />
            Filters
         </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-none overflow-hidden group">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#F4F5F7] border-b border-slate-200">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-bold py-3 pl-4 text-[#44546F] text-[12px] uppercase">Lead Name</TableHead>
                <TableHead className="font-bold py-3 text-[#44546F] text-[12px] uppercase">Company</TableHead>
                <TableHead className="font-bold py-3 text-[#44546F] text-[12px] uppercase">Location</TableHead>
                <TableHead className="font-bold py-3 text-[#44546F] text-[12px] uppercase">Email</TableHead>
                <TableHead className="font-bold py-3 text-[#44546F] text-[12px] uppercase text-center">Status</TableHead>
                <TableHead className="text-right font-bold py-3 pr-4 text-[#44546F] opacity-0">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead: any) => (
                <TableRow key={lead.id} className="group border-b border-slate-100 hover:bg-[#F4F5F7]/50 transition-colors">
                  <TableCell className="py-2 pl-4">
                     <Link href={getRowLink(lead.id)} scroll={false} className="block group/link">
                        <div className="text-[14px] font-medium text-[#0052CC] hover:underline transition-all cursor-pointer">
                           {lead.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">#{String(lead.id).slice(0, 8)}</div>
                     </Link>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="text-[13px] text-slate-700 font-medium capitalize">
                       {lead.company || "Individual"}
                    </div>
                  </TableCell>
                  <TableCell className="py-2 text-[13px] text-slate-600">
                    {lead.city && lead.country ? `${lead.city}, ${lead.country}` : lead.country || "—"}
                  </TableCell>
                  <TableCell className="py-2 text-[13px] text-slate-600">
                    {lead.email}
                  </TableCell>
                  <TableCell className="py-2 text-center">
                    <Badge 
                      className={cn(
                        "font-bold py-0.5 px-2 shadow-none border-none text-[10px] rounded-[3px] uppercase tracking-wide",
                        lead.status === 'NEW' ? "bg-slate-100 text-slate-600" : 
                        lead.status === 'CONTACTED' ? "bg-blue-100 text-blue-700" :
                        lead.status === 'QUALIFIED' ? "bg-green-100 text-green-700" : "bg-slate-50 text-slate-400"
                      )}
                    >
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right py-2 pr-4">
                     <Button variant="ghost" size="icon" className="h-7 w-7 rounded hover:bg-slate-200">
                        <MoreHorizontal size={14} className="text-slate-500" />
                     </Button>
                  </TableCell>
                </TableRow>
              ))}
              {leads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center py-20">
                     <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                        <Search size={40} strokeWidth={1} className="text-slate-200" />
                        <p className="font-medium text-sm text-slate-500">We couldn't find any leads matching your search.</p>
                     </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="p-3 border-t border-slate-100">
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
