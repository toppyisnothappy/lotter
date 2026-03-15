import { db } from '@/shared/lib/db'
import { organizations } from '@/shared/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { Organization } from '../model/types'

export async function getPendingOrganizations(): Promise<Organization[]> {
    try {
        const rows = await db.select().from(organizations)
            .where(eq(organizations.status, 'pending'))
            .orderBy(desc(organizations.createdAt))

        return rows.map(r => ({
            ...r,
            created_at: r.createdAt.toISOString(),
            updated_at: r.updatedAt.toISOString(),
        })) as unknown as Organization[]
    } catch (error) {
        console.error('Error fetching pending organizations:', error)
        return []
    }
}

export async function getAllOrganizations(): Promise<Organization[]> {
    try {
        const rows = await db.select().from(organizations)
            .orderBy(desc(organizations.createdAt))

        return rows.map(r => ({
            ...r,
            created_at: r.createdAt.toISOString(),
            updated_at: r.updatedAt.toISOString(),
        })) as unknown as Organization[]
    } catch (error) {
        console.error('Error fetching organizations:', error)
        return []
    }
}

export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
    try {
        const [row] = await db.select().from(organizations)
            .where(eq(organizations.slug, slug))
            .limit(1)

        if (!row) return null

        return {
            ...row,
            created_at: row.createdAt.toISOString(),
            updated_at: row.updatedAt.toISOString(),
        } as unknown as Organization
    } catch (error) {
        console.error('Error fetching organization by slug:', error)
        return null
    }
}
