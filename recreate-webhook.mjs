import Stripe from 'stripe';

const stripe = new Stripe(process.env.TESTING_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

async function recreateWebhook() {
  console.log('🔄 Recreating webhook from scratch...\n');

  try {
    // Step 1: List all webhooks
    const webhooks = await stripe.webhookEndpoints.list();
    console.log(`Found ${webhooks.data.length} existing webhook(s)\n`);
    
    // Step 2: Delete all existing webhooks
    for (const wh of webhooks.data) {
      console.log(`🗑️  Deleting webhook: ${wh.id}`);
      await stripe.webhookEndpoints.del(wh.id);
    }
    console.log('');
    
    // Step 3: Create a brand new webhook
    const url = 'https://a46ce05b-a9f0-4b1a-810f-cdea0479e141-00-1zu9iaiocna9y.picard.replit.dev/webhook/stripe';
    console.log(`📝 Creating new webhook for: ${url}\n`);
    
    const newWebhook = await stripe.webhookEndpoints.create({
      url: url,
      enabled_events: [
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',
        'invoice.payment_succeeded',
        'invoice.payment_failed',
        'checkout.session.completed',
        'payment_intent.succeeded',
        'payment_intent.payment_failed',
      ],
    });
    
    console.log('✅ NEW WEBHOOK CREATED!');
    console.log(`   ID: ${newWebhook.id}`);
    console.log(`   Status: ${newWebhook.status}`);
    console.log('');
    console.log('🔐 NEW WEBHOOK SECRET:');
    console.log(`   ${newWebhook.secret}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Copy the secret above and update it in your Replit Secrets:');
    console.log('   Secret name: STRIPE_WEBHOOK_SECRET');
    console.log(`   Secret value: ${newWebhook.secret}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

recreateWebhook();
