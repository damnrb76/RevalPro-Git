import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDateFull } from "@/lib/date-utils";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Search } from "lucide-react";

export default function NmcRegistrationCheck() {
  const { toast } = useToast();
  const [pin, setPin] = useState("");
  
  // Verification mutation
  const verifyMutation = useMutation({
    mutationFn: async (pin: string) => {
      const res = await apiRequest("POST", "/api/nmc/verify", { pin });
      return await res.json();
    },
    onError: (error) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      toast({
        title: "PIN Required",
        description: "Please enter your NMC PIN number",
        variant: "destructive",
      });
      return;
    }
    verifyMutation.mutate(pin);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-revalpro-blue">NMC Registration Check</h1>
      <p className="text-muted-foreground mb-8">
        Verify your registration status with the Nursing & Midwifery Council
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Registration Verification Form */}
        <Card>
          <CardHeader>
            <CardTitle>Check Registration Status</CardTitle>
            <CardDescription>
              Enter your NMC PIN to verify your registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nmcPin">NMC PIN</Label>
                <Input
                  id="nmcPin"
                  placeholder="e.g. 00A0000A"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Your PIN is your unique NMC registration number
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!pin || verifyMutation.isPending}
              >
                {verifyMutation.isPending ? (
                  <>Checking...</>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Verify Registration
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Alert variant="default" className="w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Information is fetched directly from the NMC and is accurate as of today
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>

        {/* Registration Results */}
        {verifyMutation.isSuccess && (
          <Card className="mt-6 md:mt-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Verification Results</CardTitle>
                <Badge variant={
                  verifyMutation.data.registrationStatus === 'Registered'
                    ? 'completed'
                    : verifyMutation.data.registrationStatus === 'Lapsed'
                      ? 'attention-needed'
                      : 'destructive'
                }>
                  {verifyMutation.data.registrationStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">PIN</div>
                    <div>{verifyMutation.data.pin}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Name</div>
                    <div>{verifyMutation.data.name || "Not available"}</div>
                  </div>
                  {verifyMutation.data.expiryDate && (
                    <div className="col-span-2">
                      <div className="text-sm font-medium">Expiry Date</div>
                      <div>{formatDateFull(verifyMutation.data.expiryDate)}</div>
                    </div>
                  )}
                </div>

                {verifyMutation.data.error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {verifyMutation.data.error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}