import { db } from '@/shared/lib/db'
import { products } from '@/shared/lib/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { Product } from '../model/types'

function mapToEntity(row: any): Product {
    return {
        id: row.id,
        organization_id: row.organizationId,
        sku: row.sku,
        name: row.name,
        description: row.description,
        price: parseFloat(row.price),
        stock_quantity: row.stockQuantity,
        min_stock_level: row.minStockLevel,
        category: row.category,
        created_at: row.createdAt.toISOString(),
        updated_at: row.updatedAt.toISOString(),
    }
}

export async function getProducts(organizationId: string): Promise<Product[]> {
    try {
        const rows = await db.select().from(products)
            .where(eq(products.organizationId, organizationId))
            .orderBy(products.name)

        return rows.map(mapToEntity)
    } catch (error) {
        console.error('Error fetching products:', error)
        return []
    }
}

export async function getProductBySku(organizationId: string, sku: string): Promise<Product | null> {
    try {
        const [row] = await db.select().from(products)
            .where(and(
                eq(products.organizationId, organizationId),
                eq(products.sku, sku)
            ))
            .limit(1)

        return row ? mapToEntity(row) : null
    } catch (error) {
        console.error('Error fetching product by SKU:', error)
        return null
    }
}

export async function searchProducts(organizationId: string, query: string, limit: number = 20, category?: string): Promise<Product[]> {
    try {
        const searchPattern = `%${query}%`;
        const conditions = [
            eq(products.organizationId, organizationId),
            sql`(${products.name} LIKE ${searchPattern} OR ${products.sku} LIKE ${searchPattern})`
        ];

        if (category && category !== 'All') {
            conditions.push(eq(products.category, category));
        }

        const rows = await db.select().from(products)
            .where(and(...conditions))
            .orderBy(products.name)
            .limit(limit);

        return rows.map(mapToEntity);
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
}

export async function getCategories(organizationId: string): Promise<string[]> {
    try {
        const rows = await db.selectDistinct({ category: products.category })
            .from(products)
            .where(eq(products.organizationId, organizationId))
            .orderBy(products.category);

        return rows.map(r => r.category).filter((c): c is string => !!c);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

import { transactionItems } from '@/shared/lib/db/schema'
import { count } from 'drizzle-orm'

export async function getTopSellingProducts(organizationId: string, limit: number = 8): Promise<Product[]> {
    try {
        const rows = await db.select({
            id: products.id,
            organizationId: products.organizationId,
            sku: products.sku,
            name: products.name,
            description: products.description,
            price: products.price,
            stockQuantity: products.stockQuantity,
            minStockLevel: products.minStockLevel,
            category: products.category,
            createdAt: products.createdAt,
            updatedAt: products.updatedAt,
            salesCount: count(transactionItems.id)
        })
            .from(products)
            .leftJoin(transactionItems, eq(products.id, transactionItems.productId))
            .where(eq(products.organizationId, organizationId))
            .groupBy(products.id)
            .orderBy(sql`count(${transactionItems.id}) DESC`, products.name)
            .limit(limit);

        return rows.map(mapToEntity);
    } catch (error) {
        console.error('Error fetching top selling products:', error);
        return [];
    }
}
