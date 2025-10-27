# RevalPro - Nursing Revalidation Application

## Overview
RevalPro is a UK-specific nursing revalidation tracker application for NHS nurses. It helps them manage NMC revalidation requirements by tracking practice hours, CPD activities, reflective accounts, feedback, and other mandatory elements on a secure, user-friendly platform. The project aims to provide a comprehensive tool to simplify and streamline the revalidation process for healthcare professionals.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
- **Styling**: Tailwind CSS with custom NHS/NMC color schemes.
- **UI Components**: Radix UI primitives with shadcn/ui component library.
- **Design**: Mobile-first, Progressive Web App (PWA) for healthcare professionals.

### Technical Implementations
- **Frontend**: React 18, TypeScript, Vite, Wouter for routing, TanStack Query for server state, IndexedDB for client-side persistence.
- **Backend**: Node.js with Express.js, TypeScript, PostgreSQL with Drizzle ORM (Neon Database).
- **Authentication**: Passport.js with local strategy, session management, and Google OAuth support.
- **AI Integration**: Multiple AI providers (OpenAI GPT-4o primary, Google Gemini, Anthropic Claude) with server-side API key management and specialized NMC-specific prompts.
- **Security**: Client-first data storage (IndexedDB), GDPR compliance, configurable session security, and data export (JSON, PDF).

### Feature Specifications
- **Data Models**: User Profiles, Practice Hours, CPD Records, Feedback Records, Reflective Accounts, Health Declarations, Confirmation Records.
- **Core Functionality**: Data entry, AI assistance, progress tracking, revalidation document generation.
- **Subscription Management**: 
  - Integrated with Stripe for billing and subscription management
  - Secure webhook handling for subscription lifecycle events
  - Smart upgrade detection: Automatically modifies existing subscriptions instead of creating duplicates
  - Supports both new subscriptions and plan upgrades/changes seamlessly

### System Design Choices
- **Client-First Architecture**: Prioritizes local data storage (IndexedDB) for privacy and offline capability.
- **Hybrid Authentication**: Offers both traditional and Google OAuth login options.
- **Server-Side AI Integration**: API keys are securely managed on the backend.

## External Dependencies

- **AI Services**:
    - OpenAI API (GPT-4o)
    - Google Gemini
    - Anthropic Claude

- **Authentication**:
    - Google OAuth (Firebase Authentication)
    - Express-session

- **Database**:
    - Neon Database (PostgreSQL hosting)
    - Drizzle ORM

- **Payment Processing**:
    - Stripe (Subscription management, billing)

- **Email Services**:
    - Nodemailer (Gmail SMTP)
    - SendGrid (alternative)