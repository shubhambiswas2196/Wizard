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

  const calculateTotalValue = (stageDeals: any[]) => {
    return stageDeals.reduce((acc, deal) => acc + (parseFloat(deal.value) || 0), 0);
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 min-h-[600px] scrollbar-hide pt-2">
      {STAGES.map((stage) => {
        const stageDeals = getDealsByStage(stage.id);
        const totalValue = calculateTotalValue(stageDeals);

        return (
          <div key={stage.id} className="min-w-[280px] w-[280px] flex flex-col gap-3 bg-[#F4F5F7]/80 rounded p-2">
            <div className="flex flex-col gap-1 px-1 py-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-[12px] font-bold text-[#44546F] uppercase tracking-wider">
                    {stage.label}
                  </h3>
                  <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {stageDeals.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-2">
              {stageDeals.map((deal: any) => (
                <Link key={deal.id} href={`/dashboard/deals/${deal.id}`}>
                  <Card className="border-slate-200 shadow-sm hover:bg-[#F4F5F7] transition-all rounded-[3px] border-[1px] group">
                    <CardContent className="p-3">
                      <div className="space-y-3">
                         <div className="flex justify-between items-start">
                            <h4 className="text-[13px] font-medium text-[#172B4D] leading-snug group-hover:text-[#0052CC] transition-colors">{deal.name}</h4>
                         </div>
                         
                         <div className="flex items-center justify-between mt-auto pt-2">
                            <div className="flex flex-col">
                               <div className="text-[11px] font-bold text-[#44546F] uppercase tracking-tighter">
                                  #{String(deal.id).slice(0, 5)}
                               </div>
                               <div className="text-[12px] font-black text-[#172B4D]">${parseFloat(deal.value).toLocaleString()}</div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                               <div className={cn(
                                 "text-[10px] font-bold px-1.5 py-0.5 rounded-[3px]",
                                 deal.probability > 70 ? "bg-green-100 text-green-700" :
                                 deal.probability > 40 ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                               )}>
                                 {deal.probability}%
                               </div>
                               <div className="h-6 w-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600 border border-white">
                                  {deal.lead_name?.[0] || 'U'}
                               </div>
                            </div>
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              
              {stageDeals.length === 0 && (
                <div className="h-16 border-2 border-dashed border-slate-200 rounded flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/50">
                  NO DEALS
                </div>
              )}
              
              <button className="mt-2 w-full py-2 flex items-center justify-center gap-2 text-slate-500 hover:bg-slate-200/50 rounded transition-colors text-[12px] font-semibold">
                 <Plus size={14} />
                 Create
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
