import { BarChart3, Search, LayoutDashboard, Building2, Users, Settings, Bell } from "lucide-react"
import { cn } from "@/shared/lib/utils/utils"
import { SidebarItem } from "./_components/SidebarItem"
import { StatCard } from "./_components/StatCard"
import { OrganizationTable } from "@/features/admin-approval/ui/OrganizationTable"
import { getAllOrganizations } from "@/entities/organization/api"

export default async function AdminDashboard() {
    const organizations = await getAllOrganizations()
    const pendingCount = organizations.filter(o => o.status === 'pending').length

    return (
        <div className="flex min-h-screen bg-black text-white">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r border-white/5 bg-zinc-950/50 p-6 lg:flex">
                <div className="flex items-center gap-2 mb-10">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-display font-bold">Lotter Admin</span>
                </div>

                <nav className="flex flex-col gap-2">
                    <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" />
                    <SidebarItem icon={<Building2 size={20} />} label="Organizations" active count={pendingCount} />
                    <SidebarItem icon={<Users size={20} />} label="Users" />
                </nav>

                <div className="mt-auto pt-6 border-t border-white/5">
                    <SidebarItem icon={<Settings size={20} />} label="Settings" />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64">
                {/* Top Header */}
                <header className="flex h-16 items-center justify-between border-b border-white/5 bg-zinc-950/30 px-8 sticky top-0 z-20 backdrop-blur-md">
                    <h1 className="text-lg font-semibold capitalize">Organizations</h1>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-zinc-400 hover:text-white relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-violet-500 ring-2 ring-black" />
                        </button>
                        <div className="h-8 w-8 rounded-full bg-violet-500/20 border border-violet-500/50 flex items-center justify-center text-violet-400 text-xs font-bold">
                            SA
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <StatCard label="Total Requests" value={organizations.length.toString()} change="+12%" />
                        <StatCard label="Pending Approval" value={pendingCount.toString()} change="Action required" highlight />
                        <StatCard label="Live Organizations" value={organizations.filter(o => o.status === 'active').length.toString()} change="+4 this week" />
                    </div>

                    {/* Table Section */}
                    <div className="glass rounded-3xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold">Business Approval Pipeline</h2>
                                <p className="text-sm text-zinc-400">Review and manage new shop registrations.</p>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search businesses..."
                                    className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-violet-500 transition-all w-full md:w-64"
                                />
                            </div>
                        </div>

                        <OrganizationTable organizations={organizations} />
                    </div>
                </div>
            </main>
        </div>
    )
}
