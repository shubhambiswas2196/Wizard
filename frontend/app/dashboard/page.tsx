import { redirect } from "next/navigation";
import { proxyToDjango } from "@/lib/django";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  Activity, 
  ArrowRight,
  Timer,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import Link from "next/link";

async function getSummaryData() {
  // Fetch both leads and deals to show real data in summary
  const [leadsRes, dealsRes] = await Promise.all([
    proxyToDjango("/crm/api/leads/"),
    proxyToDjango("/crm/api/deals/")
  ]);

  if (leadsRes.status === 401) redirect("/login");
  
  const leadsData = leadsRes.ok ? await leadsRes.json() : { count: 0, results: [] };
  const dealsData = dealsRes.ok ? await dealsRes.json() : { count: 0, results: [] };
  
  const leads = leadsData.results || [];
  const totalLeads = leadsData.count || 0;
  const qualifiedLeads = leads.filter((l: any) => l.status === 'QUALIFIED').length;
  const totalDeals = dealsData.count || 0;
  const leadGrowth = "+12.5%"; // Mock growth

  return { totalLeads, qualifiedLeads, leadGrowth, totalDeals, leads };
}

export default async function DashboardPage() {
  const data = await getSummaryData();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 font-bold mb-3 px-3 py-1 uppercase tracking-widest text-[10px]">
              Organization Overview
           </Badge>
           <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Performance Dashboard</h1>
           <p className="text-slate-500 mt-2 text-lg">Real-time insights across your sales and marketing operations.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-2xl h-12 px-6 border-slate-200 font-bold shadow-sm">
              Generate Report
           </Button>
           <Link href="/dashboard/leads">
              <Button className="rounded-2xl h-12 px-6 bg-green-600 hover:bg-green-700 font-bold shadow-lg shadow-green-600/20">
                 Manage CRM
              </Button>
           </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                <Users size={24} />
              </div>
              <Badge className="bg-green-100 text-green-700 border-0 font-bold">
                 <ArrowUpRight className="mr-1" size={12} />
                 {data.leadGrowth}
              </Badge>
            </div>
            <div className="mt-4">
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Leads</p>
               <h3 className="text-3xl font-bold text-slate-900 mt-1">{data.totalLeads}</h3>
               <p className="text-xs text-slate-400 mt-2">New leads added this period</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <TrendingUp size={24} />
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-0 font-bold">
                 Top 5%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Qualified Rate</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">
                 {data.totalLeads > 0 ? ((data.qualifiedLeads / data.totalLeads) * 100).toFixed(1) : 0}%
              </h3>
              <p className="text-xs text-slate-400 mt-2">Conversion from prospect to lead</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                <DollarSign size={24} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Projected Revenue</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">$142,500</h3>
              <div className="flex items-center gap-2 mt-2">
                 <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-purple-500 rounded-full" />
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                <Activity size={24} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Deals</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{data.totalDeals}</h3>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                 <Timer size={12} />
                 Avg. cycle: 14 days
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <AnalyticsCharts />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-slate-200 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6 flex flex-row items-center justify-between space-y-0">
            <div>
               <CardTitle className="text-lg font-bold text-slate-800">Recent Leads</CardTitle>
               <CardDescription>Latest prospecting activity in your organization</CardDescription>
            </div>
            <Link href="/dashboard/leads">
              <Button variant="ghost" size="sm" className="text-green-600 font-bold gap-1 rounded-xl">
                 View All
                 <ArrowRight size={14} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-slate-100">
                {data.leads.slice(0, 4).map((lead: any) => (
                   <div key={lead.id} className="flex items-center gap-4 p-5 hover:bg-slate-50/50 transition-colors">
                      <div className="h-10 w-10 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center shadow-sm font-bold">
                         {lead.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                         <p className="text-sm font-bold text-slate-900">{lead.name}</p>
                         <p className="text-xs text-slate-500">{lead.email}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 font-medium whitespace-nowrap">
                         {lead.status}
                      </Badge>
                   </div>
                ))}
                {data.leads.length === 0 && (
                   <div className="p-8 text-center text-slate-400 italic text-sm">
                      No leads found.
                   </div>
                )}
             </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-slate-900 border-0 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
             <Zap size={140} />
          </div>
          <CardHeader className="p-8 pb-0">
             <Badge className="w-fit bg-yellow-500 text-slate-900 mb-4 border-0 font-bold">PRO FEATURE</Badge>
             <CardTitle className="text-2xl font-bold">Sales Assistant AI</CardTitle>
             <CardDescription className="text-slate-400 mt-2">Get AI-generated summaries of your top deal opportunities and next best actions.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
             <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                   <div className="h-2 w-2 bg-green-500 rounded-full" />
                   Priority lead: Oracle Enterprise
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                   <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                   Action needed: Follow up with Sarah
                </div>
             </div>
             <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-2xl h-12 shadow-lg shadow-black/20">
                Unlock Insights
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
