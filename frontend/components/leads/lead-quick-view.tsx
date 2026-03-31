"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { 
  IconMail, IconPhone, IconBuilding2, IconCalendar, IconClock, 
  IconMapPin, IconLoader2, IconEdit, IconTrash, IconGlobe
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function LeadQuickView() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const leadId = searchParams.get("leadId");
  const isOpen = !!leadId;
  
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (leadId) {
      setLoading(true);
      fetch(`/api/crm/leads/${leadId}/`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          setLead(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLead(null);
    }
  }, [leadId]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      const params = new URLSearchParams(searchParams);
      params.delete("leadId");
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-md lg:max-w-2xl p-0 flex flex-col sm:max-w-xl">
        {loading ? (
          <div className="flex h-full flex-col items-center justify-center bg-slate-50/50">
            <SheetTitle className="sr-only">Loading lead details...</SheetTitle>
            <IconLoader2 className="h-8 w-8 animate-spin text-green-500" />
          </div>
        ) : lead ? (
          <div className="flex-1 overflow-y-auto flex flex-col relative bg-white">
            <SheetHeader className="p-6 pb-4 border-b border-slate-200 bg-[#F4F5F7] sticky top-0 z-10 pr-14">
              <div className="flex flex-col gap-1">
                <nav className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>Leads</span>
                  <span>/</span>
                  <span>#{String(lead.id).slice(0, 8)}</span>
                </nav>
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle className="text-xl font-semibold text-[#172B4D] pr-2 mt-1">{lead.name}</SheetTitle>
                    <SheetDescription className="sr-only">
                      Profile details and information for {lead.name}.
                    </SheetDescription>
                  </div>
                </div>
              </div>
            </SheetHeader>
            
            <div className="flex flex-col lg:flex-row flex-1">
              <div className="flex-1 p-6 space-y-6 border-r border-slate-100">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" className="h-8 rounded-[3px] bg-slate-200 hover:bg-slate-300 text-[#172B4D] font-bold text-[12px]">
                      <IconEdit size={14} className="mr-2" />
                      Edit
                    </Button>
                    <Button variant="secondary" size="sm" className="h-8 rounded-[3px] bg-slate-200 hover:bg-slate-300 text-[#172B4D] font-bold text-[12px]">
                      Convert to Deal
                    </Button>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-[14px] font-bold text-[#172B4D] mb-2">Description</h4>
                    <p className="text-[14px] text-slate-600 leading-relaxed">
                      Lead captured from {lead.source} on {new Date(lead.created_at).toLocaleDateString()}. 
                      Currently residing in {lead.city || 'an unspecified location'}, {lead.country || 'Global'}.
                    </p>
                  </div>

                  <div className="pt-6">
                    <h4 className="text-[14px] font-bold text-[#172B4D] mb-4">Contact Information</h4>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="flex flex-col gap-1">
                        <label className="text-[12px] font-bold text-[#44546F]">Email</label>
                        <div className="text-[14px] text-[#0052CC] hover:underline cursor-pointer font-medium">{lead.email}</div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[12px] font-bold text-[#44546F]">Phone</label>
                        <div className="text-[14px] text-[#172B4D] font-medium">{lead.phone || "None"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-72 bg-slate-50/50 p-6 space-y-8">
                <div className="space-y-6">
                  <h4 className="text-[12px] font-bold text-[#44546F] uppercase tracking-wider">Details</h4>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-[#44546F]">Status</label>
                      <Badge 
                        className={cn(
                          "w-fit font-bold py-1 px-2 shadow-none border-none text-[11px] rounded-[3px] uppercase",
                          lead.status === 'NEW' ? "bg-slate-200 text-slate-700" : 
                          lead.status === 'CONTACTED' ? "bg-blue-100 text-blue-700" :
                          lead.status === 'QUALIFIED' ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                        )}
                      >
                        {lead.status}
                      </Badge>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-[#44546F]">Company</label>
                      <div className="text-[13px] text-[#172B4D] font-semibold">{lead.company || "Individual"}</div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-[#44546F]">Source</label>
                      <div className="text-[13px] text-[#172B4D] font-semibold">{lead.source}</div>
                    </div>

                    {Object.entries(lead.custom_fields || {}).map(([key, value]) => (
                      <div key={key} className="flex flex-col gap-1">
                        <label className="text-[12px] font-bold text-[#44546F] capitalize">{key.replace(/_/g, ' ')}</label>
                        <div className="text-[13px] text-[#172B4D] font-semibold">{String(value)}</div>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-slate-200" />

                  <div className="text-[11px] text-slate-400 font-medium space-y-1">
                    <div>Created {new Date(lead.created_at).toLocaleString()}</div>
                    <div>Updated {new Date(lead.updated_at || lead.created_at).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center text-slate-500 font-medium">
            <SheetTitle className="sr-only">Lead Not Found</SheetTitle>
            Lead not found or has been deleted.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
