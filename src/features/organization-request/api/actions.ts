'use server'
import { db } from '@/shared/lib/db'
import { organizations } from '@/shared/lib/db/schema'

export async function requestOrganization(formData: FormData) {
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string

    if (!name || !slug) {
        return { error: 'Name and slug are required' }
    }

    try {
        await db.insert(organizations).values({
            name,
            slug,
            status: 'pending',
        })

        return { success: true }
    } catch (error: any) {
        console.error('Error requesting organization:', error)
        return { error: error.message || 'An unexpected error occurred' }
    }
}
