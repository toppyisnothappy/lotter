import { getProducts } from "@/entities/product/api"
import { getOrganizationBySlug } from "@/entities/organization/api"
import { InventoryHub } from "@/features/inventory/ui/InventoryHub"
import { notFound } from "next/navigation"

export default async function InventoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const organization = await getOrganizationBySlug(slug)

    if (!organization) {
        notFound()
    }

    const products = await getProducts(organization.id)

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <InventoryHub
                initialProducts={products}
                organizationId={organization.id}
            />
        </div>
    )
}
