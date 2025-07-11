import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { MenuLayoutProvider, useMenuLayout } from "@/hooks/use-menu-layout";
import { ProtectedRoute } from "@/lib/protected-route";
import { PremiumThemeWrapper } from "@/components/layout/premium-theme-wrapper";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import AuthPage from "@/pages/auth-page";
import LandingPage from "@/pages/landing";
import PracticeHours from "@/pages/practice-hours";
import CPD from "@/pages/cpd";
import Feedback from "@/pages/feedback";
import Reflections from "@/pages/reflections";
import Declarations from "@/pages/declarations";
import Settings from "@/pages/settings";
import AiAssistant from "@/pages/ai-assistant";
import SubscriptionPage from "@/pages/subscription";
import CheckoutPage from "@/pages/checkout";
import SubscriptionSuccess from "@/pages/subscription-success";
import TestStripePage from "@/pages/test-stripe";
import StripeCheckoutTest from "@/pages/stripe-checkout-test";
import NmcVerification from "@/pages/nmc-verification";
import NmcRegistrationCheck from "@/pages/nmc-registration-check";
import RevalidationDates from "@/pages/revalidation-dates";
import NmcResources from "@/pages/nmc-resources";

import SummaryInfographic from "@/pages/summary-infographic";
import AdminPanel from "@/pages/admin-panel";
import PrivacyPolicyPage from "@/pages/privacy-policy";
import BetaSignupPage from "@/pages/beta-signup";
import BetaApplicationsPage from "@/pages/beta-applications";
import SimpleBetaView from "@/pages/simple-beta-view";

import Footer from "@/components/layout/footer";
import NavigationTabs from "@/components/layout/navigation-tabs";
import ProminentHeader from "@/components/layout/prominent-header";


// Import the logo
import logo from "@assets/Leonardo_Phoenix_10_design_a_vibrant_and_professional_logo_for_3.jpg";

function AppRouter() {
  const [location] = useLocation();
  const { layout } = useMenuLayout();
  const isVerticalMenu = layout === "vertical";
  const isComingSoonPage = location === '/' && window.location.hostname === 'revalpro.co.uk';
  const isPrivacyPage = location === '/privacy-policy' && window.location.hostname === 'revalpro.co.uk';
  const isBetaSignupPage = location === '/beta-signup';
  const isBetaApplicationsPage = location === '/beta-applications';
  const showTabs = location !== '/auth' && location !== '/landing' && !isComingSoonPage && !isPrivacyPage && !isBetaSignupPage && !isBetaApplicationsPage;
  const isAuthPage = location === '/auth';
  const isLandingPage = location === '/landing';
  const showAppHeader = !isLandingPage && !isComingSoonPage && !isPrivacyPage && !isBetaSignupPage;
  
  return (
    <div className={`min-h-screen flex flex-col ${isVerticalMenu && showTabs ? 'pl-64' : ''}`}>
      {showAppHeader && <ProminentHeader />}
      {showTabs && <NavigationTabs currentPath={location} />}
      <div className={`flex-grow ${!isAuthPage && !isLandingPage ? 'pt-4' : ''}`}>
        <Switch>
          {/* Main route */}
          <Route path="/" component={AuthPage} />
          
          {/* Development access route for testing app features */}
          <Route path="/app" component={LandingPage} />
          
          {/* Original Routes - Still accessible on the Replit domain */}
          <Route path="/landing" component={LandingPage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/original" component={LandingPage} />
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/home" component={Home} />
          <ProtectedRoute path="/practice-hours" component={PracticeHours} />
          <ProtectedRoute path="/cpd" component={CPD} />
          <ProtectedRoute path="/feedback" component={Feedback} />
          <ProtectedRoute path="/reflections" component={Reflections} />
          <ProtectedRoute path="/declarations" component={Declarations} />
          <ProtectedRoute path="/settings" component={Settings} />
          <ProtectedRoute path="/ai-assistant" component={AiAssistant} />
          
          {/* NMC Related Routes */}
          <ProtectedRoute path="/nmc-verification" component={NmcVerification} />
          <ProtectedRoute path="/nmc-registration-check" component={NmcRegistrationCheck} />
          <ProtectedRoute path="/revalidation-dates" component={RevalidationDates} />
          <ProtectedRoute path="/nmc-resources" component={NmcResources} />

          
          {/* Infographic Routes - Changed to regular Route for preview */}
          <Route path="/summary-infographic" component={SummaryInfographic} />
          
          {/* Subscription Routes */}
          <ProtectedRoute path="/subscription" component={SubscriptionPage} />
          <ProtectedRoute path="/checkout" component={CheckoutPage} />
          <ProtectedRoute path="/subscription/success" component={SubscriptionSuccess} />
          
          {/* Test page - accessible without authentication */}
          <Route path="/test-stripe" component={TestStripePage} />
          
          {/* Real Stripe checkout test page */}
          <ProtectedRoute path="/stripe-checkout-test" component={StripeCheckoutTest} />
          
          {/* Admin Panel Routes */}
          <ProtectedRoute path="/admin" component={AdminPanel} />
          <ProtectedRoute path="/admin-panel" component={AdminPanel} />
          
          {/* Privacy Policy Route */}
          <Route path="/privacy-policy" component={PrivacyPolicyPage} />
          
          {/* Beta Signup Route */}
          <Route path="/beta-signup" component={BetaSignupPage} />
          
          {/* Beta Applications View */}
          <Route path="/beta-applications" component={BetaApplicationsPage} />
          
          {/* Simple Beta Applications View */}
          <Route path="/simple-beta" component={SimpleBetaView} />
          

          
          <Route component={NotFound} />
        </Switch>
      </div>
      {!isLandingPage && !isComingSoonPage && !isPrivacyPage && !isBetaSignupPage && <Footer logo={logo} className={isVerticalMenu && showTabs ? 'ml-64' : ''} />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MenuLayoutProvider>
          <ThemeProvider defaultTheme="light" storageKey="revalpro-theme">
            <TooltipProvider>
              <PremiumThemeWrapper>
                <AppRouter />
              </PremiumThemeWrapper>

              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </MenuLayoutProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;