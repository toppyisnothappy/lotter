import { getCustomerById } from "@/entities/customer/api"
import { getOrganizationBySlug } from "@/entities/organization/api"
import { CustomerProfile } from "@/features/customer-crm/ui/CustomerProfile"
import { notFound } from "next/navigation"

export default async function CustomerProfilePage({ params }: { params: Promise<{ slug: string, customerId: string }> }) {
    const { slug, customerId } = await params
    const organization = await getOrganizationBySlug(slug)

    if (!organization) {
        notFound()
    }

    // fetch customer for this tenant
    const customer = await getCustomerById(organization.id, customerId)

    if (!customer) {
        notFound()
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <CustomerProfile
                customer={customer}
                organizationId={organization.id}
                organizationSlug={slug}
            />
        </div>
    )
}
