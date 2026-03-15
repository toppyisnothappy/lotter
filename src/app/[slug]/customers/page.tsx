import { getCustomers, searchCustomers } from "@/entities/customer/api"
import { getOrganizationBySlug } from "@/entities/organization/api"
import { CustomerHub } from "@/features/customer-crm/ui/CustomerHub"
import { notFound } from "next/navigation"

export default async function CustomersPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams?: Promise<{ q?: string }>
}) {
    const { slug } = await params
    const q = (await searchParams)?.q || ""

    const organization = await getOrganizationBySlug(slug)

    if (!organization) {
        notFound()
    }

    // fetch customers for this tenant
    const customers = q ? await searchCustomers(organization.id, q) : await getCustomers(organization.id)

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <CustomerHub initialCustomers={customers} organizationId={organization.id} />
        </div>
    )
}
