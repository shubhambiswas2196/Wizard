"use client";

import { useState } from "react";
import { Plus, Settings2, Loader2, Info } from "lucide-react";
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
import { useRouter } from "next/navigation";

export function CreateFieldDialog() {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPending(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const label = formData.get("label") as string;
        const name = label.toLowerCase().replace(/[^a-z0-9]/g, "_");
        const data = {
            label,
            name,
            field_type: formData.get("field_type"),
            is_required: formData.get("is_required") === "true",
        };

        try {
            const response = await fetch("/api/crm/custom-fields/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({ detail: "An error occurred" }));
                setError(errData.detail || "Failed to create field.");
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-2xl h-12 px-6 bg-purple-600 hover:bg-purple-700 font-bold shadow-lg shadow-purple-600/20 gap-2">
                    <Plus size={18} />
                    Define New Field
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] rounded-3xl p-8 border-slate-100 shadow-2xl">
                <DialogHeader className="mb-4">
                    <div className="h-12 w-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4 mx-auto">
                       <Settings2 size={24} />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-center">Customize Your Schema</DialogTitle>
                    <DialogDescription className="text-center text-slate-500 mt-2">
                        Add a new dynamic column to your Leads & Deals.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="label" className="text-slate-800 font-bold text-sm ml-1">Field Display Name</Label>
                        <Input 
                            id="label" 
                            name="label" 
                            placeholder="e.g. Lead Score, Referral Source" 
                            className="h-12 border-slate-200 rounded-2xl focus:border-purple-500 focus:ring-purple-500 transition-all font-medium" 
                            required 
                        />
                        <p className="text-[10px] text-slate-400 font-medium ml-1 flex items-center gap-1 uppercase tracking-tight">
                            <Info size={10} />
                            API name will be auto-generated
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                           <Label htmlFor="field_type" className="text-slate-800 font-bold text-sm ml-1">Data Type</Label>
                           <Select name="field_type" defaultValue="TEXT">
                               <SelectTrigger className="h-12 border-slate-200 rounded-2xl focus:border-purple-500 font-medium">
                                   <SelectValue placeholder="Select type" />
                               </SelectTrigger>
                               <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                   <SelectItem value="TEXT" className="rounded-xl font-medium">Text Input</SelectItem>
                                   <SelectItem value="NUMBER" className="rounded-xl font-medium">Numeric</SelectItem>
                                   <SelectItem value="DATE" className="rounded-xl font-medium">Date Picker</SelectItem>
                                   <SelectItem value="CHECKBOX" className="rounded-xl font-medium">Checkbox</SelectItem>
                               </SelectContent>
                           </Select>
                       </div>
                       <div className="space-y-2">
                           <Label htmlFor="is_required" className="text-slate-800 font-bold text-sm ml-1">Constraint</Label>
                           <Select name="is_required" defaultValue="false">
                               <SelectTrigger className="h-12 border-slate-200 rounded-2xl focus:border-purple-500 font-medium">
                                   <SelectValue placeholder="Is Required?" />
                               </SelectTrigger>
                               <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                   <SelectItem value="false" className="rounded-xl font-medium">Optional</SelectItem>
                                   <SelectItem value="true" className="rounded-xl font-medium text-red-600">Required</SelectItem>
                               </SelectContent>
                           </Select>
                       </div>
                    </div>

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
                                    Defining Schema...
                                </>
                            ) : "Create Custom Field"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

import { AlertCircle } from "lucide-react";
