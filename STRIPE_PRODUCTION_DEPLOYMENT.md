# Stripe Production Deployment Guide

## Overview
This guide will help you switch from test mode (development) to live mode (production) for real customer subscriptions.

---

## Step 1: Create Live Products in Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. **Switch to LIVE mode** (toggle at top right - it should say "LIVE" not "TEST")
3. Navigate to **Products** in the left sidebar
4. Create 2 products:

### Product 1: Standard Plan
- Click "Add product"
- **Name**: RevalPro Standard
- **Description**: Everything you need for a smooth revalidation
- **Pricing**:
  - Add price: £4.99/month (recurring monthly)
  - Add another price: £49.99/year (recurring annually)
- Click "Save product"
- **Copy the Price IDs** (they start with `price_...`):
  - Standard Monthly: `price_xxxxxxx`
  - Standard Annual: `price_xxxxxxx`

### Product 2: Premium Plan
- Click "Add product"
- **Name**: RevalPro Premium  
- **Description**: The ultimate revalidation companion
- **Pricing**:
  - Add price: £9.99/month (recurring monthly)
  - Add another price: £89.99/year (recurring annually)
- Click "Save product"
- **Copy the Price IDs**:
  - Premium Monthly: `price_xxxxxxx`
  - Premium Annual: `price_xxxxxxx`

---

## Step 2: Update Code with Live Price IDs

1. Open `shared/subscription-plans.ts`
2. Find the `stripePriceId` sections for standard and premium plans
3. Replace the test price IDs with your live price IDs:

```typescript
standard: {
  // ... other fields ...
  stripePriceId: {
    // Replace with YOUR live price IDs from Step 1
    monthly: "price_YOUR_STANDARD_MONTHLY_ID",
    annual: "price_YOUR_STANDARD_ANNUAL_ID",
  },
},
premium: {
  // ... other fields ...
  stripePriceId: {
    // Replace with YOUR live price IDs from Step 1
    monthly: "price_YOUR_PREMIUM_MONTHLY_ID",
    annual: "price_YOUR_PREMIUM_ANNUAL_ID",
  },
},
```

4. Save the file

---

## Step 3: Set Up Live Webhook

1. In [Stripe Dashboard](https://dashboard.stripe.com/) (still in **LIVE mode**)
2. Navigate to **Developers** → **Webhooks**
3. Click **"Add endpoint"**
4. Enter endpoint details:
   - **URL**: `https://revalpro.co.uk/webhook/stripe`
   - **Description**: RevalPro Production Webhook
5. Select events to listen to:
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `payment_intent.succeeded`
   - ✅ `invoice.payment_succeeded`
6. Click **"Add endpoint"**
7. **Copy the signing secret** (starts with `whsec_...`)

---

## Step 4: Configure Production Environment Variables

In your **Replit Deployment** (not development workspace):

1. Go to your deployment settings
2. Add/update these **Secrets**:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `NODE_ENV` | `production` | production |
| `STRIPE_SECRET_KEY` | Your LIVE secret key | sk_live_51... |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Your LIVE publishable key | pk_live_51... |
| `STRIPE_WEBHOOK_SECRET` | Your LIVE webhook secret | whsec_xxx... |

**To get your LIVE keys:**
- In [Stripe Dashboard](https://dashboard.stripe.com/) (LIVE mode)
- Go to **Developers** → **API keys**
- Copy the **Publishable key** (starts with `pk_live_`)
- Click "Reveal test key" on **Secret key** (starts with `sk_live_`)

---

## Step 5: Deploy and Test

1. Deploy your application to production
2. Verify the application starts successfully
3. Check logs for this message:
   ```
   🔧 Stripe Setup (Production): {
     NODE_ENV: 'production',
     keyType: 'LIVE'
   }
   ```

4. **Test the webhook**:
   - In Stripe Dashboard → Webhooks → Your endpoint
   - Click "Send test webhook"
   - Check your application logs to verify it receives the event

5. **Test a real payment** (optional - will create actual charge):
   - Use a real credit card
   - Complete a subscription purchase
   - Verify subscription activates in database
   - **IMPORTANT**: Cancel the test subscription if you don't want to be charged!

---

## Verification Checklist

Before going live, verify:

- [ ] NODE_ENV is set to `production`
- [ ] All Stripe keys start with `sk_live_` and `pk_live_` (NOT `sk_test_`)
- [ ] Webhook secret matches the one from Stripe dashboard
- [ ] Live price IDs are updated in `shared/subscription-plans.ts`
- [ ] Application starts without errors
- [ ] Webhook endpoint receives test events successfully
- [ ] Database gets updated when webhook fires

---

## Security Notes

✅ **Automatic Protections:**
- Development mode REQUIRES test keys - will refuse to start with live keys
- Production mode automatically uses LIVE keys from environment
- Webhook signatures are verified on every request
- PaymentElement has timing protection to prevent premature submission

⚠️ **Important:**
- Never commit API keys to git (they're in environment variables)
- Keep your webhook signing secret secure
- Monitor your Stripe dashboard for any unusual activity

---

## Troubleshooting

### Webhook not receiving events
- Verify webhook URL matches exactly: `https://revalpro.co.uk/webhook/stripe`
- Check webhook secret is correct in environment variables
- Look at Stripe Dashboard → Webhooks → Your endpoint → Recent deliveries

### Subscription not activating
- Check application logs for webhook processing errors
- Verify price IDs in code match Stripe dashboard
- Ensure NODE_ENV=production in deployment

### Payment form not loading
- Verify VITE_STRIPE_PUBLISHABLE_KEY starts with `pk_live_`
- Check browser console for Stripe errors
- Ensure publishable key matches your account

---

## Rolling Back to Test Mode

If you need to go back to test mode:

1. Change environment variables back to test keys
2. Update `shared/subscription-plans.ts` with test price IDs
3. Set NODE_ENV=development
4. Redeploy

---

## Support

If you encounter issues:
1. Check Stripe Dashboard → Developers → Logs
2. Check your application logs
3. Review webhook delivery attempts in Stripe
4. Contact Stripe support if needed
