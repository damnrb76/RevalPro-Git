import Stripe from 'stripe';

const stripe = new Stripe(process.env.TESTING_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

async function createNewWebhook() {
  const webhookUrl = 'https://a46ce05b-a9f0-4b1a-810f-cdea0479e141-00-1zu9iaiocna9y.picard.replit.dev/webhook/stripe';
  
  console.log('🔧 Creating NEW test webhook endpoint to get secret...\n');

  try {
    // Delete old webhook first
    const webhooks = await stripe.webhookEndpoints.list({ limit: 100 });
    const existing = webhooks.data.find(wh => wh.url === webhookUrl);
    
    if (existing) {
      console.log('🗑️  Deleting old webhook:', existing.id);
      await stripe.webhookEndpoints.del(existing.id);
      console.log('✅ Old webhook deleted\n');
    }

    // Create new webhook
    const webhook = await stripe.webhookEndpoints.create({
      url: webhookUrl,
      enabled_events: [
        'checkout.session.completed',
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',
        'invoice.payment_succeeded',
        'invoice.payment_failed',
        'payment_intent.succeeded',
        'customer.subscription.trial_will_end',
        'charge.refunded',
      ],
    });

    console.log('✅ Created new webhook endpoint!');
    console.log('Webhook ID:', webhook.id);
    console.log('Status:', webhook.status);
    console.log('');
    console.log('📋 UPDATE YOUR REPLIT SECRET:');
    console.log('===============================================');
    console.log('Secret Name: STRIPE_WEBHOOK_SECRET');
    console.log('Secret Value:', webhook.secret);
    console.log('===============================================\n');
    console.log('⚠️  IMPORTANT: Update this secret in Replit Secrets NOW!');
    console.log('Then restart the app to test webhooks.');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createNewWebhook();
