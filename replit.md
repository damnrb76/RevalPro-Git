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
- Premium Annual: `price_1RjUzO09FiF6gHZci7WqEWro` (£99.99/year)

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