import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function setupStripeTestData() {
  console.log('Setting up Stripe test data with your API keys...');
  
  try {
    // Create a product for RevalPro subscriptions
    const product = await stripe.products.create({
      name: 'RevalPro Subscription',
      description: 'UK Nursing Revalidation Assistant',
      type: 'service',
    });
    
    console.log('✓ Product created:', product.id);
    
    // Create price IDs for different plans
    const prices = await Promise.all([
      stripe.prices.create({
        unit_amount: 499, // £4.99
        currency: 'gbp',
        recurring: { interval: 'month' },
        product: product.id,
        nickname: 'Standard Monthly',
      }),
      stripe.prices.create({
        unit_amount: 4999, // £49.99
        currency: 'gbp',
        recurring: { interval: 'year' },
        product: product.id,
        nickname: 'Standard Annual',
      }),
      stripe.prices.create({
        unit_amount: 999, // £9.99
        currency: 'gbp',
        recurring: { interval: 'month' },
        product: product.id,
        nickname: 'Premium Monthly',
      }),
      stripe.prices.create({
        unit_amount: 9999, // £99.99
        currency: 'gbp',
        recurring: { interval: 'year' },
        product: product.id,
        nickname: 'Premium Annual',
      }),
    ]);
    
    console.log('\n✓ Price IDs created for your account:');
    console.log('Standard Monthly:', prices[0].id);
    console.log('Standard Annual:', prices[1].id);
    console.log('Premium Monthly:', prices[2].id);
    console.log('Premium Annual:', prices[3].id);
    
    return {
      productId: product.id,
      priceIds: {
        standardMonthly: prices[0].id,
        standardAnnual: prices[1].id,
        premiumMonthly: prices[2].id,
        premiumAnnual: prices[3].id,
      }
    };
    
  } catch (error) {
    console.error('Error setting up Stripe:', error.message);
    throw error;
  }
}

// Run the setup
setupStripeTestData()
  .then(result => {
    console.log('\n🎉 Stripe setup complete!');
    console.log('Your price IDs are ready to use.');
    console.log('You can now see all transactions in your Stripe dashboard.');
  })
  .catch(error => {
    console.error('Setup failed:', error.message);
  });