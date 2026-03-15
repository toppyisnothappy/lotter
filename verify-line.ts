
import { sendLinePushMessage } from './src/shared/lib/line/api';
import * as dotenv from 'dotenv';
dotenv.config();

async function verify() {
    console.log('--- Verifying LINE Messaging Utility ---');

    const dummyId = 'U1234567890abcdef1234567890abcdef';
    const message = 'Hello from Lotter! This is a test reminder.';

    console.log(`Target ID: ${dummyId}`);

    const result = await sendLinePushMessage(dummyId, message);

    console.log('Result:', result);

    if (!process.env.LINE_CHANNEL_ACCESS_TOKEN) {
        if (!result.success && result.error === 'Access token missing') {
            console.log('✅ Correctly identified missing access token.');
        } else {
            console.error('❌ Failed to handle missing access token correctly.');
        }
    } else {
        if (result.success) {
            console.log('✅ Message sent successfully (Real API call)!');
        } else {
            console.error('❌ Failed to send message:', result.error);
        }
    }

    process.exit(0);
}

verify().catch(err => {
    console.error(err);
    process.exit(1);
});
