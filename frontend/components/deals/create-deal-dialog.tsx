"use client";

import { useState, useEffect } from "react";
import { Plus, Briefcase, Loader2, AlertCircle, TrendingUp, Calendar, Info, Target, Layers } from "lucide-react";
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
import { cn } from "@/lib/utils";

const STAGES = [
  { id: 'PROSPECTING', label: 'Prospecting', defaultProb: 10 },
  { id: 'QUALIFICATION', label: 'Qualification', defaultProb: 25 },
  { id: 'PROPOSAL', label: 'Proposal', defaultProb: 50 },
  { id: 'NEGOTIATION', label: 'Negotiation', defaultProb: 75 },
  { id: 'CLOSING', label: 'Closing', defaultProb: 90 },
];

export function CreateDealDialog() {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [leads, setLeads] = useState<any[]>([]);
    const [selectedStage, setSelectedStage] = useState('PROSPECTING');
    const [probability, setProbability] = useState(10);
    const router = useRouter();

    useEffect(() => {
        if (open) {
            fetch("/api/crm/leads/")
                .then(res => res.json())
                .then(data => setLeads(data.results || []))
                .catch(err => console.error("Failed to fetch leads", err));
        }
    }, [open]);

    const handleStageChange = (val: string) => {
        setSelectedStage(val);
        const stage = STAGES.find(s => s.id === val);
        if (stage) setProbability(stage.defaultProb);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPending(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get("name"),
            lead: formData.get("lead"),
            value: formData.get("value"),
            stage: selectedStage,
            probability: probability,
            expected_close_date: formData.get("close_date"),
            status: 'OPEN',
            custom_fields: {}
        };

        try {
            const response = await fetch("/api/crm/deals/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({ detail: "An error occurred" }));
                setError(errData.detail || "Failed to create deal.");
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
                <Button className="rounded-2xl h-12 px-6 bg-slate-900 text-white hover:bg-slate-800 font-bold shadow-lg shadow-black/20 gap-2 transition-all active:scale-95 group">
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    New Opportunity
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] p-10 border-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
                <DialogHeader className="mb-6">
                    <div className="h-14 w-14 bg-slate-950 rounded-3xl flex items-center justify-center text-white mb-6 mx-auto shadow-xl ring-8 ring-slate-50">
                       <Briefcase size={28} />
                    </div>
                    <DialogTitle className="text-3xl font-black text-center tracking-tight">Create Opportunity</DialogTitle>
                    <DialogDescription className="text-center text-slate-500 mt-2 font-medium">
                        Define the scope and value of your new potential deal.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Opportunity Title</Label>
                            <Input 
                                id="name" 
                                name="name" 
                                placeholder="Enterprise Licensing - Q3" 
                                className="h-12 border-slate-200 rounded-2xl focus:border-slate-900 font-bold bg-slate-50/30" 
                                required 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="lead" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Connect Lead</Label>
                                <Select name="lead" required>
                                    <SelectTrigger className="h-12 border-slate-200 rounded-2xl focus:border-slate-900 font-bold bg-slate-50/30">
                                        <SelectValue placeholder="Select lead" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                        {leads.map((lead: any) => (
                                            <SelectItem key={lead.id} value={lead.id.toString()} className="font-bold rounded-xl py-3 px-4">
                                                {lead.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="value" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Deal Value ($)</Label>
                                <div className="relative">
                                    <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <Input 
                                        id="value" 
                                        name="value" 
                                        type="number" 
                                        placeholder="50000" 
                                        className="h-12 pl-12 border-slate-200 rounded-2xl focus:border-slate-900 font-black bg-slate-50/30" 
                                        required 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                               <Layers size={16} className="text-blue-500" />
                               <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pipeline Metadata</span>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Current Stage</Label>
                                    <Select value={selectedStage} onValueChange={handleStageChange}>
                                        <SelectTrigger className="h-12 border-slate-200 rounded-2xl focus:border-slate-900 font-bold bg-slate-50/30">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                            {STAGES.map(s => (
                                                <SelectItem key={s.id} value={s.id} className="font-bold rounded-xl py-3 px-4">
                                                    {s.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Probability ({probability}%)</Label>
                                    <div className="relative pt-3 px-2">
                                        <input 
                                            type="range" 
                                            min="0" max="100" 
                                            value={probability}
                                            onChange={(e) => setProbability(parseInt(e.target.value))}
                                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-green-500 shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="close_date" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Expected Close Date</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <Input 
                                        id="close_date" 
                                        name="close_date" 
                                        type="date" 
                                        className="h-12 pl-12 border-slate-200 rounded-2xl focus:border-slate-900 font-bold bg-slate-50/30" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-3xl text-xs font-black flex items-center gap-3 animate-in slide-in-from-top-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <DialogFooter className="pt-6">
                        <Button 
                            type="submit" 
                            disabled={pending}
                            className={cn(
                                "w-full bg-slate-900 text-white hover:bg-slate-800 rounded-2xl h-14 font-black text-lg shadow-xl shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-70",
                                pending && "animate-pulse"
                            )}
                        >
                            {pending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Forecasting...
                                </>
                            ) : "Secure Opportunity"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
