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
import { BookOpen, ArrowRight } from "lucide-react";
import { Link } from "wouter";

// Demo account removed for production launch

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

          <Card className="p-6 border-2 border-revalpro-blue/30 shadow-md">
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
      <div className="flex-1 rounded-lg p-8 bg-gradient-to-br from-revalpro-blue/10 via-revalpro-teal/10 to-revalpro-orange/10 flex flex-col justify-center">
        <div className="max-w-md mx-auto md:mx-0 space-y-6">
          <h2 className="text-3xl font-bold bg-gradient-to-br from-revalpro-blue via-revalpro-teal to-revalpro-orange bg-clip-text text-transparent">
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
                <div className="h-6 w-6 rounded-full bg-revalpro-teal/20 flex items-center justify-center text-revalpro-teal shrink-0">✓</div>
                <p>Track practice hours, CPD, reflections and more</p>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-revalpro-teal/20 flex items-center justify-center text-revalpro-teal shrink-0">✓</div>
                <p>Get helpful reminders before your revalidation deadline</p>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-revalpro-orange/20 flex items-center justify-center text-revalpro-orange shrink-0">✓</div>
                <p>Export data and summaries for your submission</p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-revalpro-blue">
                <BookOpen className="h-5 w-5" />
                <h3 className="font-semibold">Need help with revalidation?</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Check out our blog for tips, guides, and insights to support your nursing revalidation journey
              </p>
              <Link href="/blog">
                <Button 
                  variant="outline" 
                  className="w-full gap-2 border-revalpro-blue/30 hover:bg-revalpro-blue/10 hover:border-revalpro-blue"
                  data-testid="button-view-blog"
                >
                  <BookOpen className="h-4 w-4" />
                  View Our Blog
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}