import { proxyToDjango } from "@/lib/django";
import { redirect } from "next/navigation";
import { 
  IconBriefcase, 
  IconPlus, 
  IconTrendingUp, 
  IconChartBar, 
  IconFilter, 
  IconDots, 
  IconCurrencyDollar, 
  IconCircleCheck, 
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CreateDealDialog } from "@/components/deals/create-deal-dialog";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { KanbanBoard } from "@/components/deals/kanban-board";

async function getDeals(page: number = 1) {
  try {
    const response = await proxyToDjango(`/crm/api/deals/?page=${page}`);
    if (response.status === 401) redirect("/login");
    if (!response.ok) return { count: 0, results: [], total_value: 0, avg_value: 0 };
    return response.json();
  } catch (err) {
    console.error("[DealsPage] Failed to fetch deals data:", err);
    return { count: 0, results: [], total_value: 0, avg_value: 0 };
  }
}

export default async function DealsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const data = await getDeals(currentPage);
  const deals = data.results || [];
  const totalCount = data.count || 0;
  
  const totalValue = deals.reduce((acc: number, deal: any) => acc + parseFloat(deal.value), 0);
  const avgValue = deals.length > 0 ? totalValue / deals.length : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-1">
        <nav className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Projects</Link>
          <span>/</span>
          <Link href="/dashboard" className="hover:text-primary transition-colors">Wizard CRM</Link>
          <span>/</span>
          <span className="text-slate-900">Deals</span>
        </nav>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <h1 className="text-2xl font-semibold tracking-tight text-[#172B4D]">Deals Board</h1>
          <div className="flex items-center gap-3">
             <div className="text-[12px] font-medium text-slate-500 px-2 py-1 rounded bg-slate-100 uppercase tracking-tight">
               {deals.length} deals in pipeline
             </div>
             <CreateDealDialog />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-slate-100 shadow-sm overflow-hidden border-l-4 border-l-green-500 rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pipeline Value</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">${totalValue.toLocaleString()}</div>
            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tight">Active Page Totals</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg Deal Size</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">${avgValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-700 border-blue-100 font-bold border-0">
               Healthy Velocity
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm bg-slate-900 border-0 rounded-3xl text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Conversion</CardTitle>
            <IconBriefcase className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black italic">Scalable</div>
            <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-tight">Optimized Workflow</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pipeline" className="w-full">
        <div className="flex items-center justify-between mb-6">
           <TabsList className="bg-slate-100 p-1 rounded-2xl h-12 border border-slate-200 shadow-sm">
             <TabsTrigger value="pipeline" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-md font-bold flex gap-2">
                <IconLayoutGrid size={18} />
                Pipeline View
             </TabsTrigger>
             <TabsTrigger value="list" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-md font-bold flex gap-2">
                <IconList size={18} />
                List View
             </TabsTrigger>
           </TabsList>
        </div>

        <TabsContent value="pipeline" className="mt-0 ring-offset-0 focus-visible:ring-0">
           <KanbanBoard deals={deals} />
        </TabsContent>

        <TabsContent value="list" className="mt-0 ring-offset-0 focus-visible:ring-0">
          <div className="bg-white border rounded-3xl shadow-sm border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-[250px] font-bold py-4 pl-6">Opportunity Name</TableHead>
                  <TableHead className="font-bold py-4">Lead</TableHead>
                  <TableHead className="font-bold py-4 text-center">Stage</TableHead>
                  <TableHead className="font-bold py-4">Value</TableHead>
                  <TableHead className="font-bold py-4">Probability</TableHead>
                  <TableHead className="text-right font-bold py-4 pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map((deal: any) => (
                  <TableRow key={deal.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="py-4 pl-6">
                       <Link href={`/dashboard/deals/${deal.id}`} className="block group/link">
                          <div className="font-bold text-slate-900 group-hover/link:text-green-600 transition-colors">{deal.name}</div>
                           <div className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-tight">Enterprise licensing</div>
                       </Link>
                    </TableCell>
                    <TableCell className="py-4 text-slate-600 font-semibold">{deal.lead_name}</TableCell>
                    <TableCell className="py-4 text-center">
                       <Badge variant="outline" className="bg-slate-100 text-slate-600 border-0 font-bold text-[10px]">
                          {deal.stage}
                       </Badge>
                    </TableCell>
                    <TableCell className="py-4 font-black text-slate-900">
                       ${parseFloat(deal.value).toLocaleString()}
                    </TableCell>
                    <TableCell className="py-4">
                       <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-green-500 rounded-full" style={{ width: `${deal.probability}%` }} />
                          </div>
                          <span className="text-xs font-black text-slate-600">{deal.probability}%</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-right py-4 pr-6">
                      <Badge variant="outline" 
                        className={cn(
                          "font-bold py-1 px-3 shadow-none border-0",
                          deal.status === 'WON' ? "bg-green-500 text-white" : "bg-slate-100 text-slate-600"
                        )}
                      >
                        {deal.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <PaginationControls 
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={25}
              basePath="/dashboard/deals"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
