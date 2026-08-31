import { getPaddle } from '@/lib/paddle';
import { processPaddleEvent } from '@/lib/process-paddle-webhook';

export async function POST(request: Request) {
  const signature = request.headers.get('paddle-signature') || '';
  const rawBody = await request.text();
  const secret = process.env.PADDLE_NOTIFICATION_WEBHOOK_SECRET || '';
  if (!signature || !rawBody) return Response.json({ error: 'Missing signature or body' }, { status: 400 });
  if (!secret) return Response.json({ error: 'Paddle webhook is not configured' }, { status: 503 });

  try {
    const event = await getPaddle().webhooks.unmarshal(rawBody, secret, signature);
    if (event) await processPaddleEvent(event);
    return Response.json({ received: true });
  } catch (error) {
    console.error('Paddle webhook error', error);
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
