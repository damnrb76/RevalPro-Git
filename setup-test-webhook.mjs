import Stripe from 'stripe';

const stripe = new Stripe(process.env.TESTING_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

async function setupWebhook() {
  const webhookUrl = 'https://a46ce05b-a9f0-4b1a-810f-cdea0479e141-00-1zu9iaiocna9y.picard.replit.dev/webhook/stripe';
  
  console.log('🔧 Setting up test webhook endpoint...\n');
  console.log('Webhook URL:', webhookUrl);
  console.log('');

  try {
    // Check if webhook already exists
    const webhooks = await stripe.webhookEndpoints.list({ limit: 100 });
    const existing = webhooks.data.find(wh => wh.url === webhookUrl);

    if (existing) {
      console.log('✅ Webhook endpoint already exists!');
      console.log('Webhook ID:', existing.id);
      console.log('Status:', existing.status);
      console.log('');
      console.log('📋 COPY THIS WEBHOOK SECRET TO YOUR REPLIT SECRETS:');
      console.log('===============================================');
      console.log('Secret Name: STRIPE_WEBHOOK_SECRET');
      console.log('Secret Value:', existing.secret);
      console.log('===============================================\n');
      console.log('⚠️  Make sure to replace the old webhook secret with this one!');
    } else {
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
      console.log('📋 COPY THIS WEBHOOK SECRET TO YOUR REPLIT SECRETS:');
      console.log('===============================================');
      console.log('Secret Name: STRIPE_WEBHOOK_SECRET');
      console.log('Secret Value:', webhook.secret);
      console.log('===============================================\n');
    }
  } catch (error) {
    console.error('❌ Error setting up webhook:', error.message);
  }
}

setupWebhook();
