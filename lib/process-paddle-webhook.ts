import {
  EventName,
  type CustomerCreatedEvent,
  type CustomerUpdatedEvent,
  type EventEntity,
  type SubscriptionCanceledEvent,
  type SubscriptionCreatedEvent,
  type SubscriptionUpdatedEvent,
} from '@paddle/paddle-node-sdk';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

type SubscriptionEvent = SubscriptionCreatedEvent | SubscriptionUpdatedEvent | SubscriptionCanceledEvent;

export async function processPaddleEvent(event: EventEntity) {
  switch (event.eventType) {
    case EventName.CustomerCreated:
    case EventName.CustomerUpdated:
      return upsertCustomer(event);
    case EventName.SubscriptionCreated:
    case EventName.SubscriptionUpdated:
    case EventName.SubscriptionCanceled:
      return upsertSubscription(event);
    default:
      return;
  }
}

async function upsertCustomer(event: CustomerCreatedEvent | CustomerUpdatedEvent) {
  const { error } = await getSupabaseAdmin().from('customers').upsert({
    customer_id: event.data.id,
    email: event.data.email,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

async function upsertSubscription(event: SubscriptionEvent) {
  const sub = event.data;
  const { error } = await getSupabaseAdmin().from('subscriptions').upsert({
    subscription_id: sub.id,
    customer_id: sub.customerId,
    subscription_status: sub.status,
    price_id: sub.items[0]?.price?.id || '',
    product_id: sub.items[0]?.price?.productId || '',
    items: sub.items,
    scheduled_change: sub.scheduledChange?.effectiveAt || null,
    next_billed_at: sub.nextBilledAt || null,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}
