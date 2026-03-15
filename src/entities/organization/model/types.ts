export type OrganizationStatus = 'pending' | 'active' | 'suspended';

export interface Organization {
    id: string;
    name: string;
    slug: string;
    status: OrganizationStatus;
    created_at: string;
    updated_at: string;
}

export interface Profile {
    id: string;
    organization_id: string | null;
    full_name: string | null;
    role: 'super_admin' | 'owner' | 'clerk';
    created_at: string;
    updated_at: string;
}
