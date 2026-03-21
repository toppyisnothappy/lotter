"use client"

import { useEffect, useState } from "react"
import { getCustomerHistoryAction } from "../api/actions"
import { Clock, ShoppingCart, CreditCard, ExternalLink, Wallet, Send, Loader2, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react"
import { cn } from "@/shared/lib/utils/utils"
import { sendInstallmentReminderAction } from "../api/line"
import { ItemPaymentModal } from "./ItemPaymentModal"
import { InstallmentTracker } from "./InstallmentTracker"

export function TransactionTimeline({ customerId, organizationId }: { customerId: string, organizationId: string }) {
    const [history, setHistory] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [sendingReminderId, setSendingReminderId] = useState<string | null>(null)
    const [paymentModalData, setPaymentModalData] = useState<{ id: string, balance: number } | null>(null)
    const [filter, setFilter] = useState<'all' | 'overdue' | 'unpaid'>('all')

    const fetchHistory = async () => {
        const res = await getCustomerHistoryAction(organizationId, customerId)
        if (res.success && res.history) {
            setHistory(res.history)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchHistory()
    }, [organizationId, customerId])

    const handlePayClick = (transactionId: string, balance: number) => {
        setPaymentModalData({ id: transactionId, balance })
    }

    const handleSendReminder = async (transactionId: string) => {
        setSendingReminderId(transactionId)
        try {
            const res = await sendInstallmentReminderAction(organizationId, customerId)
            if (res.success) {
                alert("Reminder sent successfully via LINE!")
            } else {
                alert(`Error: ${res.error}`)
            }
        } catch (e) {
            alert("Failed to send reminder")
        } finally {
            setSendingReminderId(null)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 opacity-50">
                <div className="w-8 h-8 rounded-full border-2 border-t-white border-white/20 animate-spin mb-4" />
                <p className="text-zinc-400 font-medium">Loading history...</p>
            </div>
        )
    }

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 opacity-50">
                <Clock className="w-12 h-12 text-zinc-600 mb-4" />
                <p className="text-zinc-400 font-medium">No transactions or payments found.</p>
            </div>
        )
    }

    const activeDebts = history.filter(item => item._type === 'purchase' && item.remainingBalance > 0)
    const overdueDebts = activeDebts.filter(item => item.isOverdue)
    const nextDue = [...activeDebts].sort((a, b) => new Date(a.dueDate as any).getTime() - new Date(b.dueDate as any).getTime())[0]

    const filteredHistory = history.filter(item => {
        if (filter === 'all') return true
        if (filter === 'overdue') return item.isOverdue
        if (filter === 'unpaid') return item.remainingBalance > 0
        return true
    })

    return (
        <div className="space-y-10">
            {/* Urgency Summary Banner */}
            {activeDebts.length > 0 && (
                <div className={cn(
                    "p-8 rounded-[2.5rem] border animate-in fade-in slide-in-from-top-4 duration-1000",
                    overdueDebts.length > 0
                        ? "bg-red-500/10 border-red-500/20 shadow-2xl shadow-red-500/10"
                        : "bg-primary-500/10 border-primary-500/20 shadow-2xl shadow-primary-500/10"
                )}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className={cn(
                                "h-16 w-16 rounded-[1.5rem] flex items-center justify-center border",
                                overdueDebts.length > 0
                                    ? "bg-red-500 text-white border-white/20"
                                    : "bg-primary-500 text-white border-white/20"
                            )}>
                                {overdueDebts.length > 0 ? <AlertTriangle size={32} /> : <Clock size={32} />}
                            </div>
                            <div>
                                <h4 className="text-2xl font-display font-black text-white">
                                    {overdueDebts.length > 0
                                        ? `${overdueDebts.length} Critical Issues`
                                        : "Debt in Good Standing"}
                                </h4>
                                <p className="text-zinc-400 text-sm font-medium mt-1">
                                    {overdueDebts.length > 0
                                        ? `Customer has missed ${overdueDebts.length} payment deadlines.`
                                        : `Up next: $${nextDue.remainingBalance.toFixed(2)} due on ${new Date(nextDue.dueDate).toLocaleDateString()}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <p className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest leading-none mb-1">Live Liability</p>
                                <p className="text-3xl font-display font-black text-white">
                                    ${activeDebts.reduce((sum, d) => sum + d.remainingBalance, 0).toFixed(2)}
                                </p>
                            </div>
                            <button
                                onClick={() => handlePayClick(nextDue.id, nextDue.remainingBalance)}
                                className={cn(
                                    "px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all active:scale-95 shadow-2xl",
                                    overdueDebts.length > 0 ? "bg-white text-red-600 shadow-red-500/10" : "bg-white text-primary-600 shadow-emerald-500/10"
                                )}
                            >
                                Settle Next <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* Timeline Filters */}
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em]">Activity Feed</h3>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                        {(['all', 'unpaid', 'overdue'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                    filter === t ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative border-l border-white/10 ml-4 space-y-8 pb-4">
                    {filteredHistory.map((item, i) => {
                        const isPayment = item._type === 'payment'
                        const isInstallmentPurchase = !isPayment && item.status === 'partial'
                        const date = new Date(item.createdAt).toLocaleString()

                        return (
                            <div key={item.id + i} className="relative pl-8">
                                <div className={cn(
                                    "absolute -left-4 top-1 h-8 w-8 rounded-full flex items-center justify-center border-2 border-black z-10",
                                    isPayment ? "bg-emerald-500 text-black" : (item.isOverdue ? "bg-red-500 text-white animate-pulse" : (isInstallmentPurchase ? "bg-primary-500 text-white" : "bg-white/10 text-white"))
                                )}>
                                    {isPayment ? <CreditCard size={14} /> : (item.isOverdue ? <AlertTriangle size={14} /> : (isInstallmentPurchase ? <Wallet size={14} /> : <ShoppingCart size={14} />))}
                                </div>

                                <div className={cn(
                                    "glass rounded-2xl p-5 border group transition-all cursor-pointer shadow-lg",
                                    item.isOverdue ? "border-red-500/30 bg-red-500/5" : "border-white/5 hover:border-white/20"
                                )}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                                                isPayment ? "bg-emerald-500/20 text-emerald-400" : (item.isOverdue ? "bg-red-500/20 text-red-500 border border-red-500/20" : (isInstallmentPurchase ? "bg-primary-500/20 text-primary-400" : "bg-zinc-500/20 text-zinc-400"))
                                            )}>
                                                {isPayment ? 'Debt Payment' : (item.isOverdue ? 'OVERDUE ITEM' : (isInstallmentPurchase ? 'Installment Debt' : 'Cash Purchase'))}
                                            </span>
                                            {item.isPaidInTime && (
                                                <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    <CheckCircle2 size={10} /> Paid on Time
                                                </span>
                                            )}
                                            <span className="text-xs text-zinc-500 font-mono">{date}</span>
                                        </div>
                                        <ExternalLink size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="flex-1">
                                            <h4 className="text-lg font-bold text-white mb-1">
                                                {isPayment ? `Payment via ${item.paymentType}` : 'POS Transaction'}
                                            </h4>
                                            <p className="text-sm text-zinc-400">
                                                {isPayment ? `Reference: ${item.referenceNumber || 'N/A'}` : `Status: ${item.status}`}
                                            </p>
                                            {!isPayment && item.dueDate && (
                                                <div className="mt-2 flex flex-col gap-1">
                                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                                        Repayment Schedule
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <div className={cn(
                                                            "text-[10px] font-bold px-2 py-0.5 rounded border",
                                                            item.isOverdue
                                                                ? "text-white bg-red-500 border-red-400"
                                                                : "text-red-400 bg-red-400/10 border-red-400/20"
                                                        )}>
                                                            {item.isOverdue ? `LATE BY ${item.daysOverdue} DAYS` : `Due: ${new Date(item.dueDate).toLocaleDateString()}`}
                                                        </div>
                                                        {item.installmentMonths > 1 && (
                                                            <div className="text-[10px] text-primary-400 font-bold bg-primary-400/10 px-2 py-0.5 rounded border border-primary-400/20">
                                                                {item.installmentMonths} Monthly Installments
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Monthly Tracker */}
                                            {!isPayment && item.installmentMonths > 1 && (
                                                <InstallmentTracker
                                                    createdAt={item.createdAt}
                                                    dueDate={item.dueDate}
                                                    installmentMonths={item.installmentMonths}
                                                    totalAmount={parseFloat(item.netAmount || item.totalAmount)}
                                                    payments={item.payments || []}
                                                />
                                            )}

                                            {isInstallmentPurchase && (
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSendReminder(item.id);
                                                        }}
                                                        disabled={sendingReminderId === item.id}
                                                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                                                    >
                                                        {sendingReminderId === item.id ? (
                                                            <Loader2 size={12} className="animate-spin" />
                                                        ) : (
                                                            <Send size={12} />
                                                        )}
                                                        Reminder
                                                    </button>

                                                    {item.remainingBalance > 0 && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handlePayClick(item.id, item.remainingBalance);
                                                            }}
                                                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                                                        >
                                                            <CreditCard size={12} />
                                                            Pay
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className={cn(
                                                "text-2xl font-display font-black",
                                                isPayment ? 'text-emerald-400' : (item.isOverdue ? 'text-red-400' : 'text-white')
                                            )}>
                                                {isPayment ? '-' : '+'}${Number(isPayment ? item.amount : (item.netAmount || item.totalAmount)).toFixed(2)}
                                            </div>
                                            {item.remainingBalance > 0 && (
                                                <div className={cn(
                                                    "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter mt-1",
                                                    item.isOverdue ? "bg-red-500 text-white" : "bg-red-500/80 text-red-100"
                                                )}>
                                                    Balance: ${Number(item.remainingBalance).toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {filteredHistory.length === 0 && (
                        <div className="py-20 text-center opacity-30">
                            <p className="text-sm font-black uppercase tracking-[0.3em]">No items match filter</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="text-center pt-4 border-t border-white/5">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Showing last 50 activity records</p>
            </div>

            {paymentModalData && (
                <ItemPaymentModal
                    isOpen={!!paymentModalData}
                    onClose={() => setPaymentModalData(null)}
                    transactionId={paymentModalData.id}
                    remainingBalance={paymentModalData.balance}
                    organizationId={organizationId}
                    customerId={customerId}
                    onSuccess={fetchHistory}
                />
            )}
        </div>
    )
}
