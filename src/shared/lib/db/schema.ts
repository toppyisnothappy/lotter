import { mysqlTable, varchar, decimal, int, timestamp, mysqlEnum, unique, primaryKey, datetime } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import type { AdapterAccountType } from 'next-auth/adapters';

// 0. Auth.js Schema (Required for NextAuth MySQL Adapter)
export const users = mysqlTable('user', {
    id: varchar('id', { length: 255 }).primaryKey(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull(),
    emailVerified: timestamp('emailVerified', { mode: 'date', fsp: 3 }),
    image: varchar('image', { length: 255 }),
    password: varchar('password', { length: 255 }), // Added for credentials login
});

export const accounts = mysqlTable('account', {
    userId: varchar('userId', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 255 }).$type<AdapterAccountType>().notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    refresh_token: varchar('refresh_token', { length: 255 }),
    access_token: varchar('access_token', { length: 255 }),
    expires_at: int('expires_at'),
    token_type: varchar('token_type', { length: 255 }),
    scope: varchar('scope', { length: 255 }),
    id_token: varchar('id_token', { length: 2048 }),
    session_state: varchar('session_state', { length: 255 }),
}, (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
}));

export const sessions = mysqlTable('session', {
    sessionToken: varchar('sessionToken', { length: 255 }).primaryKey(),
    userId: varchar('userId', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = mysqlTable('verificationToken', {
    identifier: varchar('identifier', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
}));

// 1. Organizations (Tenants)
export const organizations = mysqlTable('organizations', {
    id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    status: mysqlEnum('status', ['pending', 'active', 'suspended']).notNull().default('pending'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

// 2. Profiles (User-Organization Link)
export const profiles = mysqlTable('profiles', {
    id: varchar('id', { length: 255 }).primaryKey().references(() => users.id, { onDelete: 'cascade' }),
    organizationId: varchar('organization_id', { length: 36 }).references(() => organizations.id),
    fullName: varchar('full_name', { length: 255 }),
    role: mysqlEnum('role', ['super_admin', 'owner', 'clerk']).notNull().default('clerk'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

// 3. Products (Inventory)
export const products = mysqlTable('products', {
    id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
    organizationId: varchar('organization_id', { length: 36 }).notNull().references(() => organizations.id),
    sku: varchar('sku', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 1000 }),
    price: decimal('price', { precision: 12, scale: 2 }).notNull().default('0.00'),
    stockQuantity: int('stock_quantity').notNull().default(0),
    minStockLevel: int('min_stock_level').notNull().default(5),
    category: varchar('category', { length: 255 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (t) => ({
    unq: unique().on(t.organizationId, t.sku),
}));

// 4. Customers (CRM)
export const customers = mysqlTable('customers', {
    id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
    organizationId: varchar('organization_id', { length: 36 }).notNull().references(() => organizations.id),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }),
    email: varchar('email', { length: 255 }),
    lineId: varchar('line_id', { length: 255 }),
    totalBalance: decimal('total_balance', { precision: 12, scale: 2 }).notNull().default('0.00'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

// 5. Transactions (Sale Headers)
export const transactions = mysqlTable('transactions', {
    id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
    organizationId: varchar('organization_id', { length: 36 }).notNull().references(() => organizations.id),
    customerId: varchar('customer_id', { length: 36 }).references(() => customers.id),
    clerkId: varchar('clerk_id', { length: 255 }).references(() => users.id),
    totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull().default('0.00'),
    discountAmount: decimal('discount_amount', { precision: 12, scale: 2 }).notNull().default('0.00'),
    netAmount: decimal('net_amount', { precision: 12, scale: 2 }).notNull().default('0.00'),
    status: mysqlEnum('status', ['complete', 'partial', 'cancelled']).notNull().default('complete'),
    dueDate: datetime('due_date'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

// 6. Transaction Items (Sale Lines)
export const transactionItems = mysqlTable('transaction_items', {
    id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
    transactionId: varchar('transaction_id', { length: 36 }).notNull().references(() => transactions.id),
    productId: varchar('product_id', { length: 36 }).references(() => products.id),
    sku: varchar('sku', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    quantity: int('quantity').notNull().default(1),
    unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull().default('0.00'),
    totalPrice: decimal('total_amount', { precision: 12, scale: 2 }).notNull().default('0.00'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

// 7. Payments (Individual Payment Records)
export const payments = mysqlTable('payments', {
    id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
    organizationId: varchar('organization_id', { length: 36 }).notNull().references(() => organizations.id),
    customerId: varchar('customer_id', { length: 36 }).references(() => customers.id),
    transactionId: varchar('transaction_id', { length: 36 }).references(() => transactions.id),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull().default('0.00'),
    paymentType: mysqlEnum('payment_type', ['cash', 'card', 'installment', 'other']).notNull().default('cash'),
    referenceNumber: varchar('reference_number', { length: 255 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
