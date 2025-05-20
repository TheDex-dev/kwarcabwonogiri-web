import crypto from 'crypto';

function generateSignature(timestamp, privateKey) {
    const signature = crypto
        .createHmac('sha1', privateKey)
        .update(timestamp)
        .digest('hex');
    return signature;
}

export async function GET(request) {
    try {
        if (!process.env.IMAGEKIT_PRIVATE_KEY) {
            return new Response(
                JSON.stringify({ error: 'ImageKit private key not configured' }), 
                { status: 500 }
            );
        }

        // Generate authentication parameters
        const token = crypto.randomBytes(32).toString('hex');
        const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes from now
        const signature = generateSignature(token + expire, process.env.IMAGEKIT_PRIVATE_KEY);

        return new Response(JSON.stringify({
            signature,
            token,
            expire
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                // Allow from your domain
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    } catch (error) {
        console.error('ImageKit Authentication Error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to generate authentication signature' }), 
            { status: 500 }
        );
    }
}
