import { ArrowRight, BarChart3, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-black selection:bg-primary-500/30">
      {/* Hero Section */}
      <header className="relative z-10 flex w-full items-center justify-between p-6 md:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-900 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <BarChart3 className="h-6 w-6" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight text-white">
            Lotter
          </span>
        </div>
        <Link
          href="/request-account"
          className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-all hover:scale-105 active:scale-95"
        >
          Login
        </Link>
      </header>

      <main className="relative flex flex-1 flex-col items-center justify-center px-6 text-center md:px-12">
        {/* Background Gradients */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-[25%] left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-[100%] bg-amber-500/20 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-violet-cta/10 blur-[100px]" />
        </div>

        <div className="animate-in relative z-10 flex max-w-4xl flex-col items-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-amber-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
            </span>
            Now accepting waitlist requests
          </div>

          <h1 className="mb-8 font-display text-5xl font-extrabold leading-[1.1] tracking-tight text-white md:text-7xl lg:text-8xl">
            Modern POS for <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-white bg-clip-text text-transparent">
              High-Trust Retail.
            </span>
          </h1>

          <p className="mb-12 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl">
            The premium multi-tenant POS system built for businesses that value customer relationships. Built-in credit tracking, installment management, and lightning-fast transactions.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/request-account"
              className="group flex h-14 items-center justify-center gap-2 rounded-2xl bg-violet-cta px-8 text-lg font-bold text-white shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all hover:scale-105 hover:bg-violet-600 active:scale-95"
            >
              Request Access
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#features"
              className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 text-lg font-bold text-white transition-all hover:bg-white/10 active:scale-95"
            >
              See Features
            </Link>
          </div>
        </div>

        {/* Feature Cards Preview */}
        <div id="features" className="mt-24 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<ShieldCheck className="h-6 w-6" />}
            title="Secure Multi-tenancy"
            description="Your data is isolated and protected with enterprise-grade security layers."
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="Real-time POS"
            description="Execute sales in milliseconds with our high-performance checkout engine."
          />
          <FeatureCard
            icon={<BarChart3 className="h-6 w-6" />}
            title="Credit Tracking"
            description="Native support for customer installments and debt management built-in."
          />
        </div>
      </main>

      <footer className="w-full border-t border-white/5 bg-black p-8 text-center text-sm text-zinc-500">
        &copy; {new Date().getFullYear()} Lotter Technologies. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass group relative flex flex-col items-start gap-4 rounded-3xl p-8 text-left transition-all hover:-translate-y-1 hover:border-white/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-amber-500 ring-1 ring-white/10 transition-colors group-hover:bg-amber-500 group-hover:text-slate-900 group-hover:ring-amber-500">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="leading-relaxed text-zinc-400">{description}</p>
    </div>
  );
}
