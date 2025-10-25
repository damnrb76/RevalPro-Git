# RevalPro - Nursing Revalidation Application

## Overview

RevalPro is a comprehensive UK-specific nursing revalidation tracker application designed to help NHS nurses manage their NMC (Nursing and Midwifery Council) revalidation requirements. The application provides a secure, user-friendly platform for tracking practice hours, CPD activities, reflective accounts, feedback, and other mandatory revalidation elements.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration
- **Styling**: Tailwind CSS with custom NHS/NMC color schemes
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Data Storage**: IndexedDB for local, client-side data persistence

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: Passport.js with local strategy and session management
- **Session Storage**: Memory store for development, configurable for production

### Key Design Decisions
- **Client-First Architecture**: Primary data storage in IndexedDB to ensure user privacy and offline capability
- **Hybrid Authentication**: Supports both traditional username/password and Google OAuth
- **Server-Side AI Integration**: API keys managed server-side to prevent exposure
- **Progressive Web App**: Designed for mobile-first healthcare professionals

## Key Components

### Data Models
- **User Profiles**: NMC registration details, personal information
- **Practice Hours**: Detailed logging by setting, scope, and time period
- **CPD Records**: Continuing Professional Development activities with participatory/non-participatory classification
- **Feedback Records**: Patient and colleague feedback with structured formats
- **Reflective Accounts**: Guided reflections linked to NMC Code sections
- **Health Declarations**: Annual health and character confirmations
- **Confirmation Records**: Confirmer details and submission tracking

### AI Integration
- **Multiple AI Providers**: OpenAI GPT-4o (primary), Google Gemini (secondary), Anthropic Claude (tertiary)
- **Fallback System**: Local responses when AI services unavailable
- **Server-Side Processing**: API keys secured on backend
- **Specialized Prompts**: NMC-specific guidance and templates

### Authentication & Security
- **Local Storage**: Sensitive data remains on user device
- **GDPR Compliance**: Privacy-first design with user consent management
- **Session Security**: Configurable session settings for development/production
- **Data Export**: JSON and PDF export capabilities for portability

## Data Flow

1. **User Registration**: Creates account with basic credentials
2. **Profile Setup**: NMC registration details stored locally
3. **Data Entry**: Practice hours, CPD, feedback, reflections tracked in IndexedDB
4. **AI Assistance**: Server-side API calls for guidance and templates
5. **Progress Tracking**: Real-time calculation of revalidation requirements
6. **Export/Submission**: Generate NMC-compliant documentation

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4o for primary AI assistance
- **Google Gemini**: Backup AI service
- **Anthropic Claude**: Tertiary AI provider

### Authentication
- **Google OAuth**: Firebase Authentication integration
- **Session Management**: Express-session with configurable stores

### Email Services
- **Nodemailer**: Gmail SMTP for notifications
- **SendGrid**: Alternative email provider

### Payment Processing
- **Stripe**: Subscription management and billing

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations

## Deployment Strategy

### Development Environment
- **Replit**: Primary development platform
- **Vite Dev Server**: Hot module replacement for rapid development
- **Local Storage**: Development data persistence

### Production Environment
- **Build Process**: Vite build with esbuild for server bundling
- **Static Assets**: Served via Express static middleware
- **Database**: PostgreSQL via Neon's serverless platform
- **Domain**: revalpro.co.uk with custom DNS configuration

