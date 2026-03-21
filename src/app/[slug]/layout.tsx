import { ShopSidebar } from "@/widgets/navbar/ui/ShopSidebar"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function ShopLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ slug: string }>
}) {
    const session = await auth()
    const { slug } = await params

    if (!session?.user) {
        redirect(`/login?callbackUrl=/${slug}`)
    }

    return (
        <div className="flex min-h-screen bg-black text-white">
            <ShopSidebar slug={slug} />
            <div className="flex-1 lg:ml-64 bg-gradient-to-b from-[#0F172A] to-[#020617]">
                {children}
            </div>
        </div>
    )
}
