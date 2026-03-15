import { BarChart3, Package, Users, ShoppingCart, CreditCard, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { cn } from "@/shared/lib/utils/utils"

interface SidebarProps {
    slug: string
    activeSegment?: string
}

export function ShopSidebar({ slug, activeSegment }: SidebarProps) {
    const navItems = [
        { label: "Overview", icon: BarChart3, href: `/${slug}/dashboard`, segment: "dashboard" },
        { label: "Point of Sale", icon: ShoppingCart, href: `/${slug}/pos`, segment: "pos" },
        { label: "Inventory", icon: Package, href: `/${slug}/inventory`, segment: "inventory" },
        { label: "Customers", icon: Users, href: `/${slug}/customers`, segment: "customers" },
        { label: "Payments", icon: CreditCard, href: `/${slug}/payments`, segment: "payments" },
    ]

    return (
        <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r border-white/5 bg-[#0F172A]/80 p-6 backdrop-blur-xl lg:flex">
            <div className="flex items-center gap-3 mb-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                    <ShoppingCart className="h-6 w-6" />
                </div>
                <span className="text-xl font-display font-bold capitalize">{slug.replace(/-/g, ' ')}</span>
            </div>

            <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                            activeSegment === item.segment
                                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20"
                                : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="mt-auto flex flex-col gap-2 pt-6 border-t border-white/5">
                <Link
                    href={`/${slug}/settings`}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-400 transition-all hover:bg-white/5 hover:text-white"
                >
                    <Settings size={20} />
                    <span className="font-medium">Settings</span>
                </Link>
                <button className="flex items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition-all hover:bg-red-500/10">
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    )
}
