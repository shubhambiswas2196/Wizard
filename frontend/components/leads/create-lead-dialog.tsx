"use client";

import { useState, useEffect } from "react";
import { Plus, UserPlus, Loader2, AlertCircle, Info, Hash, Type, Calendar, CheckSquare } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function CreateLeadDialog() {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customFieldDefs, setCustomFieldDefs] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (open) {
            fetch("/api/crm/custom-fields/")
                .then(res => res.json())
                .then(data => setCustomFieldDefs(Array.isArray(data) ? data : []))
                .catch(err => console.error("Failed to fetch custom fields", err));
        }
    }, [open]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPending(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const baseData: any = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            company: formData.get("company"),
            status: formData.get("status"),
            custom_fields: {}
        };

        // Gather custom field values
        customFieldDefs.forEach(field => {
            if (field.field_type === 'CHECKBOX') {
                baseData.custom_fields[field.name] = formData.get(`custom_${field.name}`) === 'on';
            } else {
                baseData.custom_fields[field.name] = formData.get(`custom_${field.name}`);
            }
        });

        try {
            const response = await fetch("/api/crm/leads/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(baseData),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({ detail: "An error occurred" }));
                setError(errData.detail || "Failed to create lead.");
                setPending(false);
                return;
            }

            setOpen(false);
            router.refresh();
        } catch (err) {
            setError("A network error occurred.");
        } finally {
            setPending(false);
        }
    };

    const renderCustomField = (field: any) => {
        const id = `custom_${field.name}`;
        const icon = field.field_type === 'NUMBER' ? <Hash size={14} /> : 
                     field.field_type === 'DATE' ? <Calendar size={14} /> : <Type size={14} />;

        if (field.field_type === 'CHECKBOX') {
            return (
                <div key={field.id} className="flex items-center space-x-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <Checkbox id={id} name={id} />
                    <Label htmlFor={id} className="text-sm font-bold text-slate-700 cursor-pointer">{field.label}</Label>
                </div>
            );
        }

        return (
            <div key={field.id} className="space-y-2">
                <Label htmlFor={id} className="text-slate-800 font-bold text-xs ml-1 flex items-center gap-1">
                    {icon}
                    {field.label}
                    {field.is_required && <span className="text-red-500">*</span>}
                </Label>
                <Input 
                    id={id} 
                    name={id} 
                    type={field.field_type === 'NUMBER' ? 'number' : field.field_type === 'DATE' ? 'date' : 'text'}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    required={field.is_required}
                    className="h-10 border-slate-200 rounded-xl focus:border-green-500 focus:ring-green-500 transition-all text-sm font-medium" 
                />
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-2xl h-12 px-6 bg-green-600 hover:bg-green-700 font-bold shadow-lg shadow-green-600/20 gap-2">
                    <Plus size={18} />
                    Add Lead
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-3xl p-8 border-slate-100 shadow-2xl overflow-y-auto max-h-[90vh]">
                <DialogHeader className="mb-4">
                    <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-4 mx-auto">
                       <UserPlus size={24} />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-center">Capture New Lead</DialogTitle>
                    <DialogDescription className="text-center text-slate-500 mt-2">
                        Enter prospect information to start tracking.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-800 font-bold text-xs ml-1">Full Name</Label>
                                <Input id="name" name="name" placeholder="John Doe" className="h-10 border-slate-200 rounded-xl focus:border-green-500 font-medium text-sm" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-slate-800 font-bold text-xs ml-1">Initial Status</Label>
                                <Select name="status" defaultValue="NEW">
                                    <SelectTrigger className="h-10 border-slate-200 rounded-xl focus:border-green-500 font-medium text-sm">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                        <SelectItem value="NEW" className="rounded-lg font-medium">New</SelectItem>
                                        <SelectItem value="CONTACTED" className="rounded-lg font-medium">Contacted</SelectItem>
                                        <SelectItem value="QUALIFIED" className="rounded-lg font-medium">Qualified</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-800 font-bold text-xs ml-1">Email Address</Label>
                            <Input id="email" name="email" type="email" placeholder="john@company.com" className="h-10 border-slate-200 rounded-xl focus:border-green-500 font-medium text-sm" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="company" className="text-slate-800 font-bold text-xs ml-1">Company</Label>
                                <Input id="company" name="company" placeholder="Acme Inc" className="h-10 border-slate-200 rounded-xl focus:border-green-500 font-medium text-sm" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-slate-800 font-bold text-xs ml-1">Phone</Label>
                                <Input id="phone" name="phone" placeholder="+1..." className="h-10 border-slate-200 rounded-xl focus:border-green-500 font-medium text-sm" />
                            </div>
                        </div>
                    </div>

                    {customFieldDefs.length > 0 && (
                        <div className="pt-4 border-t border-slate-100 space-y-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                                <Info size={14} className="text-purple-400" />
                                Custom Attributes
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {customFieldDefs.map(field => renderCustomField(field))}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}

                    <DialogFooter className="pt-4">
                        <Button 
                            type="submit" 
                            disabled={pending}
                            className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-2xl h-12 font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-70"
                        >
                            {pending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Record...
                                </>
                            ) : "Save Lead Record"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

import { AlertCircle as AlertCircleIcon } from "lucide-react";
