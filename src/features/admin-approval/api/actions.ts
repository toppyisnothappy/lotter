'use server'
import { db } from '@/shared/lib/db'
import { organizations } from '@/shared/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

// TODO: Replace with Auth.js session check in Phase 4
async function checkSuperAdmin() {
    // Placeholder for authorization logic
    return true;
}

export async function approveOrganization(id: string) {
    if (!await checkSuperAdmin()) {
        throw new Error('Unauthorized: Super Admin access required')
    }

    try {
        await db.update(organizations)
            .set({ status: 'active' })
            .where(eq(organizations.id, id))

        revalidatePath('/admin/dashboard')
        return { success: true }
    } catch (error: any) {
        console.error('Error approving organization:', error)
        return { error: error.message || 'An unexpected error occurred' }
    }
}

export async function suspendOrganization(id: string) {
    if (!await checkSuperAdmin()) {
        throw new Error('Unauthorized: Super Admin access required')
    }

    try {
        await db.update(organizations)
            .set({ status: 'suspended' })
            .where(eq(organizations.id, id))

        revalidatePath('/admin/dashboard')
        return { success: true }
    } catch (error: any) {
        console.error('Error suspending organization:', error)
        return { error: error.message || 'An unexpected error occurred' }
    }
}
