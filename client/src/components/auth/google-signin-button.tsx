import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { signInWithGoogle } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { loginMutation } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      // Display a message to the user
      toast({
        title: "Google Sign-In",
        description: "Connecting to Google...",
      });
      
      // Sign in with Google
      const user = await signInWithGoogle();
      
      if (!user) {
        throw new Error("Failed to sign in with Google");
      }
      
      // Use email as username (trim domain for simplicity)
      const username = user.email?.split('@')[0] || 'google_user';
      
      // Try to register or login the user in our system
      try {
        // First try to login 
        await loginMutation.mutateAsync({ 
          username, 
          password: `google_${user.uid}` // Use Google UID as password (for matching)
        });
        
        toast({
          title: "Success!",
          description: "You're now signed in with Google",
        });
      } catch (error) {
        console.log("Login failed, trying to register new user:", error);
        
        // If login fails, it might be a new user, so try to register
        toast({
          title: "Welcome to RevalPro!",
          description: "Creating your account...",
        });
        
        // Try to perform the backend registration
        try {
          const registerResponse = await fetch('/api/register-google-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username,
              email: user.email,
              uid: user.uid,
              displayName: user.displayName
            })
          });
          
          if (!registerResponse.ok) {
            const errorData = await registerResponse.json();
            console.error("Registration error:", errorData);
            throw new Error(errorData.error || "Failed to create account");
          }
          
          // Now try to login again with the newly created account
          await loginMutation.mutateAsync({ 
            username, 
            password: `google_${user.uid}` 
          });
          
          toast({
            title: "Account created!",
            description: "Your new account has been set up successfully.",
          });
        } catch (registerError) {
          console.error("Registration error:", registerError);
          throw new Error("Failed to create account - please try again or use email signup");
        }
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Authentication failed",
        description: error.message || "Could not sign in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 py-6 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <svg
          className="h-5 w-5"
          aria-hidden="true"
          viewBox="0 0 24 24"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      )}
      <span>{isLoading ? "Signing in..." : "Sign in with Google"}</span>
    </Button>
  );
}