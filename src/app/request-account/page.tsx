import { ArrowLeft, CheckCircle2, Store, User, Mail, Briefcase, Send } from "lucide-react";
import Link from "next/link";
import { RequestForm } from "@/features/organization-request/ui/RequestForm";

export default function RequestAccountPage() {
    return (
        <div className="flex min-h-screen flex-col bg-[#0F172A] selection:bg-amber-500/30">
            {/* Background Gradients */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] h-[600px] w-[600px] rounded-full bg-violet-cta/10 blur-[120px]" />
            </div>

            <header className="relative z-10 flex w-full items-center justify-between p-6 md:px-12">
                <Link
                    href="/"
                    className="group flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to home
                </Link>
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                        <Store className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-display font-bold tracking-tight text-white">
                        Lotter
                    </span>
                </div>
            </header>

            <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12">
                <div className="w-full max-w-xl">
                    <div className="mb-12 text-center">
                        <h1 className="mb-4 font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                            Elevate Your <span className="text-amber-500">Retail Business.</span>
                        </h1>
                        <p className="text-lg text-slate-400">
                            Submit your request to join Lotter. Our team manually reviews and approves businesses to ensure the highest quality experience.
                        </p>
                    </div>

                    <div className="glass overflow-hidden rounded-[2.5rem] p-1 md:p-2">
                        <RequestForm />
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                            <CheckCircle2 className="h-5 w-5 text-amber-500" />
                            Manual Verification
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                            <CheckCircle2 className="h-5 w-5 text-amber-500" />
                            Multi-tenant Privacy
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                            <CheckCircle2 className="h-5 w-5 text-amber-500" />
                            Installment Ready
                        </div>
                    </div>
                </div>
            </main>

            <footer className="w-full border-t border-white/5 p-8 text-center text-sm text-slate-600">
                &copy; {new Date().getFullYear()} Lotter Technologies. Premium POS Solutions.
            </footer>
        </div>
    );
}