### Environment Variables
- Database: `DATABASE_URL`
- AI Services: `OPENAI_API_KEY`, `VITE_GEMINI_API_KEY`
- Authentication: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Payments: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`
- Email: `GMAIL_USER`, `GMAIL_PASS`

## Changelog
- June 28, 2025. Initial setup
- December 28, 2025. Fixed beta application persistence with PostgreSQL database storage
- December 28, 2025. Removed progress indicator legend section from dashboard
- December 28, 2025. Removed "NMC Status" from Analytics & Visuals menu
- December 28, 2025. Removed early founders promotional offer and locked pricing from subscription page
- July 5, 2025. Fixed demo account authentication system with dedicated demo login button
- July 5, 2025. Added development mode for subscription testing without Stripe integration
- July 5, 2025. Enhanced visual subscription experience with plan-specific UI themes
- July 5, 2025. Added AI assistant color themes (blue/green/purple) for different features
- July 5, 2025. Implemented premium visual effects and background gradients
- July 5, 2025. Added plan indicators in header and dashboard with crown/star/shield icons
- July 10, 2025. Implemented Stripe sandbox integration for subscription testing
- July 10, 2025. Added test price IDs and checkout flow with proper Stripe Elements
- July 10, 2025. Created webhook handling for subscription events
- July 10, 2025. Added dedicated test page for Stripe sandbox testing
- July 11, 2025. Resolved Stripe API key configuration and connected to user's actual Stripe account
- July 11, 2025. Successfully created account-specific price IDs and verified checkout session creation
- July 11, 2025. Confirmed working Stripe integration with real payment processing capabilities
- July 12, 2025. Resolved missing Stripe test keys configuration issue
- July 12, 2025. Fixed webhook secret and publishable key setup for complete Stripe integration
- July 12, 2025. Verified all Stripe test functionality working correctly with real checkout sessions
- July 12, 2025. Fixed demo subscription error by preventing fake subscription IDs from being processed by Stripe
- July 12, 2025. Added comprehensive error handling for demo and development subscriptions across all operations
- July 13, 2025. Added mandatory training records section for tracking additional training outside of revalidation requirements
- July 13, 2025. Modified default account creation to grant premium access immediately for testing purposes before release
- July 14, 2025. Removed NMC service status functionality including API endpoints, frontend components, and related types
- July 15, 2025. Removed priority email support feature from all subscription plans
- July 17, 2025. Updated subscription pricing: Standard £4.99/month, £49.99/year (save ~£10); Premium £9.99/month, £89.99/year (save ~£30)
- July 17, 2025. Added savings display to pricing plans showing annual savings and equivalent free months
- July 22, 2025. Updated launch date to Friday, August 1st, 2025 at 6:00 AM GMT
- July 22, 2025. Implemented new custom landing page design with app screenshots and feature highlights
- July 22, 2025. Updated pricing structure: Free (£0), Standard (£4.99/month, £49.99/year), Premium (£9.99/month, £89.99/year)
- July 28, 2025. Added comprehensive Terms of Service page covering healthcare-specific legal requirements and user responsibilities
- July 28, 2025. Integrated Terms of Service into navigation and footer alongside Privacy Policy
- August 2, 2025. Enhanced notification service with rich browser notifications featuring interactive action buttons
- August 2, 2025. Implemented AI-powered adaptive reminder scheduling that analyzes user behavior patterns for optimal timing
- August 2, 2025. Added comprehensive notification test page with service worker for handling action button clicks
- August 2, 2025. Fixed practice hours form clear button issue - date clearing now resets to today instead of wiping entire form
- August 2, 2025. Implemented comprehensive weekly hours calculator system for automated practice hours calculation
- August 2, 2025. Added tabbed interface in Practice Hours form with Manual Entry and Weekly Calculator options
- August 2, 2025. Created progressive week-by-week calculation with individual adjustments for non-working periods
- August 2, 2025. Enhanced database schema with weekly hours configuration table for storing calculation data
- August 2, 2025. Added facility to amend weekly hours when contracted hours change mid-period
- August 2, 2025. Updated weekly calculator to only count completed weeks toward practice hours totals
- August 2, 2025. Added completion status tracking with visual indicators for completed vs pending weeks
- August 2, 2025. Implemented separate display of completed hours vs pending hours with clear explanatory text
- August 3, 2025. Removed vertical menu layout option - application now uses horizontal navigation only
- August 3, 2025. Cleaned up menu layout system and removed unused layout switching functionality
- August 3, 2025. Created comprehensive user guide (REVALPRO_USER_GUIDE.md) covering all features and functionality
- October 25, 2025. **CRITICAL FIX**: Fixed Stripe webhook endpoint hanging issue by moving webhook route registration before express.json() middleware
- October 25, 2025. Removed duplicate webhook endpoints that were causing conflicts and confusion
- October 25, 2025. **SECURITY FIX**: Added strict enforcement to prevent live Stripe keys from being used in development mode
- October 25, 2025. Application now requires TESTING_STRIPE_SECRET_KEY to be a test key (sk_test_...) in development for security

## Stripe Webhook Configuration

### Critical Setup Required
⚠️ **IMPORTANT**: The application will NOT start in development mode until you configure a valid Stripe test key.

**What you need to do:**
1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Switch to **TEST mode** (toggle at top of dashboard)
3. Copy your **test** secret key (starts with `sk_test_...`)
4. In Replit: Go to Tools → Secrets
5. Update `TESTING_STRIPE_SECRET_KEY` with your test key
6. Restart the application

**Why this is required:**
- Using live Stripe keys in development is a critical security vulnerability
- The application now enforces test keys only in development mode
- This prevents accidental charges and protects your production Stripe account

### Webhook Endpoint Setup
Once you have the correct test key configured, you can set up webhooks:
1. The webhook endpoint is available at `/webhook/stripe`
2. Visit `/api/setup-webhook` to automatically register the webhook with Stripe
3. Or manually add the webhook in your Stripe Dashboard:
   - URL: `https://your-repl-url.replit.dev/webhook/stripe`
   - Events to send: All subscription and payment events

## Stripe Sandbox Configuration

### Current Status
- Development mode enabled for testing without real Stripe integration
- Subscriptions are activated immediately for testing premium features
- Real Stripe checkout flow can be tested by adding ?useStripe=true query parameter
- Your actual Stripe price IDs are configured and ready for production use

### Working Stripe Test Price IDs
- Standard Monthly: `price_1RjUz709FiF6gHZcRlW5NFzr` (£4.99/month)
- Standard Annual: `price_1RjUzL09FiF6gHZc55zHojNz` (£49.99/year)
- Premium Monthly: `price_1RjUzN09FiF6gHZcLmfds428` (£9.99/month)
- Premium Annual: `price_1RjUzO09FiF6gHZci7WqEWro` (£89.99/year)

**Note**: These are working test price IDs that enable real Stripe checkout flow testing with test cards.

### Test Cards (For Future Real Stripe Testing)
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- Insufficient Funds: `4000 0000 0000 9995`
- 3D Secure: `4000 0027 6000 3184`

### Development Mode
- In development mode, subscriptions are activated immediately without payment
- This allows testing premium features without completing Stripe checkout
- To test real Stripe checkout, visit `/stripe-checkout-test` page
- Production mode requires actual Stripe payment processing

### Testing the Real Stripe Checkout
1. Go to `/auth` → Login with demo account
2. Go to `/stripe-checkout-test` → New dedicated test page
3. Click any "Test [Monthly/Annual] Checkout" button
4. See the actual Stripe payment form with card input fields
5. Use test card: 4242 4242 4242 4242 (any future date, any CVC)
6. Complete the payment flow

## User Preferences

Preferred communication style: Simple, everyday language.