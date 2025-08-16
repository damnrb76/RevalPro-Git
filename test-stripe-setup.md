# Stripe Test Setup Checklist

This checklist validates all the GPT recommendations for your Stripe test setup.

## ✅ 1. Prices with Lookup Keys
- [ ] `standard_monthly_gbp` - £4.99/month
- [ ] `standard_annual_gbp` - £49.99/year  
- [ ] `premium_monthly_gbp` - £9.99/month
- [ ] `premium_annual_gbp` - £89.99/year

**Test**: Visit your Stripe Dashboard → Products → Prices and verify lookup keys match.

## ✅ 2. Webhook Events (Test Mode)
Your webhook should be configured for these events:
- [ ] `checkout.session.completed` ✅ Added
- [ ] `customer.subscription.created` ✅ Existing
- [ ] `customer.subscription.updated` ✅ Existing
- [ ] `customer.subscription.deleted` ✅ Existing
- [ ] `invoice.payment_succeeded` ✅ Existing
- [ ] `invoice.payment_failed` ✅ Existing
- [ ] `customer.subscription.trial_will_end` ✅ Added
- [ ] `charge.refunded` ✅ Added

**Test**: Check your Stripe Dashboard → Webhooks → Events to verify all events are enabled.

## ✅ 3. Checkout Session Creation
- [ ] Using lookup keys instead of price IDs ✅ Implemented
- [ ] `mode: subscription` ✅ Implemented
- [ ] `allow_promotion_codes: true` ✅ Implemented
- [ ] `success_url` with session_id parameter ✅ Implemented
- [ ] `cancel_url` pointing to pricing ✅ Implemented
- [ ] `automatic_tax: { enabled: true }` ✅ Implemented
- [ ] `customer_creation: "always"` ✅ Implemented
- [ ] `client_reference_id` for user linking ✅ Implemented
- [ ] `metadata` with app_user_id ✅ Implemented

## ✅ 4. Webhook Implementation
- [ ] Signature verification ✅ Existing
- [ ] Idempotency by event.id ✅ Added
- [ ] Only return 2xx after persisting changes ✅ Implemented
- [ ] Handle checkout.session.completed for fulfillment ✅ Added
- [ ] Map price_id to internal plan using lookup keys ✅ Added
- [ ] Handle invoice.payment_failed with grace period ✅ Enhanced
- [ ] Handle subscription.deleted to revert to free ✅ Existing

## ✅ 5. Data Storage
Your app now stores:
- [ ] `stripe_customer_id` ✅ Existing
- [ ] `stripe_subscription_id` ✅ Existing
- [ ] `current_period_end` ✅ Existing
- [ ] `status` (active, trialing, past_due, canceled) ✅ Existing
- [ ] Internal plan mapping (free, standard, premium) ✅ Existing
- [ ] `subscription_period` (monthly/annual) ✅ Existing

## 🧪 Test Scenarios

### Happy Path Test
1. **Card**: `4242 4242 4242 4242`
2. **Test Flow**: 
   ```bash
   curl -X POST http://localhost:5000/api/subscription/checkout \
     -H "Content-Type: application/json" \
     -d '{"lookupKey": "standard_monthly_gbp"}' \
     --cookie-jar cookies.txt
   ```
3. **Expected**: Checkout session created, payment succeeds, user upgraded

### SCA Challenge Test
1. **Card**: `4000 0027 6000 3184` (3DS required)
2. **Expected**: 3DS challenge presented, payment succeeds after authentication

### Declined Card Test
1. **Card**: `4000 0000 0000 0002`
2. **Expected**: Payment fails, user stays on current plan

### Insufficient Funds Test
1. **Card**: `4000 0000 0000 9995`
2. **Expected**: Payment fails with insufficient funds error

### Subscription Management Tests
1. **Cancel subscription**: Should set cancel_at_period_end
2. **Reactivate subscription**: Should remove cancel_at_period_end
3. **Change plan**: Should prorate and update immediately

## 📋 API Endpoints Available

### New Checkout Endpoint
```http
POST /api/subscription/checkout
Content-Type: application/json

{
  "lookupKey": "standard_monthly_gbp"
}
```

### Existing Legacy Endpoint (still works)
```http
POST /api/subscription/create
Content-Type: application/json

{
  "planId": "standard",
  "period": "monthly"
}
```

### Success URL
- `https://test.revalpro.co.uk/success?session_id={CHECKOUT_SESSION_ID}`
- Session ID automatically populated by Stripe

### Cancel URL
- `https://test.revalpro.co.uk/pricing`

## 🔒 Security Checklist
- [ ] STRIPE_SECRET_KEY in environment ✅ Configured
- [ ] STRIPE_WEBHOOK_SECRET in environment ✅ Configured
- [ ] Webhook signature verification enabled ✅ Implemented
- [ ] Event idempotency prevents duplicate processing ✅ Added
- [ ] User authentication required for checkout ✅ Existing

## 🚀 Next Steps for Production

1. **Update environment variables**:
   - Replace test keys with live keys
   - Update webhook endpoint URL to production domain

2. **Test with real cards**:
   - Use real payment methods in live mode
   - Verify tax collection works correctly

3. **Monitor webhooks**:
   - Set up Stripe Dashboard monitoring
   - Configure webhook retry settings

## 💡 GPT's Additional Recommendations Implemented

✅ **Apple Pay/Google Pay Ready**: Your checkout sessions support digital wallets automatically  
✅ **Promotion Codes**: Customers can apply discount codes during checkout  
✅ **Automatic Tax**: VAT/tax collection enabled for UK customers  
✅ **Customer Portal Ready**: Customer creation set to "always" enables portal access  
✅ **Idempotent Webhooks**: Event deduplication prevents double processing  
✅ **Grace Period Handling**: Failed payments trigger controlled feature limitation  

Your Stripe integration now follows all of GPT's best practices for production readiness! 🎉