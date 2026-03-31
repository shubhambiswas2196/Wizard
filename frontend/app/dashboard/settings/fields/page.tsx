import { proxyToDjango } from "@/lib/django";
import { redirect } from "next/navigation";
import { 
  IconPlus,
  IconSettings, 
  IconTypography, 
  IconHash, 
  IconCalendar, 
  IconCheckbox, 
  IconTrash,
  IconAlertCircle
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CreateFieldDialog } from "@/components/settings/create-field-dialog";
import { cn } from "@/lib/utils";

async function getFieldDefinitions() {
  const response = await proxyToDjango("/crm/api/custom-fields/");
  if (response.status === 401) redirect("/login");
  if (!response.ok) return { count: 0, results: [] };
  return response.json();
}

export default async function CustomFieldsSettingsPage() {
  const data = await getFieldDefinitions();
  const fields = data.results || [];
  const totalCount = data.count || 0;

  const getIcon = (type: string) => {
    switch (type) {
      case 'TEXT': return <IconTypography size={16} />;
      case 'NUMBER': return <IconHash size={16} />;
      case 'DATE': return <IconCalendar size={16} />;
      case 'CHECKBOX': return <IconCheckbox size={16} />;
      default: return <IconSettings size={16} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-100 font-bold mb-2 px-3 uppercase tracking-widest text-[10px]">
              CRM Configuration
           </Badge>
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Custom Dynamic Fields</h1>
           <p className="text-slate-500 mt-1">Extend your Lead and Deal records with personalized data points.</p>
        </div>
        <CreateFieldDialog />
      </div>

      <div className="grid gap-6">
        <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6 flex flex-row items-center justify-between">
            <div>
               <CardTitle className="text-lg font-bold">Active Fields</CardTitle>
               <CardDescription>These fields will appear in your creation forms and detail views.</CardDescription>
            </div>
            <div className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border">
               {totalCount} Custom Fields
            </div>
          </CardHeader>
          <CardContent className="p-0">
             <Table>
                <TableHeader className="bg-slate-50/30">
                   <TableRow>
                      <TableHead className="font-bold py-4 pl-6">Label</TableHead>
                      <TableHead className="font-bold py-4">API Name</TableHead>
                      <TableHead className="font-bold py-4">Data Type</TableHead>
                      <TableHead className="font-bold py-4">Required</TableHead>
                      <TableHead className="text-right font-bold py-4 pr-6">Actions</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   {fields.map((field: any) => (
                      <TableRow key={field.id} className="group hover:bg-slate-50/50 transition-colors">
                         <TableCell className="py-4 pl-6 font-semibold text-slate-900">{field.label}</TableCell>
                         <TableCell className="py-1">
                            <code className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                               {field.name}
                            </code>
                         </TableCell>
                         <TableCell className="py-4">
                            <div className="flex items-center gap-2 text-slate-600">
                               <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                  {getIcon(field.field_type)}
                                </div>
                               <span className="text-sm font-medium uppercase tracking-tight">{field.field_type}</span>
                            </div>
                         </TableCell>
                         <TableCell className="py-4">
                            <Badge variant="outline" className={cn(
                               "font-bold text-[10px]", 
                               field.is_required ? "bg-red-50 text-red-600 border-red-100" : "bg-slate-50 text-slate-400 border-slate-100"
                            )}>
                               {field.is_required ? "YES" : "NO"}
                            </Badge>
                         </TableCell>
                         <TableCell className="text-right py-4 pr-6">
                            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                               <IconTrash size={18} />
                            </Button>
                         </TableCell>
                      </TableRow>
                   ))}
                   {fields.length === 0 && (
                      <TableRow>
                         <TableCell colSpan={5} className="h-48 text-center p-8">
                            <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                               <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center border border-dashed border-slate-200 mb-2">
                                  <IconPlus size={32} />
                               </div>
                               <p className="max-w-[200px] text-sm font-medium">No custom fields defined yet. Start by adding one above.</p>
                            </div>
                         </TableCell>
                      </TableRow>
                   )}
                </TableBody>
             </Table>
          </CardContent>
        </Card>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
           <IconAlertCircle className="text-amber-600 mt-1" size={20} />
           <div>
              <h4 className="text-amber-900 font-bold text-sm">Pro Tip: Schema Consistency</h4>
              <p className="text-amber-800 text-xs mt-1 leading-relaxed">
                 Once you add a custom field, it applies to all your Leads and Deals. Avoid frequent deletions of active fields, as this data will be permanently hidden in the JSON storage.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
