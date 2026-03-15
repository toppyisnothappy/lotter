"use client"

import { Customer } from "@/entities/customer/model/types"
import { Edit2, Trash2, User, Phone, Mail, CreditCard, MoreVertical, Eye, MessageSquare, Loader2 } from "lucide-react"
import { cn } from "@/shared/lib/utils/utils"
import Link from "next/link"
import { useParams } from "next/navigation"
import { sendInstallmentReminderAction } from "../api/line"
import { useState } from "react"

interface CustomerTableProps {
    customers: Customer[]
    onEdit?: (customer: Customer) => void
    onDelete?: (id: string) => void
}

export function CustomerTable({ customers, onEdit, onDelete }: CustomerTableProps) {
    const params = useParams()
    const slug = params?.slug as string
    const [sendingId, setSendingId] = useState<string | null>(null)

    const handleSendReminder = async (customerId: string) => {
        setSendingId(customerId)
        try {
            const organizationId = customers.find(c => c.id === customerId)?.organization_id
            if (!organizationId) return

            const result = await sendInstallmentReminderAction(organizationId, customerId)
            if (result.success) {
                alert("Reminder sent successfully")
            } else {
                alert(result.error)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setSendingId(null)
        }
    }

    if (customers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 glass rounded-[2.5rem] border-dashed border-white/10">
                <User className="h-16 w-16 text-zinc-700 mb-4" />
                <h3 className="text-xl font-bold text-white">No customers registered</h3>
                <p className="text-zinc-500 mt-2">Registers for CRM and credit tracking will appear here.</p>
            </div>
        )
    }

    return (
        <div className="glass rounded-[2rem] border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/[0.02] text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black">
                            <th className="px-8 py-6">Customer Name</th>
                            <th className="px-8 py-6">Contact Info</th>
                            <th className="px-8 py-6 text-center">Credit Balance</th>
                            <th className="px-8 py-6">Registered</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {customers.map((customer) => (
                            <tr key={customer.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-8 py-7">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500/20 to-blue-500/20 flex items-center justify-center text-primary-400 border border-white/5 group-hover:scale-110 transition-transform">
                                            <User size={24} />
                                        </div>
                                        <div className="font-bold text-white text-lg">{customer.full_name}</div>
                                    </div>
                                </td>
                                <td className="px-8 py-7">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                                            <Phone size={12} className="text-zinc-500" />
                                            {customer.phone || "No phone"}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <Mail size={12} className="text-zinc-500" />
                                            {customer.email || "No email"}
                                        </div>
                                        {customer.line_id && (
                                            <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold mt-1">
                                                <span className="bg-emerald-500/10 px-1 rounded text-[8px] border border-emerald-500/20">LINE</span>
                                                {customer.line_id}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-7">
                                    <div className="flex flex-col items-center">
                                        <div className={cn(
                                            "text-xl font-display font-black",
                                            customer.total_balance > 0 ? "text-red-400" : "text-emerald-400"
                                        )}>
                                            ${Number(customer.total_balance).toFixed(2)}
                                        </div>
                                        {customer.total_balance > 0 && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <CreditCard size={10} className="text-red-400" />
                                                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Outstanding Debt</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-7">
                                    <div className="text-sm text-zinc-500 font-mono">
                                        {new Date(customer.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-8 py-7 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            href={`/${slug}/customers/${customer.id}`}
                                            className="p-2.5 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5 transition-all"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                        {customer.total_balance > 0 && customer.line_id && (
                                            <button
                                                onClick={() => handleSendReminder(customer.id)}
                                                disabled={sendingId === customer.id}
                                                className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:text-white hover:bg-emerald-500 border border-emerald-500/20 transition-all disabled:opacity-50"
                                                title="Send LINE Reminder"
                                            >
                                                {sendingId === customer.id ? <Loader2 size={18} className="animate-spin" /> : <MessageSquare size={18} />}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onEdit?.(customer)}
                                            className="p-2.5 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5 transition-all"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete?.(customer.id)}
                                            className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:text-white hover:bg-red-500 border border-red-500/20 transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <button className="p-2.5 text-zinc-500 hover:text-white transition-colors group-hover:hidden">
                                        <MoreVertical size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
