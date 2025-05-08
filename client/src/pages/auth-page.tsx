import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegisterForm from "@/components/auth/register-form";
import LoginForm from "@/components/auth/login-form";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, isLoading } = useAuth();

  // Redirect to homepage if already logged in
  if (user && !isLoading) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-revalpro-light-grey to-revalpro-white">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-revalpro-blue via-revalpro-purple to-revalpro-pink bg-clip-text text-transparent">
              RevalPro
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-revalpro-dark-blue">
              Nursing Revalidation Made Easy
            </h2>
            <p className="mt-4 text-revalpro-black">
              Simplify your NMC revalidation process with our secure tracking system.
              Stay organized and prepared for your three-year revalidation cycle.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="h-6 w-6 rounded-full bg-revalpro-green flex items-center justify-center text-white">
                ✓
              </div>
              <div>
                <h3 className="font-medium text-revalpro-dark-blue">Track Practice Hours</h3>
                <p className="text-sm text-revalpro-black">Record and monitor your 450 required practice hours</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="h-6 w-6 rounded-full bg-revalpro-blue flex items-center justify-center text-white">
                ✓
              </div>
              <div>
                <h3 className="font-medium text-revalpro-dark-blue">Manage CPD Requirements</h3>
                <p className="text-sm text-revalpro-black">Organize your 35 hours including 20 participatory learning</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="h-6 w-6 rounded-full bg-revalpro-orange flex items-center justify-center text-white">
                ✓
              </div>
              <div>
                <h3 className="font-medium text-revalpro-dark-blue">Document Feedback</h3>
                <p className="text-sm text-revalpro-black">Collect and store your 5 pieces of practice feedback</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="h-6 w-6 rounded-full bg-revalpro-purple flex items-center justify-center text-white">
                ✓
              </div>
              <div>
                <h3 className="font-medium text-revalpro-dark-blue">Secure & Private</h3>
                <p className="text-sm text-revalpro-black">All your data remains securely stored on your device</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Auth Form */}
        <Card className="w-full shadow-lg border-revalpro-grey">
          <CardHeader>
            <CardTitle className="text-revalpro-dark-blue text-xl">
              {activeTab === "login" ? "Sign In to RevalPro" : "Create Your RevalPro Account"}
            </CardTitle>
            <CardDescription>
              {activeTab === "login"
                ? "Access your revalidation progress and records"
                : "Start tracking your nursing revalidation requirements"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}