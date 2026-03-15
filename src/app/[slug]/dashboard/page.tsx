import { BarChart3, ArrowUpRight } from "lucide-react"
import { cn } from "@/shared/lib/utils/utils"
import { getOrganizationBySlug } from "@/entities/organization/api"
import { getDashboardStats, getRecentTransactions } from "@/features/dashboard/api/queries"
import { notFound } from "next/navigation"

export default async function ShopDashboard({ params }: { params: { slug: string } }) {
    const { slug } = await params
    const organization = await getOrganizationBySlug(slug)

    if (!organization) {
        notFound()
    }

    const [stats, recentTransactions] = await Promise.all([
        getDashboardStats(organization.id),
        getRecentTransactions(organization.id)
    ])

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="flex items-end justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-display font-bold">Store Overview</h1>
                    <p className="text-zinc-500 font-medium mt-1">
                        Welcome back, <span className="text-white font-bold">{organization.name}</span>. Here is what is happening today.
                    </p>
                </div>
                <div className="flex gap-4">
                    <a
                        href={`/${slug}/pos`}
                        className="rounded-xl bg-white px-8 py-3 text-sm font-bold text-black shadow-xl transition-all hover:scale-105 active:scale-95"
                    >
                        Launch POS Engine
                    </a>
                </div>
            </header>

            {/* Shop Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StoreStat
                    label="Today Sales"
                    value={`$${stats.todaySales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    trend="Live data from POS"
                />
                <StoreStat
                    label="Active Debt"
                    value={`$${stats.activeDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    trend="Total customer balance"
                    color="red"
                />
                <StoreStat
                    label="Inventory Level"
                    value={`${stats.inventoryLevel} items`}
                    trend="Total stock quantity"
                />
                <StoreStat
                    label="New Customers"
                    value={stats.newCustomers.toString()}
                    trend="Joined in last 7 days"
                />
            </div>

            {/* Activity Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass rounded-[2.5rem] p-10 border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-display font-bold">Recent Transactions</h2>
                        <button className="text-xs font-black text-primary-400 hover:text-primary-300 tracking-widest uppercase">VIEW ALL</button>
                    </div>
                    <div className="space-y-4">
                        {recentTransactions.length === 0 ? (
                            <div className="p-10 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                                <p className="text-zinc-500 font-medium">No transactions recorded yet.</p>
                            </div>
                        ) : (
                            recentTransactions.map((trx) => (
                                <div key={trx.id} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all cursor-pointer">
                                    <div className="flex items-center gap-5">
                                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                                            <ArrowUpRight size={24} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-lg">Sale #{trx.id.split('-')[0].toUpperCase()}</div>
                                            <div className="text-sm text-zinc-500 font-medium">
                                                {new Date(trx.createdAt).toLocaleDateString()} &bull; {trx.paymentType ? trx.paymentType.toUpperCase() : 'N/A'} Payment
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-display font-bold text-white text-xl">
                                            ${Number(trx.netAmount).toFixed(2)}
                                        </div>
                                        <div className={cn(
                                            "text-[10px] uppercase font-black tracking-[0.1em] mt-1 px-2 py-0.5 rounded-full inline-block",
                                            trx.status === 'complete' ? "text-emerald-500 bg-emerald-500/10" :
                                                trx.status === 'partial' ? "text-amber-500 bg-amber-500/10" : "text-red-500 bg-red-500/10"
                                        )}>
                                            {trx.status}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="glass rounded-[2.5rem] p-10 border-white/5 space-y-8 shadow-2xl bg-white/[0.01]">
                    <div>
                        <h2 className="text-2xl font-display font-bold mb-2">Quick Actions</h2>
                        <p className="text-sm text-zinc-500 font-medium">Frequently used operations</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <ActionButton label="Add New Product" />
                        <ActionButton label="Register Customer" />
                        <ActionButton label="Record Payment" />
                        <ActionButton label="Export Daily Report" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function StoreStat({ label, value, trend, color }: { label: string, value: string, trend: string, color?: "red" | "green" }) {
    return (
        <div className="glass p-8 rounded-[2rem] border-white/5 transition-all hover:border-white/10 hover:shadow-2xl">
            <p className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest">{label}</p>
            <h3 className="mt-4 text-4xl font-display font-black text-white tracking-tight">{value}</h3>
            <p className={cn(
                "mt-3 text-xs font-bold px-2 py-1 rounded-lg inline-block",
                color === "red" ? "text-red-400 bg-red-400/10" : "text-emerald-400 bg-emerald-400/10"
            )}>{trend}</p>
        </div>
    )
}

function ActionButton({ label }: { label: string }) {
    return (
        <button className="group w-full flex items-center justify-between px-6 py-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all font-bold text-white shadow-lg">
            <span className="text-sm">{label}</span>
            <ArrowUpRight className="h-4 w-4 text-zinc-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
    )
}
