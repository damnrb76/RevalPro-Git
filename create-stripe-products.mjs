import Stripe from 'stripe';

const stripe = new Stripe(process.env.TESTING_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

async function createProducts() {
  console.log('🚀 Creating Stripe test products and prices...\n');

  try {
    // Create Standard product
    const standardProduct = await stripe.products.create({
      name: 'Standard Plan',
      description: 'Essential revalidation tracking features',
    });
    console.log('✅ Created Standard Product:', standardProduct.id);

    // Create Standard prices
    const standardMonthly = await stripe.prices.create({
      product: standardProduct.id,
      unit_amount: 499, // £4.99
      currency: 'gbp',
      recurring: { interval: 'month' },
      lookup_key: 'standard_monthly_gbp',
    });
    console.log('✅ Created Standard Monthly Price:', standardMonthly.id);

    const standardAnnual = await stripe.prices.create({
      product: standardProduct.id,
      unit_amount: 4999, // £49.99
      currency: 'gbp',
      recurring: { interval: 'year' },
      lookup_key: 'standard_annual_gbp',
    });
    console.log('✅ Created Standard Annual Price:', standardAnnual.id);

    // Create Premium product
    const premiumProduct = await stripe.products.create({
      name: 'Premium Plan',
      description: 'Complete revalidation toolkit with AI assistance',
    });
    console.log('\n✅ Created Premium Product:', premiumProduct.id);

    // Create Premium prices
    const premiumMonthly = await stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 999, // £9.99
      currency: 'gbp',
      recurring: { interval: 'month' },
      lookup_key: 'premium_monthly_gbp',
    });
    console.log('✅ Created Premium Monthly Price:', premiumMonthly.id);

    const premiumAnnual = await stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 8999, // £89.99
      currency: 'gbp',
      recurring: { interval: 'year' },
      lookup_key: 'premium_annual_gbp',
    });
    console.log('✅ Created Premium Annual Price:', premiumAnnual.id);

    console.log('\n📋 Update server/stripe.ts with these TEST price IDs:');
    console.log('===============================================');
    console.log(`'standard_monthly_gbp': '${standardMonthly.id}',`);
    console.log(`'standard_annual_gbp': '${standardAnnual.id}',`);
    console.log(`'premium_monthly_gbp': '${premiumMonthly.id}',`);
    console.log(`'premium_annual_gbp': '${premiumAnnual.id}'`);
    console.log('===============================================\n');

  } catch (error) {
    console.error('❌ Error creating products:', error.message);
    process.exit(1);
  }
}

createProducts();
