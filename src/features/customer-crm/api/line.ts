"use server"

import { sendLinePushMessage } from "@/shared/lib/line/api"
import { db } from "@/shared/lib/db"
import { customers } from "@/shared/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function sendInstallmentReminderAction(organizationId: string, customerId: string) {
    try {
        // 1. Fetch customer details
        const [customer] = await db.select()
            .from(customers)
            .where(and(
                eq(customers.id, customerId),
                eq(customers.organizationId, organizationId)
            ))
            .limit(1)

        if (!customer) throw new Error("Customer not found")
        if (!customer.lineId) throw new Error("Customer does not have a linked LINE account")

        const balance = parseFloat(customer.totalBalance as any)
        if (balance <= 0) throw new Error("Customer has no outstanding balance")

        // 2. Format message
        const message = `Hello ${customer.fullName},\n\nThis is a friendly reminder from Lotter regarding your outstanding installment balance of $${balance.toFixed(2)}.\n\nPlease visit our store to settle your payment. Thank you!`

        // 3. Send message
        const result = await sendLinePushMessage(customer.lineId, message)

        if (!result.success) {
            throw new Error(result.error || "Failed to send LINE reminder")
        }

        return { success: true }
    } catch (error: any) {
        console.error("Error in sendInstallmentReminderAction:", error)
        return { error: error.message || "Failed to send reminder" }
    }
}
