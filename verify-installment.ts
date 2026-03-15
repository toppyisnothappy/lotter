
import { processTransaction } from './src/features/pos/api/actions';
import { db } from './src/shared/lib/db';
import { organizations, products, customers } from './src/shared/lib/db/schema';
import { eq } from 'drizzle-orm';

async function verify() {
    console.log('--- Verifying Installment Transaction ---');

    const [org] = await db.select().from(organizations).limit(1);
    const [customer] = await db.select().from(customers).limit(1);
    const [product] = await db.select().from(products).limit(1);

    if (!org || !customer || !product) {
        console.error('Missing required data for test');
        return;
    }

    const initialBalance = parseFloat(customer.totalBalance as any);
    console.log(`Customer: ${customer.fullName}, Initial Balance: ${initialBalance}`);

    const result = await processTransaction({
        organization_id: org.id,
        customer_id: customer.id,
        items: [
            {
                product_id: product.id,
                sku: product.sku,
                name: product.name,
                quantity: 1,
                unit_price: 50
            }
        ],
        payment_amount: 10, // Pay 10, debt 40
        payment_type: 'installment'
    });

    console.log('Transaction Result:', result);

    if ('success' in result && result.success) {
        const [updatedCustomer] = await db.select().from(customers).where(eq(customers.id, customer.id)).limit(1);
        const finalBalance = parseFloat(updatedCustomer.totalBalance as any);
        console.log(`Final Balance: ${finalBalance}`);

        if (finalBalance === initialBalance + 40) {
            console.log('✅ Balance updated correctly (+40)');
        } else {
            console.error('❌ Balance mismatch!');
        }
    } else {
        console.error('❌ Transaction failed!');
    }

    process.exit(0);
}

verify().catch(err => {
    console.error(err);
    process.exit(1);
});
