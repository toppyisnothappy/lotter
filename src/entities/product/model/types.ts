export interface Product {
    id: string;
    organization_id: string;
    sku: string;
    name: string;
    description: string | null;
    price: number;
    stock_quantity: number;
    min_stock_level: number;
    category: string | null;
    created_at: string;
    updated_at: string;
}

export type CreateProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type UpdateProductInput = Partial<CreateProductInput>;
