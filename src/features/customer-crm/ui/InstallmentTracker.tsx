"use client"

import { CheckCircle2, AlertTriangle, Clock } from "lucide-react"
import { cn } from "@/shared/lib/utils/utils"

interface InstallmentTrackerProps {
    createdAt: string
    dueDate: string | null
    totalAmount: number
    installmentMonths: number
    payments: Array<{ amount: number, createdAt: any }>
}

export function InstallmentTracker({
    createdAt,
    dueDate,
    totalAmount,
    installmentMonths,
    payments
}: InstallmentTrackerProps) {
    if (installmentMonths <= 1) return null

    const monthlyAmount = totalAmount / installmentMonths
    const startDate = new Date(createdAt)
    const now = new Date()

    // Calculate slots
    const slots = Array.from({ length: installmentMonths }).map((_, i) => {
        const slotDueDate = new Date(startDate)
        slotDueDate.setMonth(startDate.getMonth() + i + 1)

        // Cumulative amount that should be paid by this slot's end
        const targetCumulative = monthlyAmount * (i + 1)

        // Actual cumulative paid
        const actualCumulative = payments.reduce((sum, p) => {
            // Include payments made before or on this slot's due date (plus 1 day grace for timezones)
            if (new Date(p.createdAt).getTime() <= slotDueDate.getTime() + 86400000) {
                return sum + p.amount
            }
            return sum
        }, 0)

        // Punctuality check: Did they pay at least 'monthlyAmount * (i+1)' by this date?
        const isPaid = actualCumulative >= (targetCumulative - 0.01)
        const isOverdue = !isPaid && now > slotDueDate

        return {
            month: i + 1,
            dueDate: slotDueDate,
            isPaid,
            isOverdue
        }
    })

    return (
        <div className="mt-4 p-4 rounded-2xl bg-black/20 border border-white/5">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Installment Progress</p>
            <div className="flex items-center gap-2">
                {slots.map((slot) => (
                    <div key={slot.month} className="flex-1 group relative">
                        <div className={cn(
                            "h-1.5 rounded-full transition-all duration-500",
                            slot.isPaid ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" :
                                (slot.isOverdue ? "bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "bg-white/10")
                        )} />

                        {/* Tooltip / Label */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                            <div className="bg-zinc-900 border border-white/10 px-2 py-1 rounded text-[8px] font-bold text-white shadow-xl">
                                Month {slot.month}: {slot.dueDate.toLocaleDateString()}
                                {slot.isOverdue && <span className="ml-1 text-red-400">!! OVERDUE !!</span>}
                            </div>
                        </div>

                        {/* Visual Dot */}
                        <div className="flex justify-center mt-2">
                            {slot.isPaid ? (
                                <CheckCircle2 size={10} className="text-emerald-500" />
                            ) : slot.isOverdue ? (
                                <AlertTriangle size={10} className="text-red-500" />
                            ) : (
                                <Clock size={10} className="text-zinc-600" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
