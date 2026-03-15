import { db } from '../src/shared/lib/db/index';
import * as dotenv from 'dotenv';
dotenv.config();

async function checkConnection() {
    try {
        console.log('⏳ Connecting to MySQL...');
        // Just run a simple query to verify connection
        const result = await db.execute('SELECT 1 + 1 AS result');
        console.log('✅ MySQL Connection Successful!');
        console.log('Result:', result[0]);
        process.exit(0);
    } catch (error) {
        console.error('❌ MySQL Connection Failed:');
        console.error(error);
        process.exit(1);
    }
}

checkConnection();
