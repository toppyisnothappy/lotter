export interface Customer {
    id: string;
    organization_id: string;
    full_name: string;
    phone: string | null;
    email: string | null;
    line_id: string | null;
    total_balance: number;
    created_at: string;
    updated_at: string;
}

export type CreateCustomerInput = Omit<Customer, 'id' | 'created_at' | 'updated_at'>;
export type UpdateCustomerInput = Partial<CreateCustomerInput>;
