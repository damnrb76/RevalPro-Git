import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signInWithGoogle } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function FirebaseTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const { toast } = useToast();

  const testFirebaseConfig = () => {
    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
    
    console.log("Firebase Config:", config);
    setTestResult({ type: "config", data: config });
  };

  const testGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      toast({
        title: "Testing Google Sign-In",
        description: "Attempting to sign in with Google...",
      });
      
      const user = await signInWithGoogle();
      console.log("Google Sign-In Success:", user);
      
      setTestResult({ 
        type: "success", 
        data: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }
      });
      
      toast({
        title: "Google Sign-In Successful",
        description: `Signed in as ${user.displayName || user.email}`,
      });
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setTestResult({ 
        type: "error", 
        data: {
          code: error.code,
          message: error.message,
          fullError: error
        }
      });
      
      toast({
        title: "Google Sign-In Failed",
        description: error.message || "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testBackendRegistration = async () => {
    try {
      const response = await fetch('/api/register-google-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'test_user',
          email: 'test@example.com',
          uid: 'test_uid_123',
          displayName: 'Test User'
        })
      });
      
      const data = await response.json();
      console.log("Backend Registration Test:", data);
      
      setTestResult({ 
        type: "backend", 
        data: { 
          status: response.status, 
          response: data 
        }
      });
      
      toast({
        title: "Backend Test Complete",
        description: `Status: ${response.status}`,
      });
    } catch (error) {
      console.error("Backend Registration Test Error:", error);
      setTestResult({ 
        type: "backend_error", 
        data: error.message
      });
      
      toast({
        title: "Backend Test Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Firebase Authentication Test</CardTitle>
          <CardDescription>
            Test Firebase configuration and Google sign-in functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={testFirebaseConfig} variant="outline">
              Check Firebase Config
            </Button>
            
            <Button 
              onClick={testGoogleSignIn} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Test Google Sign-In
            </Button>
            
            <Button onClick={testBackendRegistration} variant="secondary">
              Test Backend Registration
            </Button>
          </div>
          
          {testResult && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Test Result</CardTitle>
                <CardDescription>Type: {testResult.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}