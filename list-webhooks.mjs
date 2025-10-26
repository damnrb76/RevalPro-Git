import Stripe from 'stripe';

const stripe = new Stripe(process.env.TESTING_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

async function listWebhooks() {
  console.log('📋 Listing all test mode webhooks...\n');

  try {
    const webhooks = await stripe.webhookEndpoints.list({ limit: 100 });
    
    console.log(`Found ${webhooks.data.length} webhook(s):\n`);
    
    webhooks.data.forEach((wh, index) => {
      console.log(`Webhook #${index + 1}:`);
      console.log(`  ID: ${wh.id}`);
      console.log(`  URL: ${wh.url}`);
      console.log(`  Status: ${wh.status}`);
      console.log(`  Secret: ${wh.secret ? wh.secret.substring(0, 15) + '...' : 'HIDDEN'}`);
      console.log('');
    });

    // Find our webhook
    const ourUrl = 'https://a46ce05b-a9f0-4b1a-810f-cdea0479e141-00-1zu9iaiocna9y.picard.replit.dev/webhook/stripe';
    const ourWebhook = webhooks.data.find(wh => wh.url === ourUrl);
    
    if (ourWebhook) {
      console.log('✅ Found webhook for this app');
      console.log('⚠️  NOTE: Stripe does NOT return the full secret after creation');
      console.log('    You must use the secret that was shown when the webhook was created.');
      console.log('    Current secret in env starts with:', process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 15) + '...');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listWebhooks();
