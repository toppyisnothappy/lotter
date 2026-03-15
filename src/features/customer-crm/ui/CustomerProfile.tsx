"use client"

import { Customer } from "@/entities/customer/model/types"
import { CreditCard, Phone, Mail, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { RecordPaymentModal } from "./RecordPaymentModal"
import { TransactionTimeline } from "./TransactionTimeline"

interface CustomerProfileProps {
    customer: Customer
    organizationId: string
    organizationSlug: string
}

export function CustomerProfile({ customer, organizationId, organizationSlug }: CustomerProfileProps) {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

    return (
        <div className="w-full">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <Link href={`/${organizationSlug}/customers`} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-6 transition-colors w-fit">
                        <ArrowLeft size={16} />
                        <span className="text-sm font-bold">Back to Customers</span>
                    </Link>
                    <h1 className="text-4xl font-display font-black text-white">{customer.full_name}</h1>
                    <div className="flex items-center gap-4 mt-4 text-zinc-400">
                        {customer.phone && (
                            <div className="flex items-center gap-2">
                                <Phone size={14} />
                                <span className="text-sm">{customer.phone}</span>
                            </div>
                        )}
                        {customer.email && (
                            <div className="flex items-center gap-2">
                                <Mail size={14} />
                                <span className="text-sm">{customer.email}</span>
                            </div>
                        )}
                        {customer.line_id && (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 bg-emerald-500 rounded-sm flex items-center justify-center text-black text-[8px] font-black">L</div>
                                <span className="text-sm text-emerald-400 font-bold">{customer.line_id}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <span className="text-sm">Client since {new Date(customer.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Total Outstanding Debt Module */}
                <div className="lg:col-span-1 border-t-4 border-red-500 glass rounded-[2rem] p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <CreditCard size={120} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest leading-none mb-4">Total Outstanding Debt</p>
                        <h2 className="text-5xl font-display font-black text-white mb-2">
                            ${Number(customer.total_balance).toFixed(2)}
                        </h2>

                        <div className="mt-8 pt-8 border-t border-white/5">
                            <button
                                onClick={() => setIsPaymentModalOpen(true)}
                                className="w-full bg-red-500 hover:bg-red-400 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-red-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
                            >
                                Record Payment
                            </button>
                        </div>
                    </div>
                </div>

                {/* Audit Log / Timeline Placeholder (Phase 3) */}
                <div className="lg:col-span-2 glass rounded-[2rem] p-8 border border-white/5">
                    <h3 className="text-xl font-display font-black text-white mb-6">Transaction History</h3>
                    <TransactionTimeline customerId={customer.id} organizationId={organizationId} />
                </div>
            </div>

            <RecordPaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                customer={customer}
                organizationId={organizationId}
            />
        </div>
    )
}
