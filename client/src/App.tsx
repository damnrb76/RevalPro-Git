import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AuthPage from "@/pages/auth-page";
import PracticeHours from "@/pages/practice-hours";
import CPD from "@/pages/cpd";
import Feedback from "@/pages/feedback";
import Reflections from "@/pages/reflections";
import Declarations from "@/pages/declarations";
import Settings from "@/pages/settings";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import NavigationTabs from "@/components/layout/navigation-tabs";

// Import the logo
import logo from "@assets/Leonardo_Phoenix_10_design_a_vibrant_and_professional_logo_for_3.jpg";

function AppRouter() {
  const [location] = useLocation();
  const showTabs = location !== '/auth';

  return (
    <div className="min-h-screen flex flex-col">
      <Header logo={logo} />
      {showTabs && <NavigationTabs currentPath={location} />}
      <div className="flex-grow">
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/" component={Home} />
          <ProtectedRoute path="/practice-hours" component={PracticeHours} />
          <ProtectedRoute path="/cpd" component={CPD} />
          <ProtectedRoute path="/feedback" component={Feedback} />
          <ProtectedRoute path="/reflections" component={Reflections} />
          <ProtectedRoute path="/declarations" component={Declarations} />
          <ProtectedRoute path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer logo={logo} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="revalpro-theme">
          <TooltipProvider>
            <AppRouter />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
