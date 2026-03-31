import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4">
      <div className="w-full max-w-[450px] animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center gap-6 mb-8 text-center">
            <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-green-500/30">
                W
            </div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Wizard CRM</h1>
                <p className="text-slate-500 text-sm">Welcome back. Enter your credentials to access your dashboard.</p>
            </div>
        </div>

        <Card className="border-slate-200 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <CardTitle className="text-xl font-bold text-slate-800">Sign In</CardTitle>
            <CardDescription className="text-slate-500 mt-1">Access your multi-tenant workspace</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-10">
            <AuthForm mode="login" />
            <div className="mt-8 text-center">
                <p className="text-sm text-slate-500">
                    Don&apos;t have an account yet? 
                    <Link href="/signup" className="text-green-600 font-bold ml-1 hover:underline underline-offset-4">
                   Let&apos;s get you back in for some more high performance selling!
                    </Link>
                </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-12 text-center">
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
                &copy; 2026 Wizard CRM &bull; Enterprise Solutions
            </p>
        </div>
      </div>
    </div>
  );
}
