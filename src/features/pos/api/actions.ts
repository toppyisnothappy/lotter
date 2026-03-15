'use server'

import { db } from '@/shared/lib/db'
import { transactions, transactionItems, products, payments, customers } from '@/shared/lib/db/schema'
import { ProcessTransactionInput } from '@/entities/transaction/model/types'
import { eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function processTransaction(input: ProcessTransactionInput) {
    const { organization_id, customer_id, items, discount_amount = 0, payment_amount, payment_type } = input

    // 1. Calculate totals
    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
    const netAmount = totalAmount - discount_amount
    const isPartial = payment_amount < netAmount
    const status = (payment_type === 'installment' || isPartial) ? 'partial' : 'complete'

    if (payment_type === 'installment' && !customer_id) {
        return { error: 'Customer is required for installment transactions' }
    }

    const transactionId = crypto.randomUUID()

    try {
        return await db.transaction(async (tx) => {
            // 2. Create Transaction Header
            await tx.insert(transactions).values({
                id: transactionId,
                organizationId: organization_id,
                customerId: customer_id,
                totalAmount: totalAmount.toString(),
                discountAmount: discount_amount.toString(),
                netAmount: netAmount.toString(),
                status: status,
            })

            // 3. Create Items & Update Stock
            for (const item of items) {
                // Insert line item
                await tx.insert(transactionItems).values({
                    transactionId,
                    productId: item.product_id,
                    sku: item.sku,
                    name: item.name,
                    quantity: item.quantity,
                    unitPrice: item.unit_price.toString(),
                    totalPrice: (item.quantity * item.unit_price).toString(),
                })

                // Decrement stock
                await tx.update(products)
                    .set({
                        stockQuantity: sql`${products.stockQuantity} - ${item.quantity}`
                    })
                    .where(eq(products.id, item.product_id))
            }

            // 4. Record Payment
            await tx.insert(payments).values({
                organizationId: organization_id,
                customerId: customer_id ? customer_id : null,
                transactionId,
                amount: payment_amount.toString(),
                paymentType: payment_type,
            })

            // 5. If Debt exists (partial payment), update customer balance
            if (customer_id && isPartial) {
                const debtAmount = netAmount - payment_amount
                await tx.update(customers)
                    .set({
                        totalBalance: sql`${customers.totalBalance} + ${debtAmount.toString()}`
                    })
                    .where(eq(customers.id, customer_id))
            }

            try {
                revalidatePath('/[slug]/dashboard', 'page')
                revalidatePath('/[slug]/inventory', 'page')
            } catch (e) {
                // Ignore revalidation errors in non-request contexts (e.g. test scripts)
            }

            return { success: true, transactionId }
        })
    } catch (error: any) {
        console.error('POS Transaction Failed:', error)
        return { error: error.message || 'Transaction failed' }
    }
}
