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

## Stripe Sandbox Configuration

### Current Status
- Development mode enabled for testing without real Stripe integration
- Subscriptions are activated immediately for testing premium features
- Real Stripe checkout flow requires actual price IDs to be created in Stripe dashboard

### Test Price IDs (Placeholders)
- Standard Monthly: `price_test_standard_monthly` (needs creation in Stripe dashboard)
- Standard Annual: `price_test_standard_annual` (needs creation in Stripe dashboard)
- Premium Monthly: `price_test_premium_monthly` (needs creation in Stripe dashboard)
- Premium Annual: `price_test_premium_annual` (needs creation in Stripe dashboard)

### Test Cards (For Future Real Stripe Testing)
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- Insufficient Funds: `4000 0000 0000 9995`
- 3D Secure: `4000 0027 6000 3184`

### Development Mode
- In development mode, subscriptions are activated immediately without payment
- This allows testing premium features without completing Stripe checkout
- To enable real Stripe checkout, create actual products and prices in Stripe dashboard
- Production mode requires actual Stripe payment processing

## User Preferences

Preferred communication style: Simple, everyday language.