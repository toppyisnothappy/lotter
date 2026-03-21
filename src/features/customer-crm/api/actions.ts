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

export async function settleTransactionAction(organizationId: string, customerId: string, transactionId: string, amountToSettle: number) {
    try {
        await db.transaction(async (tx) => {
            // 1. Record the payment linked to the transaction
            await tx.insert(payments).values({
                id: crypto.randomUUID(),
                organizationId,
                customerId,
                transactionId,
                amount: amountToSettle.toString(),
                paymentType: 'installment',
            });

            // 2. Update transaction status to complete
            await tx.update(transactions)
                .set({ status: 'complete' })
                .where(eq(transactions.id, transactionId));

            // 3. Subtract from customer total balance
            const [customer] = await tx.select().from(customers)
                .where(and(eq(customers.id, customerId), eq(customers.organizationId, organizationId)))
                .limit(1);

            if (!customer) throw new Error("Customer not found");

            const newBalance = Math.max(0, parseFloat(customer.totalBalance as any) - amountToSettle);
            await tx.update(customers)
                .set({ totalBalance: newBalance.toString() })
                .where(eq(customers.id, customerId));
        });

        revalidatePath('/[slug]/customers/[customerId]', 'page');
        revalidatePath('/[slug]/customers', 'page');
        return { success: true };
    } catch (error: any) {
        console.error("Error settling transaction:", error);
        return { error: error.message || 'Failed to settle transaction' };
    }
}

export async function recordItemPaymentAction(
    organizationId: string,
    customerId: string,
    transactionId: string,
    amount: number,
    isFullSettlement: boolean = false
) {
    try {
        await db.transaction(async (tx) => {
            // 1. Record the payment linked to the transaction
            await tx.insert(payments).values({
                id: crypto.randomUUID(),
                organizationId,
                customerId,
                transactionId,
                amount: amount.toString(),
                paymentType: 'installment',
            });

            // 2. Check if this payment completes the transaction
            if (isFullSettlement) {
                await tx.update(transactions)
                    .set({ status: 'complete' })
                    .where(eq(transactions.id, transactionId));
            } else {
                // Fetch transaction to check total vs paid
                const [t] = await tx.select().from(transactions).where(eq(transactions.id, transactionId)).limit(1);
                if (!t) throw new Error("Transaction not found");

                const allPayments = await tx.select().from(payments).where(eq(payments.transactionId, transactionId));
                const totalPaid = allPayments.reduce((sum, p) => sum + parseFloat(p.amount as any), 0);

                if (totalPaid >= parseFloat(t.netAmount as any)) {
                    await tx.update(transactions)
                        .set({ status: 'complete' })
                        .where(eq(transactions.id, transactionId));
                }
            }

            // 3. Subtract from customer total balance
            const [customer] = await tx.select().from(customers)
                .where(and(eq(customers.id, customerId), eq(customers.organizationId, organizationId)))
                .limit(1);

            if (!customer) throw new Error("Customer not found");

            const newBalance = Math.max(0, parseFloat(customer.totalBalance as any) - amount);
            await tx.update(customers)
                .set({ totalBalance: newBalance.toString() })
                .where(eq(customers.id, customerId));
        });

        revalidatePath('/[slug]/customers/[customerId]', 'page');
        revalidatePath('/[slug]/customers', 'page');
        return { success: true };
    } catch (error: any) {
        console.error("Error recording item payment:", error);
        return { error: error.message || 'Failed to record item payment' };
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
            .limit(100);

        // Group payments by transactionId to calculate stats and collect payment details
        const transactionStats = customerPayments.reduce((acc, p) => {
            if (p.transactionId) {
                if (!acc[p.transactionId]) {
                    acc[p.transactionId] = { paid: 0, latest: new Date(0), details: [] };
                }
                acc[p.transactionId].paid += parseFloat(p.amount as any);
                acc[p.transactionId].details.push({
                    amount: parseFloat(p.amount as any),
                    createdAt: p.createdAt
                });
                const pDate = new Date(p.createdAt as any);
                if (pDate > acc[p.transactionId].latest) {
                    acc[p.transactionId].latest = pDate;
                }
            }
            return acc;
        }, {} as Record<string, { paid: number, latest: Date, details: any[] }>);

        // Map and merge
        const history: any[] = [
            ...customerTransactions.map(t => {
                const stats = transactionStats[t.id] || { paid: 0, latest: new Date(0), details: [] };
                const paid = stats.paid;
                const net = parseFloat(t.netAmount as any);
                const remaining = Math.max(0, net - paid);
                const now = new Date();
                const due = t.dueDate ? new Date(t.dueDate as any) : null;

                return {
                    ...t,
                    _type: 'purchase',
                    paidAmount: paid,
                    remainingBalance: remaining,
                    isOverdue: remaining > 0 && due && now > due,
                    isPaidInTime: t.status === 'complete' && due && stats.latest <= due,
                    daysOverdue: (remaining > 0 && due && now > due)
                        ? Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
                        : 0,
                    payments: stats.details
                };
            }),
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
