import { db } from "@/shared/lib/db"
import { organizations } from "@/shared/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"

export default async function OrganizationPage({ params }: { params: { slug: string } }) {
    const { slug } = await params

    // Validate organization exists
    const [org] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.slug, slug))
        .limit(1)

    if (!org) {
        notFound()
    }

    if (org.status !== 'active') {
        redirect('/') // Or a "Pending Approval" page
    }

    redirect(`/${slug}/dashboard`)
}
