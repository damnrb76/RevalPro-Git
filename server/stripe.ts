import Stripe from 'stripe';
import { PLAN_DETAILS } from '../shared/subscription-plans';
import { storage } from './storage';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required environment variable: STRIPE_SECRET_KEY');
}

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
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
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
    
    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
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
          'customer.subscription.created',
          'customer.subscription.updated',
          'customer.subscription.deleted',
          'invoice.payment_succeeded',
          'invoice.payment_failed',
        ],
      });
    } else {
      // Create new endpoint
      return await stripe.webhookEndpoints.create({
        url,
        enabled_events: [
          'customer.subscription.created',
          'customer.subscription.updated',
          'customer.subscription.deleted',
          'invoice.payment_succeeded',
          'invoice.payment_failed',
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
  const { type, data } = event;

  try {
    switch (type) {
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
        const period = subscription.items.data[0].plan.interval === 'year' ? 'annual' : 'monthly';

        // Update the user's subscription details
        await storage.updateUserStripeInfo(user.id, {
          subscriptionStatus: subscription.status,
          currentPlan: planId,
          subscriptionPeriod: period,
          subscriptionEndDate: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
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
        if (invoice.subscription) {
          const subscriptionId = invoice.subscription as string;
          
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
        if (invoice.subscription) {
          const subscriptionId = invoice.subscription as string;
          
          // Get the subscription to get customer ID
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const customerId = subscription.customer as string;
          
          // Get the user with this Stripe customer ID
          const user = await storage.getUserByStripeCustomerId(customerId);
          
          if (!user) {
            console.error(`No user found with Stripe customer ID: ${customerId}`);
            return;
          }

          // Update subscription status to past_due
          await storage.updateUserStripeInfo(user.id, {
            subscriptionStatus: 'past_due',
          });
        }
        
        break;
      }
    }
  } catch (error) {
    console.error('Error handling webhook event:', error);
    throw error;
  }
}