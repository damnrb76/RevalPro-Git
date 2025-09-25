import Stripe from 'stripe';
import { PLAN_DETAILS } from '../shared/subscription-plans';
import { storage } from './storage';

// Store processed event IDs for idempotency
const processedEvents = new Set<string>();

// Use testing keys in development, production keys in production
const stripeSecretKey = process.env.NODE_ENV === 'development' 
  ? (process.env.TESTING_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY)
  : process.env.STRIPE_SECRET_KEY;

// Log Stripe setup only in development for debugging
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Stripe Setup:', {
    NODE_ENV: process.env.NODE_ENV,
    hasTestingKey: !!process.env.TESTING_STRIPE_SECRET_KEY,
    hasProductionKey: !!process.env.STRIPE_SECRET_KEY,
    usingTestKey: stripeSecretKey?.startsWith('sk_test_'),
  });
}

if (!stripeSecretKey) {
  throw new Error('Missing required environment variable: STRIPE_SECRET_KEY or TESTING_STRIPE_SECRET_KEY');
}

// Initialize Stripe with the secret key
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16' as any,
});

export interface CreateCustomerParams {
  email: string;
  name?: string;
  userId: number;
}

export interface CreateSubscriptionParams {
  customerId: string;
  priceId: string;
  userId: number;
}

export interface CreateCheckoutSessionParams {
  lookupKey: string;
  userId: number;
  customerEmail: string;
  successUrl?: string;
  cancelUrl?: string;
}

// Create a Stripe customer
export async function createCustomer({ email, name, userId }: CreateCustomerParams): Promise<string> {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId: userId.toString(),
      },
    });

    // Update user record with Stripe customer ID
    await storage.updateUserStripeInfo(userId, {
      stripeCustomerId: customer.id,
    });

    return customer.id;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
}

// Create a Stripe subscription
export async function createSubscription({ customerId, priceId, userId }: CreateSubscriptionParams) {
  try {
    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // Update user record with subscription details
    await storage.updateUserStripeInfo(userId, {
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
    });

    // Return the client secret so the client can complete the payment
    const invoice = subscription.latest_invoice as Stripe.Invoice;
    let paymentIntent: Stripe.PaymentIntent | null = null;
    
    if (invoice && 'payment_intent' in invoice && invoice.payment_intent) {
      if (typeof invoice.payment_intent === 'string') {
        paymentIntent = await stripe.paymentIntents.retrieve(invoice.payment_intent);
      } else {
        paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
      }
    }
    
    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret || null,
    };
  } catch (error) {
    console.error('Error creating Stripe subscription:', error);
    throw error;
  }
}

// Retrieve a Stripe subscription
export async function getSubscription(subscriptionId: string) {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    console.error('Error retrieving Stripe subscription:', error);
    throw error;
  }
}

// Cancel a Stripe subscription
export async function cancelSubscription(subscriptionId: string, cancelImmediately: boolean = false) {
  try {
    if (cancelImmediately) {
      // Cancel immediately
      return await stripe.subscriptions.cancel(subscriptionId);
    } else {
      // Cancel at period end
      return await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    }
  } catch (error) {
    console.error('Error canceling Stripe subscription:', error);
    throw error;
  }
}

// Reactivate a subscription that was set to cancel at period end
export async function reactivateSubscription(subscriptionId: string) {
  try {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
  } catch (error) {
    console.error('Error reactivating Stripe subscription:', error);
    throw error;
  }
}

