"use client"

import { Modal } from "@/shared/ui/Modal"
import { Customer } from "@/entities/customer/model/types"
import { useState } from "react"
import { recordPaymentAction } from "../api/actions"

interface RecordPaymentModalProps {
    isOpen: boolean
    onClose: () => void
    customer: Customer
    organizationId: string
}

export function RecordPaymentModal({ isOpen, onClose, customer, organizationId }: RecordPaymentModalProps) {
    const [amount, setAmount] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const parsedAmount = parseFloat(amount)
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert("Please enter a valid amount")
            return
        }

        setIsSubmitting(true)
        const res = await recordPaymentAction(organizationId, customer.id, parsedAmount)
        setIsSubmitting(false)

        if (res.success) {
            setAmount("")
            onClose()
        } else {
            alert(res.error)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Record Debt Payment">
            <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
                <div>
                    <h4 className="text-zinc-400 text-sm font-bold">Current Balance</h4>
                    <span className="text-white text-xl font-black">${Number(customer.total_balance).toFixed(2)}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Payment Amount ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10 transition-all text-xl font-bold"
                        placeholder="0.00"
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting || !amount}
                        className="w-full bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-red-500/20 transition-all active:scale-95"
                    >
                        {isSubmitting ? "Processing..." : "Confirm Payment"}
                    </button>
                    <p className="text-center text-zinc-500 text-xs mt-4 font-medium px-4">
                        This action uses an atomic Drizzle transaction to safely decrement the debt and log the payment.
                    </p>
                </div>
            </form>
        </Modal>
    )
}
