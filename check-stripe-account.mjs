import Stripe from 'stripe';

const stripe = new Stripe(process.env.TESTING_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

async function checkAccount() {
  console.log('🔍 Checking which Stripe account we\'re using...\n');

  try {
    const account = await stripe.account.retrieve();
    
    console.log('✅ Connected to Stripe Account:');
    console.log(`  Account ID: ${account.id}`);
    console.log(`  Email: ${account.email}`);
    console.log(`  Business Name: ${account.business_profile?.name || 'Not set'}`);
    console.log(`  Country: ${account.country}`);
    console.log('');
    
    // List webhooks
    const webhooks = await stripe.webhookEndpoints.list();
    console.log(`📋 Webhooks in this account: ${webhooks.data.length}`);
    webhooks.data.forEach((wh, i) => {
      console.log(`  ${i + 1}. ${wh.url}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAccount();
