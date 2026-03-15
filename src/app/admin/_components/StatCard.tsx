import { cn } from "@/shared/lib/utils/utils"

export function StatCard({ label, value, change, highlight }: { label: string, value: string, change: string, highlight?: boolean }) {
    return (
        <div className={cn(
            "p-6 rounded-3xl border border-white/5 bg-zinc-950/50",
            highlight && "ring-1 ring-violet-500/50 bg-violet-500/5"
        )}>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{label}</p>
            <h3 className="mt-2 text-4xl font-display font-bold text-white">{value}</h3>
            <p className={cn("mt-2 text-sm", highlight ? "text-violet-400 font-medium" : "text-emerald-400")}>{change}</p>
        </div>
    )
}
