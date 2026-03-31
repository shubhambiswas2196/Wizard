import { proxyToDjango } from "@/lib/django";
import { redirect, notFound } from "next/navigation";
import { 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  User, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Rocket
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";

async function getDeal(id: string) {
  const response = await proxyToDjango(`/crm/api/deals/${id}/`);
  if (response.status === 401) redirect("/login");
  if (response.status === 404) return null;
  if (!response.ok) return null;
  return response.json();
}

const STAGES = [
  { id: 'PROSPECTING', label: 'Prospecting' },
  { id: 'QUALIFICATION', label: 'Qualification' },
  { id: 'PROPOSAL', label: 'Proposal' },
  { id: 'NEGOTIATION', label: 'Negotiation' },
  { id: 'CLOSING', label: 'Closing' }
];

export default async function DealDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const deal = await getDeal(id);
  if (!deal) notFound();

  const currentStageIndex = STAGES.findIndex(s => s.id === deal.stage);
  const weightedValue = (parseFloat(deal.value) * (deal.probability / 100)).toLocaleString();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/deals">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
             <h1 className="text-3xl font-bold tracking-tight text-slate-900">{deal.name}</h1>
             <Badge className={cn(
               "rounded-full font-bold px-3", 
               deal.status === 'WON' ? "bg-green-500 text-white" : 
               deal.status === 'LOST' ? "bg-red-500 text-white" : "bg-slate-100 text-slate-600"
             )}>
                {deal.status}
             </Badge>
          </div>
          <p className="text-slate-500 mt-1 flex items-center gap-1 font-medium italic">
             Opportunity with <span className="text-slate-900 font-bold not-italic">{deal.lead_name}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-2xl border-slate-200 font-bold h-12 px-6 shadow-sm">
              Mark as Lost
           </Button>
           <Button className="rounded-2xl bg-green-600 hover:bg-green-700 font-bold h-12 px-6 shadow-lg shadow-green-600/20">
              Close Deal Won
           </Button>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden bg-slate-50/50">
         <CardContent className="p-10">
            <div className="flex justify-between items-center mb-8">
               <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Sales Journey Progress</p>
               <Badge className="bg-slate-900 text-white rounded-xl px-4 py-1 font-bold">
                  {STAGES[currentStageIndex]?.label || 'Prospecting'} Stage
               </Badge>
            </div>
            <div className="flex items-center gap-4">
               {STAGES.map((stage, idx) => (
                  <div key={idx} className="flex-1 flex flex-col gap-4">
                     <div className={cn(
                        "h-4 rounded-full transition-all duration-700 ease-in-out",
                        idx <= currentStageIndex ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]" : "bg-slate-200"
                     )} />
                     <span className={cn(
                        "text-[11px] font-black uppercase tracking-tighter text-center",
                        idx === currentStageIndex ? "text-green-600" : "text-slate-400"
                     )}>
                        {stage.label}
                     </span>
                  </div>
               ))}
            </div>
         </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-3">
         <div className="lg:col-span-2 space-y-8">
            <Card className="border-slate-100 shadow-sm rounded-[2rem] overflow-hidden border border-slate-200/60">
               <CardHeader className="bg-slate-50/30 border-b border-slate-100 p-8">
                  <CardTitle className="text-xl font-black text-slate-800">Financial Intelligence</CardTitle>
               </CardHeader>
               <CardContent className="p-10">
                  <div className="grid md:grid-cols-2 gap-12">
                     <div className="space-y-4">
                        <div className="space-y-1">
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Opportunity Value</p>
                           <h2 className="text-5xl font-black text-slate-900 tracking-tight">${parseFloat(deal.value).toLocaleString()}</h2>
                        </div>
                        <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center justify-between">
                           <div>
                              <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Weighted Forecast</p>
                              <p className="text-xl font-black text-green-900">${weightedValue}</p>
                           </div>
                           <TrendingUp size={24} className="text-green-500 opacity-50" />
                        </div>
                     </div>
                     <div className="grid gap-6">
                        <div className="flex items-center gap-4 group">
                           <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                              <Calendar size={22} />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Target Closing</p>
                              <p className="text-base font-bold text-slate-900">{deal.expected_close_date ? new Date(deal.expected_close_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible'}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4 group">
                           <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                              <User size={22} />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Relationship Owner</p>
                              <p className="text-base font-bold text-slate-900">Portfolio Manager</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm rounded-[2rem] overflow-hidden border border-slate-200/60">
               <CardHeader className="bg-slate-50/30 border-b border-slate-100 p-8">
                  <CardTitle className="text-xl font-black text-slate-800">Pipeline Probability</CardTitle>
               </CardHeader>
               <CardContent className="p-10">
                  <div className="flex items-center gap-10">
                     <div className="h-28 w-28 rounded-full border-[10px] border-slate-100 flex items-center justify-center relative shadow-inner">
                        <div className="absolute inset-[-10px] rounded-full border-[10px] border-green-500 border-t-transparent transition-all duration-1000" style={{ transform: `rotate(${(deal.probability * 3.6) - 90}deg)` }} />
                        <span className="text-3xl font-black text-slate-900">{deal.probability}%</span>
                     </div>
                     <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-end">
                           <div>
                              <span className="font-extrabold text-slate-800 text-lg">Confidence Score</span>
                              <p className="text-xs text-slate-500 font-medium mt-1">Probability based on current deal stage and momentum.</p>
                           </div>
                           <Badge className="bg-green-100 text-green-700 font-black border-0 px-3">High Intent</Badge>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-green-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(34,197,94,0.5)]" style={{ width: `${deal.probability}%` }} />
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         <div className="space-y-8">
            <Card className="border-slate-200 shadow-xl rounded-[2.5rem] overflow-hidden bg-slate-900 text-white border-0 ring-4 ring-green-500/10">
               <CardHeader className="p-8">
                  <div className="flex items-center gap-2 mb-2 text-green-400">
                     <Rocket size={20} />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em]">Strategy Assistant</span>
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight">Optimal Next Step</CardTitle>
               </CardHeader>
               <CardContent className="p-8 pt-0 space-y-6">
                  <div className="bg-white/5 rounded-3xl p-6 border border-white/10 backdrop-blur-md">
                     <p className="text-sm font-medium leading-relaxed italic text-slate-300">"The current {STAGES[currentStageIndex]?.label} stage suggests a formal proposal presentation to clear the bottleneck."</p>
                  </div>
                  <Button className="w-full bg-green-500 hover:bg-green-400 text-slate-900 font-black rounded-[1.2rem] h-14 tracking-tighter text-lg shadow-lg shadow-green-500/20 active:scale-95 transition-all">
                     ACTIVATE SEQUENCE
                  </Button>
               </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm rounded-[2rem] overflow-hidden border border-slate-200/60">
               <CardHeader className="bg-slate-50/10 p-6">
                  <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Velocity Metrics</CardTitle>
               </CardHeader>
               <CardContent className="p-8 pt-2 space-y-6">
                  <div className="flex justify-between items-center group">
                     <span className="text-sm text-slate-500 font-bold group-hover:text-slate-900 transition-colors">Cycle Age</span>
                     <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">18 Days</span>
                  </div>
                  <Separator className="bg-slate-100/50" />
                  <div className="flex justify-between items-center group">
                     <span className="text-sm text-slate-500 font-bold group-hover:text-slate-900 transition-colors">Risk Level</span>
                     <Badge className="bg-blue-50 text-blue-700 font-black text-[10px] tracking-widest border-0">MINIMAL</Badge>
                  </div>
                  <Separator className="bg-slate-100/50" />
                  <div className="flex justify-between items-center group">
                     <span className="text-sm text-slate-500 font-bold group-hover:text-slate-900 transition-colors">Compelling Event</span>
                     <CheckCircle2 className="text-green-500" size={18} />
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