// Create Checkout Session (recommended by GPT for better conversion)
export async function createCheckoutSession({
  lookupKey,
  userId,
  customerEmail,
  successUrl = 'https://revalpro.co.uk/subscription-success?session_id={CHECKOUT_SESSION_ID}',
  cancelUrl = 'https://revalpro.co.uk/pricing'
}: CreateCheckoutSessionParams) {
  try {
    // Map lookup keys to actual price IDs (live Stripe prices)
    const lookupKeyToPriceId: Record<string, string> = {
      'standard_monthly_gbp': 'price_1RXVwJApgglLl36M6hRdROQU',
      'standard_annual_gbp': 'price_1S0oveApgglLl36M6U2t0byU',
      'premium_monthly_gbp': 'price_1RXVwIApgglLl36Mmk8XXEAO',
      'premium_annual_gbp': 'price_1S0ozAApgglLl36MNHXL1VJn'
    };

    // Use price ID if lookup key exists, otherwise assume lookupKey is already a price ID
    const priceId = lookupKeyToPriceId[lookupKey] || lookupKey;
    
    console.log(`Creating checkout session: ${lookupKey} → ${priceId}`);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId, // Using actual price ID
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true, // Enable promotion/coupon codes
      automatic_tax: { enabled: true },
      customer_email: customerEmail,
      client_reference_id: userId.toString(),
      metadata: {
        app_user_id: userId.toString(),
      },
      // Optimize for coupon code visibility
      payment_method_collection: 'always',
      billing_address_collection: 'auto',
      phone_number_collection: {
        enabled: false, // Reduce form clutter to make coupon field more visible
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Change a subscription's plan
export async function changeSubscriptionPlan(subscriptionId: string, newPriceId: string) {
  try {
    // Get the subscription to find the current item ID
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const itemId = subscription.items.data[0].id;

    // Update the subscription item with the new price
    return await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: itemId,
          price: newPriceId,
        },
      ],
    });
  } catch (error) {
    console.error('Error changing subscription plan:', error);
    throw error;
  }
}

