
/**
 * LINE Messaging API utility for sending push notifications
 */

export async function sendLinePushMessage(to: string, message: string) {
    const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

    if (!accessToken) {
        console.warn('LINE_CHANNEL_ACCESS_TOKEN is not defined. Skipping push message.');
        return { success: false, error: 'Access token missing' };
    }

    try {
        const response = await fetch('https://api.line.me/v2/bot/message/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                to,
                messages: [
                    {
                        type: 'text',
                        text: message,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`LINE API error: ${response.status} ${JSON.stringify(errorBody)}`);
        }

        return { success: true };
    } catch (error: any) {
        console.error('Error sending LINE push message:', error);
        return { success: false, error: error.message };
    }
}
