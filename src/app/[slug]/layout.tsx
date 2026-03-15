import { ShopSidebar } from "@/widgets/navbar/ui/ShopSidebar"

export default async function ShopLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    return (
        <div className="flex min-h-screen bg-black text-white">
            <ShopSidebar slug={slug} />
            <div className="flex-1 lg:ml-64 bg-gradient-to-b from-[#0F172A] to-[#020617]">
                {children}
            </div>
        </div>
    )
}
