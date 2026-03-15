import { z } from 'zod'

export const productSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    sku: z.string().min(1, 'SKU is required').max(100),
    description: z.string().max(1000).nullable().optional(),
    price: z.coerce.number().min(0, 'Price must be positive'),
    stock_quantity: z.coerce.number().int().min(0, 'Stock cannot be negative'),
    min_stock_level: z.coerce.number().int().min(0, 'Min stock level must be positive').default(5),
    category: z.string().max(255).nullable().optional(),
    organization_id: z.string().uuid().optional(),
})

// Optional validation values, used for forms
export const productFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    sku: z.string().min(1, 'SKU is required').max(100),
    description: z.string().max(1000).nullable().optional(),
    price: z.preprocess((val) => Number(val), z.number().min(0, 'Price must be positive')),
    stock_quantity: z.preprocess((val) => Number(val), z.number().int().min(0, 'Stock cannot be negative')),
    min_stock_level: z.preprocess((val) => Number(val), z.number().int().min(0, 'Min stock level must be positive').default(5)),
    category: z.string().max(255).nullable().optional(),
    organization_id: z.string().uuid().optional(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
