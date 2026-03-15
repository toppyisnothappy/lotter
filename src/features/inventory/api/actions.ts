'use server'
import { db } from '@/shared/lib/db'
import { products } from '@/shared/lib/db/schema'
import { eq } from 'drizzle-orm'
import { CreateProductInput, UpdateProductInput } from '@/entities/product/model/types'
import { revalidatePath } from 'next/cache'

export async function createProduct(input: CreateProductInput) {
    try {
        const result = await db.insert(products).values({
            organizationId: input.organization_id,
            sku: input.sku,
            name: input.name,
            description: input.description,
            price: input.price.toString(),
            stockQuantity: input.stock_quantity,
            minStockLevel: input.min_stock_level,
            category: input.category,
        })

        revalidatePath('/[slug]/inventory', 'page')
        return { success: true }
    } catch (error: any) {
        console.error('Error creating product:', error)
        return { error: error.message || 'An unexpected error occurred' }
    }
}

export async function updateProduct(id: string, input: UpdateProductInput) {
    try {
        await db.update(products)
            .set({
                sku: input.sku,
                name: input.name,
                description: input.description,
                price: input.price?.toString(),
                stockQuantity: input.stock_quantity,
                minStockLevel: input.min_stock_level,
                category: input.category,
            })
            .where(eq(products.id, id))

        revalidatePath('/[slug]/inventory', 'page')
        return { success: true }
    } catch (error: any) {
        console.error('Error updating product:', error)
        return { error: error.message || 'An unexpected error occurred' }
    }
}

export async function deleteProduct(id: string) {
    try {
        await db.delete(products).where(eq(products.id, id))
        revalidatePath('/[slug]/inventory', 'page')
        return { success: true }
    } catch (error: any) {
        console.error('Error deleting product:', error)
        return { error: error.message || 'An unexpected error occurred' }
    }
}
