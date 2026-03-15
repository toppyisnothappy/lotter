'use server'

import { createCustomer, updateCustomer, getCustomerById } from '@/entities/customer/api'
import { CreateCustomerInput, UpdateCustomerInput } from '@/entities/customer/model/types'
import { revalidatePath } from 'next/cache'
import { db } from '@/shared/lib/db'
import { customers, payments, transactions } from '@/shared/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'

export async function createCustomerAction(organizationId: string, input: CreateCustomerInput) {
    try {
        const customer = await createCustomer(organizationId, input)
        if (!customer) throw new Error('Failed to create customer')

        revalidatePath('/[slug]/customers', 'page')
        return { success: true, customer }
    } catch (error: any) {
        console.error('Error in createCustomerAction:', error)
        return { error: error.message || 'An unexpected error occurred' }
    }
}

export async function updateCustomerAction(organizationId: string, id: string, input: UpdateCustomerInput) {
    try {
        const customer = await updateCustomer(organizationId, id, input)
        if (!customer) throw new Error('Failed to update customer')

        revalidatePath('/[slug]/customers', 'page')
        return { success: true, customer }
    } catch (error: any) {
        console.error('Error in updateCustomerAction:', error)
        return { error: error.message || 'An unexpected error occurred' }
    }
}

export async function recordPaymentAction(organizationId: string, customerId: string, amount: number) {
    try {
        await db.transaction(async (tx) => {
            // Create a payment record
            await tx.insert(payments).values({
                id: crypto.randomUUID(),
                organizationId,
                customerId,
                amount: amount.toString(),
                paymentType: 'installment',
            });

            // Fetch current balance
            const [customer] = await tx.select().from(customers).where(and(eq(customers.id, customerId), eq(customers.organizationId, organizationId))).limit(1);
            if (!customer) throw new Error("Customer not found");

            const newBalance = parseFloat(customer.totalBalance as any) - amount;
            if (newBalance < 0) throw new Error("Payment exceeds outstanding debt");

            // Update balance
            await tx.update(customers).set({ totalBalance: newBalance.toString() }).where(eq(customers.id, customerId));
        });

        revalidatePath('/[slug]/customers/[customerId]', 'page');
        revalidatePath('/[slug]/customers', 'page');
        return { success: true };
    } catch (error: any) {
        console.error("Error recording payment:", error);
        return { error: error.message || 'Failed to record payment' };
    }
}

export async function getCustomerHistoryAction(organizationId: string, customerId: string) {
    try {
        const customerTransactions = await db.select().from(transactions)
            .where(and(eq(transactions.customerId, customerId), eq(transactions.organizationId, organizationId)))
            .orderBy(desc(transactions.createdAt))
            .limit(50);

        const customerPayments = await db.select().from(payments)
            .where(and(eq(payments.customerId, customerId), eq(payments.organizationId, organizationId)))
            .orderBy(desc(payments.createdAt))
            .limit(50);

        // Map and merge
        const history: any[] = [
            ...customerTransactions.map(t => ({ ...t, _type: 'purchase' })),
            ...customerPayments.map(p => ({ ...p, _type: 'payment' }))
        ].sort((a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime());

        return { success: true, history };
    } catch (error: any) {
        console.error("Error fetching history:", error);
        return { error: error.message || 'Failed to fetch history' };
    }
}

export async function searchCustomersAction(organizationId: string, query: string, limit: number = 10) {
    try {
        const { searchCustomers } = await import('@/entities/customer/api')
        const results = await searchCustomers(organizationId, query, limit)
        return { success: true, results }
    } catch (error: any) {
        console.error('Error searching customers:', error)
        return { error: error.message || 'Failed to search customers' }
    }
}
