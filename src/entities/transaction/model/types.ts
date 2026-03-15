export interface Transaction {
    id: string;
    organization_id: string;
    customer_id: string | null;
    clerk_id: string | null;
    total_amount: number;
    discount_amount: number;
    net_amount: number;
    status: 'complete' | 'partial' | 'cancelled';
    created_at: string;
    updated_at: string;
}

export interface TransactionItem {
    id: string;
    transaction_id: string;
    product_id: string | null;
    sku: string;
    name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    created_at: string;
}

export interface ProcessTransactionInput {
    organization_id: string;
    customer_id?: string;
    items: {
        product_id: string;
        sku: string;
        name: string;
        quantity: number;
        unit_price: number;
    }[];
    discount_amount?: number;
    payment_amount: number;
    payment_type: 'cash' | 'card' | 'installment' | 'other';
}
