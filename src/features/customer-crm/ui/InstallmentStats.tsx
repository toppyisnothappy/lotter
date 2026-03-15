"use client"

import { Customer } from "@/entities/customer/model/types"
import { Wallet, Users, AlertCircle } from "lucide-react"

interface InstallmentStatsProps {
    customers: Customer[]
}

export function InstallmentStats({ customers }: InstallmentStatsProps) {
    const customersWithDebt = customers.filter(c => c.total_balance > 0)
    const totalExposure = customers.reduce((sum, c) => sum + c.total_balance, 0)
    const averageDebt = customersWithDebt.length > 0 ? totalExposure / customersWithDebt.length : 0

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass p-8 rounded-[2rem] border-white/5 flex items-center gap-6 group hover:border-primary-500/20 transition-all">
                <div className="h-14 w-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400 border border-primary-500/20 group-hover:scale-110 transition-transform">
                    <Wallet size={28} />
                </div>
                <div>
                    <p className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest leading-none mb-2">Full Exposure</p>
                    <h3 className="text-3xl font-display font-black text-white">${totalExposure.toFixed(2)}</h3>
                </div>
            </div>

            <div className="glass p-8 rounded-[2rem] border-white/5 flex items-center gap-6 group hover:border-emerald-500/20 transition-all">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <Users size={28} />
                </div>
                <div>
                    <p className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest leading-none mb-2">Active Debtors</p>
                    <h3 className="text-3xl font-display font-black text-white">{customersWithDebt.length} <span className="text-sm font-bold text-zinc-500 ml-1">Buyers</span></h3>
                </div>
            </div>

            <div className="glass p-8 rounded-[2rem] border-white/5 flex items-center gap-6 group hover:border-red-500/20 transition-all">
                <div className="h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20 group-hover:scale-110 transition-transform">
                    <AlertCircle size={28} />
                </div>
                <div>
                    <p className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest leading-none mb-2">AVG Ticket Debt</p>
                    <h3 className="text-3xl font-display font-black text-white">${averageDebt.toFixed(2)}</h3>
                </div>
            </div>
        </div>
    )
}
