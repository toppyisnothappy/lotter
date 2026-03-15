import { db } from '@/shared/lib/db'
import { customers } from '@/shared/lib/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { Customer, CreateCustomerInput, UpdateCustomerInput } from '../model/types'

function mapToEntity(row: any): Customer {
    return {
        id: row.id,
        organization_id: row.organizationId,
        full_name: row.fullName,
        phone: row.phone,
        email: row.email,
        line_id: row.lineId,
        total_balance: parseFloat(row.totalBalance),
        created_at: row.createdAt.toISOString(),
        updated_at: row.updatedAt.toISOString(),
    }
}

export async function getCustomers(organizationId: string): Promise<Customer[]> {
    try {
        const rows = await db.select().from(customers)
            .where(eq(customers.organizationId, organizationId))
            .orderBy(customers.fullName)

        return rows.map(mapToEntity)
    } catch (error) {
        console.error('Error fetching customers:', error)
        return []
    }
}

export async function getCustomerById(organizationId: string, id: string): Promise<Customer | null> {
    try {
        const [row] = await db.select().from(customers)
            .where(and(
                eq(customers.organizationId, organizationId),
                eq(customers.id, id)
            ))
            .limit(1)

        return row ? mapToEntity(row) : null
    } catch (error) {
        console.error('Error fetching customer by ID:', error)
        return null
    }
}

export async function searchCustomers(organizationId: string, query: string, limit: number = 20): Promise<Customer[]> {
    try {
        const searchPattern = `%${query}%`;
        const rows = await db.select().from(customers)
            .where(and(
                eq(customers.organizationId, organizationId),
                sql`(${customers.fullName} LIKE ${searchPattern} OR ${customers.email} LIKE ${searchPattern} OR ${customers.phone} LIKE ${searchPattern} OR ${customers.lineId} LIKE ${searchPattern})`
            ))
            .orderBy(customers.fullName)
            .limit(limit);

        return rows.map(mapToEntity);
    } catch (error) {
        console.error('Error searching customers:', error);
        return [];
    }
}

export async function createCustomer(organizationId: string, input: CreateCustomerInput): Promise<Customer | null> {
    try {
        const newId = crypto.randomUUID()
        await db.insert(customers).values({
            id: newId,
            organizationId,
            fullName: input.full_name,
            phone: input.phone,
            email: input.email,
            lineId: input.line_id,
            totalBalance: input.total_balance?.toString() || '0.00',
        })
        return getCustomerById(organizationId, newId)
    } catch (error) {
        console.error('Error creating customer:', error)
        return null
    }
}

export async function updateCustomer(organizationId: string, id: string, input: UpdateCustomerInput): Promise<Customer | null> {
    try {
        const updateData: any = {}
        if (input.full_name !== undefined) updateData.fullName = input.full_name
        if (input.phone !== undefined) updateData.phone = input.phone
        if (input.email !== undefined) updateData.email = input.email
        if (input.line_id !== undefined) updateData.lineId = input.line_id
        if (input.total_balance !== undefined) updateData.totalBalance = input.total_balance.toString()

        await db.update(customers)
            .set(updateData)
            .where(and(
                eq(customers.organizationId, organizationId),
                eq(customers.id, id)
            ))

        return getCustomerById(organizationId, id)
    } catch (error) {
        console.error('Error updating customer:', error)
        return null
    }
}
