import { POSTerminal } from "@/features/pos/ui/POSTerminal"
import { notFound } from "next/navigation"
import { db } from "@/shared/lib/db"
import { organizations } from "@/shared/lib/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"

export default async function POSPage({ params }: { params: { slug: string } }) {
    const { slug } = await params
    const session = await auth()

    // Get Organization
    const [org] = await db.select().from(organizations).where(eq(organizations.slug, slug)).limit(1)

    if (!org) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-black text-zinc-400 p-8 pb-20 sm:p-12 sm:pb-12 max-w-[1600px] mx-auto pt-24">
            <POSTerminal organizationId={org.id} />
        </main>
    )
}