// Create/update the Stripe webhook endpoint (usually called during app setup)
export async function setupWebhookEndpoint(url: string) {
  try {
    // Get all webhook endpoints to check if one already exists
    const webhookEndpoints = await stripe.webhookEndpoints.list();
    const existingEndpoint = webhookEndpoints.data.find(
      (endpoint) => endpoint.url === url
    );

    if (existingEndpoint) {
      // Update existing endpoint
      return await stripe.webhookEndpoints.update(existingEndpoint.id, {
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
    } else {
      // Create new endpoint
      return await stripe.webhookEndpoints.create({
        url,
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
    }
  } catch (error) {
    console.error('Error setting up webhook endpoint:', error);
    throw error;
  }
}

// Handle Stripe webhook events
export async function handleWebhookEvent(event: Stripe.Event) {
  const { type, data, id } = event;

  // Idempotency: check if we've already processed this event
  if (processedEvents.has(id)) {
    console.log(`Event ${id} already processed, skipping`);
    return;
  }

  try {
    console.log(`Processing webhook event: ${type} (${id})`);
    
    switch (type) {
      case 'checkout.session.completed': {
        const session = data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const clientReferenceId = session.client_reference_id;
        
        if (!clientReferenceId) {
          console.error('No client_reference_id in checkout session');
          return;
        }
        
        const userId = parseInt(clientReferenceId);
        
        // Get subscription details to determine plan
        const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ['items.data.price']
        });
        const priceId = subscription.items.data[0]?.price.id;
        
        // Map price to plan using lookup keys
        let planId = 'free';
        let period: 'monthly' | 'annual' = 'monthly';
        
        Object.entries(PLAN_DETAILS).forEach(([id, plan]) => {
          if (plan.stripePriceId.monthly === priceId) {
            planId = id;
            period = 'monthly';
          } else if (plan.stripePriceId.annual === priceId) {
            planId = id;
            period = 'annual';
          }
        });
        
        // Update user with subscription details
        await storage.updateUserStripeInfo(userId, {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          subscriptionStatus: subscription.status,
          currentPlan: planId,
          subscriptionPeriod: period,
          subscriptionEndDate: new Date((subscription as any).current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
        });
        
        console.log(`Checkout completed for user ${userId}, plan: ${planId}`);
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Get the user with this Stripe customer ID
        const user = await storage.getUserByStripeCustomerId(customerId);
        
        if (!user) {
          console.error(`No user found with Stripe customer ID: ${customerId}`);
          return;
        }

        // Determine the plan based on the Price ID in the subscription
        const priceId = subscription.items.data[0].price.id;
        let planId = 'free';

        // Find the matching plan based on Stripe price ID
        Object.entries(PLAN_DETAILS).forEach(([id, plan]) => {
          if (
            plan.stripePriceId.monthly === priceId || 
            plan.stripePriceId.annual === priceId
          ) {
            planId = id;
          }
        });

        // Determine if it's a monthly or annual subscription
        const period = subscription.items.data[0]?.price.recurring?.interval === 'year' ? 'annual' : 'monthly';

        // Update the user's subscription details
        await storage.updateUserStripeInfo(user.id, {
          subscriptionStatus: subscription.status,
          currentPlan: planId,
          subscriptionPeriod: period,
          subscriptionEndDate: new Date((subscription as any).current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
        });
        
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Get the user with this Stripe customer ID
        const user = await storage.getUserByStripeCustomerId(customerId);
        
        if (!user) {
          console.error(`No user found with Stripe customer ID: ${customerId}`);
          return;
        }

        // Reset the user's subscription to free plan
        await storage.updateUserStripeInfo(user.id, {
          subscriptionStatus: 'canceled',
          currentPlan: 'free',
          subscriptionPeriod: null,
          subscriptionEndDate: null,
          cancelAtPeriodEnd: false,
        });
        
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = data.object as Stripe.Invoice;
        
        // If this invoice is for a subscription payment
        if ('subscription' in invoice && invoice.subscription) {
          const subscriptionId = typeof invoice.subscription === 'string' 
            ? invoice.subscription 
            : (invoice.subscription as any).id;
          
          // Get the subscription to get customer ID
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const customerId = subscription.customer as string;
          
          // Get the user with this Stripe customer ID
          const user = await storage.getUserByStripeCustomerId(customerId);
          
          if (!user) {
            console.error(`No user found with Stripe customer ID: ${customerId}`);
            return;
          }

          // Update subscription status to active if it was incomplete
          if (subscription.status === 'incomplete') {
            await storage.updateUserStripeInfo(user.id, {
              subscriptionStatus: 'active',
            });
          }
        }
        
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = data.object as Stripe.Invoice;
        
        // If this invoice is for a subscription payment
        if ('subscription' in invoice && invoice.subscription) {
          const subscriptionId = typeof invoice.subscription === 'string' 
            ? invoice.subscription 
            : (invoice.subscription as any).id;
          
          // Get the subscription to get customer ID
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const customerId = subscription.customer as string;
          
          // Get the user with this Stripe customer ID
          const user = await storage.getUserByStripeCustomerId(customerId);
          
          if (!user) {
            console.error(`No user found with Stripe customer ID: ${customerId}`);
            return;
          }

          // Mark account in grace period and limit features
          await storage.updateUserStripeInfo(user.id, {
            subscriptionStatus: 'past_due',
          });
          
          console.log(`Payment failed for user ${user.id}, marked as past_due`);
        }
        
        break;
      }
      
      case 'customer.subscription.trial_will_end': {
        const subscription = data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        const user = await storage.getUserByStripeCustomerId(customerId);
        if (!user) {
          console.error(`No user found with Stripe customer ID: ${customerId}`);
          return;
        }
        
        // Notify user about trial ending (implement notification logic as needed)
        console.log(`Trial ending for user ${user.id}`);
        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = data.object as Stripe.PaymentIntent;
        
        // Handle one-time payments or successful payment intents
        // This is useful for single charges that aren't part of subscriptions
        console.log(`Payment succeeded for PaymentIntent: ${paymentIntent.id}`);
        
        // If this payment intent has metadata with user info, update accordingly
        if (paymentIntent.metadata?.userId) {
          const userId = parseInt(paymentIntent.metadata.userId);
          console.log(`One-time payment succeeded for user: ${userId}`);
          // Add any specific logic for one-time payments here
        }
        
        break;
      }
      
      case 'charge.refunded': {
        const charge = data.object as Stripe.Charge;
        console.log(`Refund processed for charge: ${charge.id}`);
        // Handle refund logic as needed
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${type}`);
    }
    
    // Mark event as processed for idempotency
    processedEvents.add(id);
    
  } catch (error) {
    console.error('Error handling webhook event:', error);
    throw error;
  }
}