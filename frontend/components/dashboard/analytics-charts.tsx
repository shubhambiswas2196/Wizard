"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus } from "lucide-react";

const pipelineData = [
  { stage: 'Prospect', value: 45000, color: '#94a3b8' },
  { stage: 'MQL', value: 32000, color: '#64748b' },
  { stage: 'SQL', value: 28000, color: '#475569' },
  { stage: 'Demo', value: 15000, color: '#22c55e' },
  { stage: 'Closed', value: 12000, color: '#16a34a' },
];

const growthData = [
  { name: 'Mon', leads: 4 },
  { name: 'Tue', leads: 7 },
  { name: 'Wed', leads: 5 },
  { name: 'Thu', leads: 12 },
  { name: 'Fri', leads: 8 },
  { name: 'Sat', leads: 3 },
  { name: 'Sun', leads: 6 },
];

const COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'];

export function AnalyticsCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-4 border-slate-200 shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
          <CardTitle className="text-lg font-bold text-slate-800">Revenue Pipeline</CardTitle>
          <CardDescription>Estimated value across different sales stages</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="stage" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(34, 197, 94, 0.05)' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Pipeline Value']}
                />
                <Bar 
                  dataKey="value" 
                  fill="#22c55e" 
                  radius={[6, 6, 0, 0]} 
                  barSize={40}
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3 border-slate-200 shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
          <CardTitle className="text-lg font-bold text-slate-800">Lead Inflow</CardTitle>
          <CardDescription>New leads generated this week</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10} 
                />
                <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Line 
                    type="monotone" 
                    dataKey="leads" 
                    stroke="#22c55e" 
                    strokeWidth={3} 
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-green-50 rounded-2xl flex items-center justify-between border border-green-100">
             <div>
                <p className="text-xs font-bold text-green-800 uppercase tracking-wider mb-0.5">Peak Day</p>
                <p className="text-lg font-bold text-green-900">Thursday <span className="text-sm font-normal text-green-600">(12 Leads)</span></p>
             </div>
             <div className="h-10 w-10 bg-green-200 rounded-full flex items-center justify-center text-green-800">
                <Plus size={20} />
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
