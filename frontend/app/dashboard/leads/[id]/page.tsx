import { proxyToDjango } from "@/lib/django";
import { redirect, notFound } from "next/navigation";
import { 
  Users, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  Clock, 
  MessageSquare, 
  FileText,
  BadgeCent,
  ArrowLeft,
  Info,
  Layers,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";

async function getLead(id: string) {
  const response = await proxyToDjango(`/crm/api/leads/${id}/`);
  if (response.status === 401) redirect("/login");
  if (response.status === 404) return null;
  if (!response.ok) return null;
  return response.json();
}

async function getLeadDeals(leadId: string) {
  const response = await proxyToDjango(`/crm/api/deals/?lead=${leadId}`);
  if (!response.ok) return { results: [] };
  return response.json();
}

async function getCustomFieldDefinitions() {
  const response = await proxyToDjango("/crm/api/custom-fields/");
  if (!response.ok) return [];
  return response.json();
}

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  const dealsData = await getLeadDeals(id);
  const deals = dealsData.results || [];
  const fieldDefs = await getCustomFieldDefinitions();

  const renderCustomValue = (def: any) => {
    const value = lead.custom_fields?.[def.name];
    if (value === undefined || value === null || value === "") return <span className="text-slate-400 italic">Not set</span>;
    
    if (def.field_type === 'CHECKBOX') {
        return value ? <CheckCircle2 className="text-green-500" size={18} /> : <XCircle className="text-slate-300" size={18} />;
    }
    
    if (def.field_type === 'DATE') {
        return new Date(value).toLocaleDateString();
    }
    
    return String(value);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/leads">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{lead.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 font-bold px-3">
              {lead.status}
            </Badge>
            <span className="text-slate-400 text-sm flex items-center gap-1">
              <Clock size={14} />
              Created {new Date(lead.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-lg font-bold">Contact Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <div className="flex items-start gap-3">
                        <div className="h-9 w-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                           <Mail size={18} />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                           <p className="text-sm font-semibold text-slate-900 mt-0.5">{lead.email}</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <div className="h-9 w-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                           <Phone size={18} />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</p>
                           <p className="text-sm font-semibold text-slate-900 mt-0.5">{lead.phone || "Not provided"}</p>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <div className="flex items-start gap-3">
                        <div className="h-9 w-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                           <Building2 size={18} />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Associated Company</p>
                           <p className="text-sm font-semibold text-slate-900 mt-0.5">{lead.company || "Not provided"}</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <div className="h-9 w-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                           <Calendar size={18} />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lead Source</p>
                           <p className="text-sm font-semibold text-slate-900 mt-0.5 uppercase tracking-tighter">{lead.source}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>

          {fieldDefs.length > 0 && (
             <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6 flex flex-row items-center gap-3">
                   <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                      <Layers size={18} />
                   </div>
                   <div>
                      <CardTitle className="text-lg font-bold">Additional Attributes</CardTitle>
                      <CardDescription>Dynamic fields configured for your organization.</CardDescription>
                   </div>
                </CardHeader>
                <CardContent className="p-6">
                   <div className="grid md:grid-cols-3 gap-6">
                      {fieldDefs.map((def: any) => (
                         <div key={def.id} className="space-y-1">
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{def.label}</p>
                            <div className="text-sm font-bold text-slate-700">
                               {renderCustomValue(def)}
                            </div>
                         </div>
                      ))}
                   </div>
                </CardContent>
             </Card>
          )}

          <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">Activity Timeline</CardTitle>
              <Button size="sm" variant="outline" className="rounded-xl font-bold border-slate-200">
                 Add Note
              </Button>
            </CardHeader>
            <CardContent className="p-0">
               <div className="p-6 relative">
                  <div className="absolute left-9 top-8 bottom-8 w-px bg-slate-100" />
                  <div className="space-y-8">
                     {[
                        { title: 'Inquiry received', desc: 'Initial contact via web portal regarding enterprise licensing.', date: 'Dec 12, 11:20 AM', icon: FileText, color: 'blue' },
                        { title: 'Discovery call', desc: 'Discussed requirements for the wizard integration. Lead is highly interested.', date: 'Dec 14, 02:00 PM', icon: MessageSquare, color: 'green' },
                        { title: 'Deal created', desc: 'Revenue opportunity added to the pipeline.', date: 'Dec 15, 09:30 AM', icon: BadgeCent, color: 'purple' },
                     ].map((item, index) => (
                        <div key={index} className="flex gap-6 relative">
                           <div className={cn("h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center shadow-sm z-10", `bg-slate-50 text-slate-600`)}>
                              <item.icon size={18} />
                           </div>
                           <div className="flex-1 pb-4">
                              <p className="text-sm font-bold text-slate-900">{item.title}</p>
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">{item.date}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
           <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                 <CardTitle className="text-lg font-bold">Deal History</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                 <div className="space-y-4">
                    {deals.map((deal: any) => (
                       <div key={deal.id} className="p-4 rounded-2xl border border-slate-100 hover:border-green-100 hover:bg-green-50/10 transition-all flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                             <p className="text-sm font-bold text-slate-800">{deal.name}</p>
                             <Badge className="bg-green-100 text-green-700 border-0 font-bold text-[10px]">{deal.status}</Badge>
                          </div>
                          <p className="text-lg font-extrabold text-slate-900">${parseFloat(deal.value).toLocaleString()}</p>
                       </div>
                    ))}
                    {deals.length === 0 && (
                       <div className="text-center py-6">
                          <p className="text-sm text-slate-400 italic">No deals recorded.</p>
                       </div>
                    )}
                 </div>
                 <Button className="w-full mt-6 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold h-11">
                    Convert to Deal
                 </Button>
              </CardContent>
           </Card>

           <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-green-600 border-0 text-white">
              <CardContent className="p-6 text-center space-y-4">
                 <div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                    <Users size={24} className="text-white" />
                 </div>
                 <h3 className="font-bold text-xl">Quick Actions</h3>
                 <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white rounded-xl h-10 px-0">
                       Send Email
                    </Button>
                    <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white rounded-xl h-10 px-0">
                       Set Meeting
                    </Button>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
