import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Redirect } from "wouter";
import RegisterForm from "@/components/auth/register-form";
import LoginForm from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

function DemoLoginButton() {
  const { toast } = useToast();

  const handleDemoLogin = async () => {
    try {
      toast({
        title: "Setting up demo account...",
        description: "This may take a moment",
      });

      console.log("Creating demo account...");
      
      // First create demo account
      const createResponse = await fetch("/api/create-demo-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: "premium" }),
        credentials: "include",
      });

      console.log("Create response status:", createResponse.status);

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        console.error("Demo account creation failed:", errorData);
        throw new Error(errorData.error || "Failed to create demo account");
      }

      const createData = await createResponse.json();
      console.log("Demo account created:", createData);

      // Then login
      console.log("Attempting demo login...");
      const response = await fetch("/api/demo-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for session cookies
      });

      console.log("Login response status:", response.status);

      if (response.ok) {
        const user = await response.json();
        console.log("Demo login successful:", user);
        
        // Update auth state immediately
        queryClient.setQueryData(["/api/user"], user);
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
        
        toast({
          title: "Demo Login Successful",
          description: `Logged in as ${user.username} with ${user.currentPlan?.toUpperCase()} plan`,
        });
        
        // Force immediate redirect
        window.location.href = "/dashboard";
      } else {
        const errorData = await response.json();
        console.error("Demo login failed:", errorData);
        throw new Error(errorData.error || "Demo login failed");
      }
    } catch (error) {
      console.error("Demo login error:", error);
      toast({
        title: "Demo Login Failed",
        description: (error as Error).message || "Please try again or use regular login",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleDemoLogin}
      variant="outline" 
      className="w-full bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100"
    >
      ⭐ Try Demo (Premium Plan)
    </Button>
  );
}

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user } = useAuth();

  // If user is already logged in, redirect based on setup completion
  if (user) {
    if (!user.hasCompletedInitialSetup) {
      return <Redirect to="/profile-setup" />;
    }
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="container flex flex-col md:flex-row items-stretch min-h-[calc(100vh-16rem)] py-10 gap-8">
      {/* Left side - Forms */}
      <div className="flex-1 w-full max-w-md mx-auto md:mx-0">
        <div className="space-y-6">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-bold logo-text">Welcome to RevalPro</h1>
            <p className="text-muted-foreground">
              Your secure UK nursing revalidation partner
            </p>
          </div>

          <Card className="p-6 border-2 border-revalpro-blue/20 shadow-md">
            <div className="mb-6">
              <DemoLoginButton />
            </div>
            
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-xs text-gray-500">OR SIGN IN WITH EMAIL</span>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Right side - Hero Section */}
      <div className="flex-1 rounded-lg p-8 bg-gradient-to-br from-revalpro-fuchsia/10 via-revalpro-blue/20 to-revalpro-teal/10 flex flex-col justify-center">
        <div className="max-w-md mx-auto md:mx-0 space-y-6">
          <h2 className="text-3xl font-bold bg-gradient-to-br from-revalpro-fuchsia to-revalpro-blue bg-clip-text text-transparent">
            Simplify Your Revalidation Journey
          </h2>
          
          <div className="space-y-4">
            <p className="text-xl">
              RevalPro helps UK nurses manage NMC revalidation requirements with ease.
            </p>
            
            <div className="grid gap-3">
              <div className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-revalpro-blue/20 flex items-center justify-center text-revalpro-blue shrink-0">✓</div>
                <p>All data stored securely on your device</p>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-revalpro-fuchsia/20 flex items-center justify-center text-revalpro-fuchsia shrink-0">✓</div>
                <p>Track practice hours, CPD, reflections and more</p>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-revalpro-teal/20 flex items-center justify-center text-revalpro-teal shrink-0">✓</div>
                <p>Get helpful reminders before your revalidation deadline</p>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-revalpro-purple/20 flex items-center justify-center text-revalpro-purple shrink-0">✓</div>
                <p>Export data and summaries for your submission</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}