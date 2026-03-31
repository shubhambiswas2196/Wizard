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
  Mail, Phone, Building2, Calendar, Clock, 
  MapPin, Loader2, Edit, Trash2, Globe
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          </div>
        ) : lead ? (
          <div className="flex-1 overflow-y-auto flex flex-col relative">
            <SheetHeader className="p-8 pb-6 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-xl pr-14">
              <div className="flex items-start justify-between">
                <div>
                  <SheetTitle className="text-2xl font-black text-slate-900 pr-2">{lead.name}</SheetTitle>
                  <SheetDescription className="sr-only">
                    Profile details and information for {lead.name}.
                  </SheetDescription>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="bg-white text-slate-600 font-bold border-slate-200">
                      {lead.status}
                    </Badge>
                    <span className="text-slate-400 font-medium text-sm flex items-center gap-1">
                      <Clock size={12} />
                      Created {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </SheetHeader>
            
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Information</h4>
                <div className="bg-slate-50 rounded-3xl p-6 space-y-4 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-500">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                      <p className="font-semibold text-slate-900">{lead.email}</p>
                    </div>
                  </div>
                  <Separator className="bg-slate-200/60" />
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-500">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</p>
                      <p className="font-semibold text-slate-900">{lead.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Professional Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex flex-col gap-2">
                    <Building2 size={16} className="text-slate-400" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company</p>
                      <p className="font-semibold text-slate-900">{lead.company || "Individual"}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex flex-col gap-2">
                    <Calendar size={16} className="text-slate-400" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source</p>
                      <p className="font-semibold text-slate-900">{lead.source}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex flex-col gap-2 col-span-2">
                    <MapPin size={16} className="text-slate-400" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</p>
                      <p className="font-semibold text-slate-900">
                        {lead.city && lead.country ? `${lead.city}, ${lead.country}` : lead.country || "Global"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {Object.keys(lead.custom_fields || {}).length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Custom Attributes</h4>
                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
                    {Object.entries(lead.custom_fields).map(([key, value]) => (
                      <div key={key} className="flex flex-col gap-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{key.replace(/_/g, ' ')}</p>
                        <p className="font-semibold text-slate-900">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 mt-auto bg-slate-50/50 border-t border-slate-100 flex gap-4">
               <Button className="flex-1 rounded-2xl h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-black/10">
                 Convert to Deal
               </Button>
               <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-slate-200">
                 <Edit size={16} className="mr-2" />
                 Edit Profile
               </Button>
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
