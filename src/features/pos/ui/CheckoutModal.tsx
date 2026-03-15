"use client"

import { useState } from "react"
import { useCartStore } from "../model/useCartStore"
import { Modal } from "@/shared/ui/Modal"
import { processTransaction } from "../api/actions"
import { Loader2, Banknote, CreditCard, Wallet } from "lucide-react"
import { CustomerSelection } from "./CustomerSelection"
import { Customer } from "@/entities/customer/model/types"

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    organizationId: string;
}

export function CheckoutModal({ isOpen, onClose, organizationId }: CheckoutModalProps) {
    const { items, getTotal, clearCart } = useCartStore()
    const totalAmount = getTotal()

    const [paymentAmount, setPaymentAmount] = useState<string>(totalAmount.toString())
    const [paymentType, setPaymentType] = useState<'cash' | 'card' | 'installment'>('cash')
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleCheckout = async () => {
        setIsProcessing(true)
        setError(null)

        if (paymentType === 'installment' && !selectedCustomer) {
            setError("Customer must be selected for installment payments")
            setIsProcessing(false)
            return
        }

        try {
            const result = await processTransaction({
                organization_id: organizationId,
                customer_id: selectedCustomer?.id,
                items: items.map(item => ({
                    product_id: item.id,
                    sku: item.sku,
                    name: item.name,
                    quantity: item.cartQuantity,
                    unit_price: Number(item.price)
                })),
                discount_amount: 0,
                payment_amount: Number(paymentAmount),
                payment_type: paymentType
            })

            if ('success' in result && result.success) {
                clearCart()
                onClose()
            } else {
                setError((result as any).error || "Failed to process transaction")
            }
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred")
        } finally {
            setIsProcessing(false)
        }
    }

    const changeDue = Number(paymentAmount) - totalAmount

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Complete Checkout">
            <div className="space-y-6">
                <CustomerSelection
                    organizationId={organizationId}
                    selectedCustomer={selectedCustomer}
                    onSelect={setSelectedCustomer}
                />

                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center">
                    <p className="text-zinc-500 font-bold mb-1 uppercase tracking-widest text-xs">Total Due</p>
                    <p className="text-5xl font-black text-white">${totalAmount.toFixed(2)}</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => setPaymentType('cash')}
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${paymentType === 'cash' ? 'bg-primary-500/20 border-primary-500 text-primary-400' : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'}`}
                    >
                        <Banknote size={24} />
                        <span className="font-bold text-sm">Cash</span>
                    </button>
                    <button
                        onClick={() => setPaymentType('card')}
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${paymentType === 'card' ? 'bg-primary-500/20 border-primary-500 text-primary-400' : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'}`}
                    >
                        <CreditCard size={24} />
                        <span className="font-bold text-sm">Card</span>
                    </button>
                    <button
                        onClick={() => setPaymentType('installment')}
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${paymentType === 'installment' ? 'bg-primary-500/20 border-primary-500 text-primary-400' : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'}`}
                    >
                        <Wallet size={24} />
                        <span className="font-bold text-sm">Installment</span>
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-bold text-zinc-400 mb-2">Tendered Amount ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-xl font-bold focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                </div>

                {paymentType === 'cash' && changeDue > 0 && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex justify-between items-center text-emerald-400">
                        <span className="font-bold">Change Due</span>
                        <span className="font-black text-xl">${changeDue.toFixed(2)}</span>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-medium">
                        {error}
                    </div>
                )}

                <div className="pt-4 border-t border-white/10">
                    <button
                        onClick={handleCheckout}
                        disabled={isProcessing || Number(paymentAmount) < totalAmount}
                        className="w-full h-14 bg-primary-500 hover:bg-primary-400 text-white font-black text-lg rounded-xl shadow-xl shadow-primary-500/20 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                    >
                        {isProcessing ? <Loader2 size={24} className="animate-spin" /> : 'Confirm Payment'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}
