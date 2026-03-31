import { redirect } from "next/navigation";
import { proxyToDjango } from "@/lib/django";
import { 
  IconUsers, 
  IconTrendingUp, 
  IconCurrencyDollar, 
  IconArrowUpRight, 
  IconActivity, 
  IconArrowRight,
  IconTrendingDown,
  IconMonitor
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

async function getSummaryData() {
  try {
    const [leadsRes, dealsRes] = await Promise.all([
      proxyToDjango("/crm/api/leads/"),
      proxyToDjango("/crm/api/deals/")
    ]);

    if (leadsRes.status === 401) redirect("/login");
    
    const leadsText = await leadsRes.text();
    const dealsText = await dealsRes.text();
    
    let leadsData = { count: 0, results: [] };
    let dealsData = { count: 0, results: [] };
    
    try { leadsData = leadsRes.ok ? JSON.parse(leadsText) : leadsData; } catch { console.error("Malformed Leads JSON"); }
    try { dealsData = dealsRes.ok ? JSON.parse(dealsText) : dealsData; } catch { console.error("Malformed Deals JSON"); }
    
    const leads = leadsData.results || [];
    const totalLeads = leadsData.count || 0;
    const qualifiedLeads = leads.filter((l: any) => l.status === 'QUALIFIED').length;
    const totalDeals = dealsData.count || 0;

    return { totalLeads, qualifiedLeads, totalDeals, leads };
  } catch (err) {
    console.error("[Dashboard] Failed to fetch summary data:", err);
    return { totalLeads: 0, qualifiedLeads: 0, totalDeals: 0, leads: [] };
  }
}

export default async function DashboardPage() {
  const data = await getSummaryData();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black tracking-tight text-slate-900">Activities</h1>
           <p className="text-slate-500 mt-1 font-medium text-sm">Welcome back. Here&apos;s what&apos;s happening in your organization today.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl h-10 px-6 border-slate-200 font-bold text-slate-600 bg-white">
              Customize dashboard
           </Button>
           <Button className="rounded-xl h-10 px-6 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20">
              New lead
           </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Leads", value: data.totalLeads, icon: IconUsers, color: "bg-blue-50 text-blue-600", trend: "+12%", trendIcon: IconArrowUpRight },
          { title: "Qualified Rate", value: `${data.totalLeads > 0 ? ((data.qualifiedLeads / data.totalLeads) * 100).toFixed(1) : 0}%`, icon: IconMonitor, color: "bg-green-50 text-green-600", trend: "Top 5%", trendIcon: IconTrendingUp },
          { title: "Open Deals", value: data.totalDeals, icon: IconActivity, color: "bg-purple-50 text-purple-600", trend: "-2%", trendIcon: IconTrendingDown },
          { title: "Revenue", value: "$42.5k", icon: IconCurrencyDollar, color: "bg-orange-50 text-orange-600", trend: "+8%", trendIcon: IconArrowUpRight },
        ].map((stat, i) => (
          <Card key={i} className="border-border shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={stat.color + " h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"}>
                  <stat.icon size={20} />
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {stat.trend}
                      <stat.trendIcon size={12} />
                   </div>
                </div>
              </div>
              <div className="mt-4">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.title}</p>
                 <h3 className="text-2xl font-black text-slate-900 mt-2">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AnalyticsCharts />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0 border-b border-border">
            <div>
               <CardTitle className="text-lg font-black text-slate-900">Recent Leads</CardTitle>
               <CardDescription className="text-slate-400 font-medium">Latest prospecting activity</CardDescription>
            </div>
            <Link href="/dashboard/leads">
               <Button variant="ghost" size="sm" className="text-primary font-bold gap-1 rounded-lg">
                  See all
                  <IconArrowRight size={14} />
               </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
             <table className="crm-table">
                <thead>
                   <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Source</th>
                   </tr>
                </thead>
                <tbody>
                   {data.leads.slice(0, 5).map((lead: any) => (
                      <tr key={lead.id}>
                         <td>
                            <div className="flex items-center gap-3">
                               <Avatar className="h-8 w-8 rounded-lg border border-slate-100">
                                  <AvatarFallback className="bg-slate-50 text-slate-500 font-bold bg-gradient-to-br from-slate-50 to-slate-100">
                                     {lead.name.charAt(0)}
                                  </AvatarFallback>
                               </Avatar>
                               <div className="flex flex-col">
                                  <span className="font-bold text-slate-900">{lead.name}</span>
                                  <span className="text-[10px] text-slate-400 font-medium">{lead.email}</span>
                               </div>
                            </div>
                         </td>
                         <td>
                            <Badge variant="outline" className="tag-badge enterprise">
                               {lead.status}
                            </Badge>
                         </td>
                         <td>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{lead.source}</span>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
             {data.leads.length === 0 && (
                <div className="p-12 text-center text-slate-401 italic text-sm">
                   No lead data available yet.
                </div>
             )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm rounded-2xl overflow-hidden bg-[#172B4D] border-none text-white relative">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
           <CardHeader className="p-8">
              <Badge className="w-fit bg-yellow-400 text-slate-900 mb-4 border-0 font-black text-[10px] tracking-widest px-2.5 py-1">PRO FEATURES</Badge>
              <CardTitle className="text-2xl font-black">Sales Assistant</CardTitle>
              <CardDescription className="text-slate-400 font-medium mt-2 leading-relaxed">
                 Leverage AI to prioritize your deals and generate personalized follow-up messages.
              </CardDescription>
           </CardHeader>
           <CardContent className="p-8 pt-0">
              <div className="space-y-4 mb-8">
                 {[
                    { label: "Action required: Oracle deal", color: "bg-yellow-400" },
                    { label: "Hot lead: Tesla Enterprises", color: "bg-green-400" },
                    { label: "Nurture: Microsoft Corp", color: "bg-blue-400" }
                 ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-200">
                       <div className={item.color + " h-2 w-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]"} />
                       {item.label}
                    </div>
                 ))}
              </div>
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl h-11 transition-all active:scale-[0.98]">
                 Try Assistant
              </Button>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}

