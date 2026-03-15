'use server'

import { searchProducts, getProductBySku, getTopSellingProducts, getCategories } from '@/entities/product/api'
import { Product } from '@/entities/product/model/types'

export async function searchProductAction(
    organizationId: string,
    query: string,
    limit: number = 20,
    category?: string
): Promise<{ products?: Product[], error?: string }> {
    try {
        const products = await searchProducts(organizationId, query.trim(), limit, category)
        return { products }
    } catch (error: any) {
        console.error('Error in searchProductAction:', error)
        return { error: error.message || 'Failed to search products' }
    }
}

export async function getTopSellingProductsAction(organizationId: string, limit: number = 8): Promise<{ products?: Product[], error?: string }> {
    try {
        const products = await getTopSellingProducts(organizationId, limit)
        return { products }
    } catch (error: any) {
        console.error('Error in getTopSellingProductsAction:', error)
        return { error: error.message || 'Failed to fetch top selling products' }
    }
}

export async function getCategoriesAction(organizationId: string): Promise<{ categories?: string[], error?: string }> {
    try {
        const categories = await getCategories(organizationId)
        return { categories }
    } catch (error: any) {
        console.error('Error in getCategoriesAction:', error)
        return { error: error.message || 'Failed to fetch categories' }
    }
}

export async function getProductBySkuAction(organizationId: string, sku: string): Promise<{ product?: Product | null, error?: string }> {
    try {
        if (!sku || sku.trim().length === 0) {
            return { product: null }
        }

        const product = await getProductBySku(organizationId, sku.trim())
        return { product }
    } catch (error: any) {
        console.error('Error in getProductBySkuAction:', error)
        return { error: error.message || 'Failed to get product by SKU' }
    }
}
