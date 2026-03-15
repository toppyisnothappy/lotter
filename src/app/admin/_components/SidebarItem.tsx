import { cn } from "@/shared/lib/utils/utils"

export function SidebarItem({ icon, label, active, count }: { icon: React.ReactNode, label: string, active?: boolean, count?: number }) {
    return (
        <button
            className={cn(
                "flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all",
                active ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30" : "text-zinc-400 hover:bg-white/5 hover:text-white"
            )}
        >
            <div className="flex items-center gap-3">
                {icon}
                <span className="font-medium">{label}</span>
            </div>
            {count && (
                <span className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                    active ? "bg-white text-violet-600" : "bg-violet-600/20 text-violet-400"
                )}>
                    {count}
                </span>
            )}
        </button>
    )
}
