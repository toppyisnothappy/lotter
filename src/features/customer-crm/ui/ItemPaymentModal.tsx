"use client"

import { Modal } from "@/shared/ui/Modal"
import { useState } from "react"
import { recordItemPaymentAction } from "../api/actions"

interface ItemPaymentModalProps {
    isOpen: boolean
    onClose: () => void
    transactionId: string
    remainingBalance: number
    organizationId: string
    customerId: string
    onSuccess: () => Promise<void>
}

export function ItemPaymentModal({
    isOpen,
    onClose,
    transactionId,
    remainingBalance,
    organizationId,
    customerId,
    onSuccess
}: ItemPaymentModalProps) {
    const [amount, setAmount] = useState(remainingBalance.toString())
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const parsedAmount = parseFloat(amount)
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert("Please enter a valid amount")
            return
        }

        if (parsedAmount > remainingBalance + 0.01) {
            alert("Payment amount cannot exceed the remaining balance")
            return
        }

        setIsSubmitting(true)
        const isFullSettlement = Math.abs(parsedAmount - remainingBalance) < 0.01

        const res = await recordItemPaymentAction(
            organizationId,
            customerId,
            transactionId,
            parsedAmount,
            isFullSettlement
        )

        setIsSubmitting(false)

        if (res.success) {
            await onSuccess()
            onClose()
        } else {
            alert(res.error)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Item Payment">
            <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
                <div>
                    <h4 className="text-zinc-400 text-sm font-bold">Remaining Balance for this Item</h4>
                    <span className="text-white text-xl font-black">${remainingBalance.toFixed(2)}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Payment Amount ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        max={remainingBalance}
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all text-xl font-bold"
                        placeholder="0.00"
                    />
                    <div className="mt-4 flex gap-2">
                        <button
                            type="button"
                            onClick={() => setAmount((remainingBalance / 2).toFixed(2))}
                            className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 transition-colors"
                        >
                            Pay Half
                        </button>
                        <button
                            type="button"
                            onClick={() => setAmount(remainingBalance.toFixed(2))}
                            className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 transition-colors"
                        >
                            Pay All
                        </button>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting || !amount}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
                    >
                        {isSubmitting ? "Processing..." : "Confirm Payment"}
                    </button>
                    <p className="text-center text-zinc-500 text-xs mt-4 font-medium px-4 leading-relaxed">
                        This partial payment will be linked specifically to this transaction. The customer's total debt will also decrease.
                    </p>
                </div>
            </form>
        </Modal>
    )
}
