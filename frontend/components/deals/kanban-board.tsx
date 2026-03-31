"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MoreHorizontal, Plus, DollarSign, Target, Calendar } from "lucide-react";
import Link from "next/link";

const STAGES = [
  { id: 'PROSPECTING', label: 'Prospecting', color: 'slate' },
  { id: 'QUALIFICATION', label: 'Qualification', color: 'blue' },
  { id: 'PROPOSAL', label: 'Proposal', color: 'purple' },
  { id: 'NEGOTIATION', label: 'Negotiation', color: 'orange' },
  { id: 'CLOSING', label: 'Closing', color: 'green' },
];

export function KanbanBoard({ deals }: { deals: any[] }) {
  const getDealsByStage = (stageId: string) => {
    return deals.filter((deal: any) => deal.stage === stageId);
  };

  const calculateWeightedRevenue = (stageDeals: any[]) => {
    return stageDeals.reduce((acc, deal) => {
      const val = parseFloat(deal.value) || 0;
      const prob = (deal.probability || 0) / 100;
      return acc + (val * prob);
    }, 0);
  };

  const calculateTotalValue = (stageDeals: any[]) => {
    return stageDeals.reduce((acc, deal) => acc + (parseFloat(deal.value) || 0), 0);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-8 min-h-[600px] scrollbar-hide pt-4">
      {STAGES.map((stage) => {
        const stageDeals = getDealsByStage(stage.id);
        const totalValue = calculateTotalValue(stageDeals);
        const weightedRevenue = calculateWeightedRevenue(stageDeals);

        return (
          <div key={stage.id} className="min-w-[300px] w-[300px] flex flex-col gap-4">
            <div className="flex flex-col gap-2 px-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn(
                    "font-bold uppercase tracking-tight text-[10px] px-2",
                    stage.id === 'PROSPECTING' && "bg-slate-50 text-slate-600 border-slate-200",
                    stage.id === 'QUALIFICATION' && "bg-blue-50 text-blue-600 border-blue-200",
                    stage.id === 'PROPOSAL' && "bg-purple-50 text-purple-600 border-purple-200",
                    stage.id === 'NEGOTIATION' && "bg-orange-50 text-orange-600 border-orange-200",
                    stage.id === 'CLOSING' && "bg-green-50 text-green-600 border-green-200",
                  )}>
                    {stage.label}
                  </Badge>
                  <span className="text-xs font-bold text-slate-400">{stageDeals.length}</span>
                </div>
                <button className="h-6 w-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400">
                  <Plus size={14} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Forecast</div>
                <div className="text-sm font-black text-slate-900">${weightedRevenue.toLocaleString()}</div>
              </div>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className={cn(
                   "h-full rounded-full bg-slate-400 transition-all duration-1000",
                   stage.id === 'QUALIFICATION' && "bg-blue-400",
                   stage.id === 'PROPOSAL' && "bg-purple-400",
                   stage.id === 'NEGOTIATION' && "bg-orange-400",
                   stage.id === 'CLOSING' && "bg-green-400",
                )} style={{ width: `${(weightedRevenue / (totalValue || 1)) * 100}%` }} />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              {stageDeals.map((deal: any) => (
                <Link key={deal.id} href={`/dashboard/deals/${deal.id}`}>
                  <Card className="border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all overflow-hidden group">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                         <h4 className="font-bold text-slate-900 text-sm group-hover:text-green-600 transition-colors line-clamp-1">{deal.name}</h4>
                         <button className="h-6 w-6 rounded-md hover:bg-slate-50 flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal size={14} />
                         </button>
                      </div>
                      
                      <div className="text-[11px] font-medium text-slate-400 mb-4">{deal.lead_name}</div>
                      
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm">
                            <DollarSign size={14} className="text-slate-400" />
                            {parseFloat(deal.value).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1.5 text-green-600 font-bold text-[10px] bg-green-50 px-2 py-0.5 rounded-full">
                            <Target size={12} />
                            {deal.probability}%
                          </div>
                        </div>

                        <Separator className="bg-slate-100" />
                        
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                           <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              {deal.expected_close_date ? new Date(deal.expected_close_date).toLocaleDateString() : 'NO DATE'}
                           </div>
                           <Badge variant="secondary" className="h-4 px-1.5 text-[9px] bg-slate-100 text-slate-500 font-bold border-0">
                              {deal.status}
                           </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              
              {stageDeals.length === 0 && (
                <div className="h-24 border-2 border-dashed border-slate-100 rounded-3xl flex items-center justify-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  EMPTY STAGE
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
