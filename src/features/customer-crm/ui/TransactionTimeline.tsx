"use client"

import { useEffect, useState } from "react"
import { getCustomerHistoryAction } from "../api/actions"
import { Clock, ShoppingCart, CreditCard, ExternalLink, Wallet } from "lucide-react"
import { cn } from "@/shared/lib/utils/utils"

export function TransactionTimeline({ customerId, organizationId }: { customerId: string, organizationId: string }) {
    const [history, setHistory] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchHistory = async () => {
            const res = await getCustomerHistoryAction(organizationId, customerId)
            if (res.success && res.history) {
                setHistory(res.history)
            }
            setIsLoading(false)
        }
        fetchHistory()
    }, [organizationId, customerId])

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

    return (
        <div className="space-y-6">
            <div className="relative border-l border-white/10 ml-4 space-y-8 pb-4">
                {history.map((item, i) => {
                    const isPayment = item._type === 'payment'
                    const isInstallmentPurchase = !isPayment && item.status === 'partial'
                    const date = new Date(item.createdAt).toLocaleString()

                    return (
                        <div key={item.id + i} className="relative pl-8">
                            <div className={cn(
                                "absolute -left-4 top-1 h-8 w-8 rounded-full flex items-center justify-center border-2 border-black",
                                isPayment ? "bg-emerald-500 text-black" : (isInstallmentPurchase ? "bg-red-500 text-white" : "bg-white/10 text-white")
                            )}>
                                {isPayment ? <CreditCard size={14} /> : (isInstallmentPurchase ? <Wallet size={14} /> : <ShoppingCart size={14} />)}
                            </div>

                            <div className="glass rounded-2xl p-5 border border-white/5 group hover:border-white/20 transition-all cursor-pointer">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                                            isPayment ? "bg-emerald-500/20 text-emerald-400" : (isInstallmentPurchase ? "bg-red-500/20 text-red-100 uppercase" : "bg-blue-500/20 text-blue-400")
                                        )}>
                                            {isPayment ? 'Debt Payment' : (isInstallmentPurchase ? 'Installment Debt' : 'Store Purchase')}
                                        </span>
                                        <span className="text-xs text-zinc-500 font-mono">{date}</span>
                                    </div>
                                    <ExternalLink size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-1">
                                            {isPayment ? `Payment via ${item.paymentType}` : 'POS Transaction'}
                                        </h4>
                                        <p className="text-sm text-zinc-400">
                                            {isPayment ? `Reference: ${item.referenceNumber || 'N/A'}` : `Status: ${item.status}`}
                                        </p>
                                    </div>
                                    <div className={`text-2xl font-display font-black ${isPayment ? 'text-emerald-400' : 'text-white'}`}>
                                        {isPayment ? '-' : '+'}${Number(item.amount || item.totalAmount).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Basic Pagination Notice */}
            <div className="text-center pt-4">
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Showing last 50 records</p>
            </div>
        </div>
    )
}
