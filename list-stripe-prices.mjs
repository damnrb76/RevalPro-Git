import Stripe from 'stripe';

const stripe = new Stripe(process.env.TESTING_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

async function listPrices() {
  console.log('📋 Listing all test prices in your Stripe account...\n');

  try {
    const prices = await stripe.prices.list({
      limit: 100,
      expand: ['data.product'],
    });

    const relevantPrices = prices.data.filter(p => 
      p.lookup_key && p.lookup_key.includes('gbp')
    );

    console.log('✅ Found prices with lookup keys:\n');
    
    const priceMap = {};
    relevantPrices.forEach(price => {
      console.log(`${price.lookup_key}: '${price.id}'`);
      console.log(`  Product: ${price.product.name}`);
      console.log(`  Amount: £${(price.unit_amount / 100).toFixed(2)} / ${price.recurring.interval}`);
      console.log('');
      priceMap[price.lookup_key] = price.id;
    });

    console.log('\n📋 Copy this into server/stripe.ts (line 235-240):');
    console.log('===============================================');
    console.log(`const lookupKeyToPriceId: Record<string, string> = {`);
    console.log(`  'standard_monthly_gbp': '${priceMap['standard_monthly_gbp'] || 'NOT_FOUND'}',`);
    console.log(`  'standard_annual_gbp': '${priceMap['standard_annual_gbp'] || 'NOT_FOUND'}',`);
    console.log(`  'premium_monthly_gbp': '${priceMap['premium_monthly_gbp'] || 'NOT_FOUND'}',`);
    console.log(`  'premium_annual_gbp': '${priceMap['premium_annual_gbp'] || 'NOT_FOUND'}'`);
    console.log(`};`);
    console.log('===============================================\n');

  } catch (error) {
    console.error('❌ Error listing prices:', error.message);
    process.exit(1);
  }
}

listPrices();
