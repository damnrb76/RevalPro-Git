
import { useState } from "react";
import { Redirect, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import UserProfileForm from "@/components/forms/user-profile-form";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userProfileStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, UserPlus, FileText } from "lucide-react";
export default function ProfileSetupPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user profile exists - call all hooks before any conditional logic
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      return userProfileStorage.getCurrent();
    },
  });

  // Handle redirects after all hooks are called
  if (!user) {
    return <Redirect to="/auth" />;
  }

  if (user.hasCompletedInitialSetup) {
    return <Redirect to="/dashboard" />;
  }

  const handleFormSuccess = async () => {
    setIsFormOpen(false);
    
    try {
      // Mark user as having completed initial setup
      const response = await fetch('/api/user/complete-setup', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete setup');
      }

      // Update user data in cache
      queryClient.setQueryData(['/api/user'], (oldData: any) => ({
        ...oldData,
        hasCompletedInitialSetup: true,
      }));

      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      toast({
        title: "Welcome to RevalPro!",
        description: "Your profile has been set up successfully.",
      });

      // Brief delay to show success message, then redirect
      setTimeout(() => {
        setLocation("/dashboard");
      }, 1500);
      
    } catch (error) {
      toast({
        title: "Setup completion failed",
        description: "Your profile was saved but we couldn't complete the setup. Please try refreshing the page.",
        variant: "destructive",
      });
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const steps = [
    {
      icon: UserPlus,
      title: "Personal Details",
      description: "Enter your name and contact information",
      status: "current" as const,
    },
    {
      icon: FileText,
      title: "NMC Registration",
      description: "Add your NMC PIN and expiry date",
      status: "upcoming" as const,
    },
    {
      icon: CheckCircle,
      title: "Complete Setup",
      description: "Start tracking your revalidation",
      status: "upcoming" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-nhs-black mb-2">
              Welcome to RevalPro! 👋
            </h1>
            <p className="text-lg text-nhs-dark-grey">
              Let's set up your profile to start tracking your NMC revalidation
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    step.status === 'current' 
                      ? 'bg-revalpro-blue text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <div className={`font-medium text-sm ${
                      step.status === 'current' ? 'text-revalpro-blue' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {step.description}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden sm:block absolute w-8 h-px bg-gray-300 translate-x-8 -translate-y-6" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Setup Card */}
          <Card className="border-2 border-revalpro-blue/20 shadow-lg">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-nhs-black">
                Complete Your Profile
              </CardTitle>
              <CardDescription className="text-base">
                We need a few essential details to ensure NMC compliance and accurate revalidation tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 border-l-4 border-revalpro-blue p-4 rounded-r">
                  <div className="text-sm">
                    <p className="font-medium text-revalpro-blue mb-1">What we'll collect:</p>
                    <ul className="text-gray-700 space-y-1">
                      <li>• Full name (as registered with NMC)</li>
                      <li>• NMC PIN (registration number)</li>
                      <li>• Current registration expiry date</li>
                      <li>• Job title and email (optional)</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={() => setIsFormOpen(true)}
                  className="w-full sm:w-auto bg-revalpro-blue hover:bg-revalpro-blue/90"
                  size="lg"
                >
                  Set Up My Profile
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Your data is stored securely on your device and never shared with third parties
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <UserProfileForm
          initialData={userProfile || null}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      </Dialog>
    </div>
  );
      }
