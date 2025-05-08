import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
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

function App() {
  const [location] = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="revalpro-theme">
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Header logo={logo} />
            <NavigationTabs currentPath={location} />
            <div className="flex-grow">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/practice-hours" component={PracticeHours} />
                <Route path="/cpd" component={CPD} />
                <Route path="/feedback" component={Feedback} />
                <Route path="/reflections" component={Reflections} />
                <Route path="/declarations" component={Declarations} />
                <Route path="/settings" component={Settings} />
                <Route component={NotFound} />
              </Switch>
            </div>
            <Footer logo={logo} />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
