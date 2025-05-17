import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { MenuLayoutProvider, useMenuLayout } from "@/hooks/use-menu-layout";
import { ProtectedRoute } from "@/lib/protected-route";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
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
import SubscriptionSuccess from "@/pages/subscription-success";
import NmcVerification from "@/pages/nmc-verification";
import NmcRegistrationCheck from "@/pages/nmc-registration-check";
import RevalidationDates from "@/pages/revalidation-dates";
import NmcResources from "@/pages/nmc-resources";
import NmcServiceStatus from "@/pages/nmc-service-status";
import TesterFeedback from "@/pages/tester-feedback";
import SummaryInfographic from "@/pages/summary-infographic";
import SneakPeekPage from "@/pages/sneak-peek";
import ComingSoonPage from "@/pages/coming-soon";
import Footer from "@/components/layout/footer";
import NavigationTabs from "@/components/layout/navigation-tabs";
import ProminentHeader from "@/components/layout/prominent-header";
import WelcomePopupWrapper from "@/components/welcome-popup-wrapper";

// Import the logo
import logo from "@assets/Leonardo_Phoenix_10_design_a_vibrant_and_professional_logo_for_3.jpg";

function AppRouter() {
  const [location] = useLocation();
  const { layout } = useMenuLayout();
  const isVerticalMenu = layout === "vertical";
  const showTabs = location !== '/auth' && location !== '/landing';
  const isAuthPage = location === '/auth';
  const isLandingPage = location === '/landing';
  const showAppHeader = !isLandingPage && location !== '/';
  
  return (
    <div className={`min-h-screen flex flex-col ${isVerticalMenu && showTabs ? 'pl-64' : ''}`}>
      {showAppHeader && <ProminentHeader />}
      {showTabs && <NavigationTabs currentPath={location} />}
      <div className={`flex-grow ${!isAuthPage && !isLandingPage ? 'pt-4' : ''}`}>
        <Switch>
          <Route path="/landing" component={LandingPage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/" component={LandingPage} />
          <ProtectedRoute path="/dashboard" component={Home} />
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
          <ProtectedRoute path="/nmc-service-status" component={NmcServiceStatus} />
          
          {/* Tester Feedback */}
          <Route path="/tester-feedback" component={TesterFeedback} />
          
          {/* Infographic Routes - Changed to regular Route for preview */}
          <Route path="/summary-infographic" component={SummaryInfographic} />
          
          {/* Sneak Peek Page */}
          <Route path="/sneak-peek" component={SneakPeekPage} />
          
          {/* Subscription Routes */}
          <ProtectedRoute path="/subscription" component={SubscriptionPage} />
          <ProtectedRoute path="/subscription/success" component={SubscriptionSuccess} />
          <Route component={NotFound} />
        </Switch>
      </div>
      {!isLandingPage && <Footer logo={logo} className={isVerticalMenu && showTabs ? 'ml-64' : ''} />}
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
              <AppRouter />
              <WelcomePopupWrapper />
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </MenuLayoutProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;