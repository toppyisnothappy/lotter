import { db } from '@/shared/lib/db'
import { transactions, customers, products, payments } from '@/shared/lib/db/schema'
import { eq, sql, and, gte, desc } from 'drizzle-orm'

export async function getDashboardStats(organizationId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    try {
        // Today Sales
        const [salesResult] = await db.select({
            total: sql<string>`SUM(net_amount)`
        })
            .from(transactions)
            .where(
                and(
                    eq(transactions.organizationId, organizationId),
                    gte(transactions.createdAt, today)
                )
            )

        // Active Debt
        const [debtResult] = await db.select({
            total: sql<string>`SUM(total_balance)`
        })
            .from(customers)
            .where(eq(customers.organizationId, organizationId))

        // Inventory Level
        const [inventoryResult] = await db.select({
            total: sql<string>`SUM(stock_quantity)`
        })
            .from(products)
            .where(eq(products.organizationId, organizationId))

        // New Customers (Last 7 days)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        const [customerResult] = await db.select({
            count: sql<number>`COUNT(*)`
        })
            .from(customers)
            .where(
                and(
                    eq(customers.organizationId, organizationId),
                    gte(customers.createdAt, weekAgo)
                )
            )

        return {
            todaySales: Number(salesResult?.total || 0),
            activeDebt: Number(debtResult?.total || 0),
            inventoryLevel: Number(inventoryResult?.total || 0),
            newCustomers: Number(customerResult?.count || 0)
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        return {
            todaySales: 0,
            activeDebt: 0,
            inventoryLevel: 0,
            newCustomers: 0
        }
    }
}

export async function getRecentTransactions(organizationId: string, limit = 5) {
    try {
        const rows = await db.select({
            id: transactions.id,
            totalAmount: transactions.totalAmount,
            netAmount: transactions.netAmount,
            status: transactions.status,
            createdAt: transactions.createdAt,
            paymentType: payments.paymentType
        })
            .from(transactions)
            .leftJoin(payments, eq(transactions.id, payments.transactionId))
            .where(eq(transactions.organizationId, organizationId))
            .orderBy(desc(transactions.createdAt))
            .limit(limit)

        return rows
    } catch (error) {
        console.error('Error fetching recent transactions:', error)
        return []
    }
}
