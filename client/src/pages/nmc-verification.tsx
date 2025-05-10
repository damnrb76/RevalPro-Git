import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  SearchIcon,
  BookOpen,
  CalendarCheck,
  Server,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Types
interface RegistrationVerificationResult {
  pin: string;
  name: string;
  registrationStatus: 'Registered' | 'Lapsed' | 'Not Found';
  expiryDate?: string;
  qualifications?: string[];
  error?: string;
}

interface RevalidationServiceStatus {
  status: 'Available' | 'Unavailable' | 'Maintenance';
  lastChecked: string;
}

interface NmcDates {
  applicationDeadline?: string;
  revalidationDeadline?: string;
  renewalPeriodStart?: string;
  renewalPeriodEnd?: string;
}

export default function NmcVerificationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pin, setPin] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);

  // Check NMC service status
  const { data: serviceStatus, isLoading: statusLoading } = useQuery<RevalidationServiceStatus>({
    queryKey: ["/api/nmc/service-status"],
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get revalidation requirements
  const { data: requirements, isLoading: requirementsLoading } = useQuery<string[]>({
    queryKey: ["/api/nmc/revalidation-requirements"],
    refetchOnWindowFocus: false,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Mutation for verifying registration
  const verifyMutation = useMutation({
    mutationFn: async (data: { pin: string; dateOfBirth?: string }) => {
      const response = await apiRequest("POST", "/api/nmc/verify-registration", data);
      return response.json();
    },
    onSuccess: (data: RegistrationVerificationResult) => {
      if (data.error) {
        toast({
          title: "Verification Error",
          description: data.error,
          variant: "destructive",
        });
      } else if (data.registrationStatus === "Registered") {
        toast({
          title: "Registration Verified",
          description: `Registration is active until ${formatDateFull(data.expiryDate || "")}`,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Could not verify registration. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mutation for calculating important dates
  const datesMutation = useMutation({
    mutationFn: async (data: { expiryDate: string }) => {
      const response = await apiRequest("POST", "/api/nmc/important-dates", data);
      return response.json();
    },
    onSuccess: (data: NmcDates) => {
      toast({
        title: "Dates Calculated",
        description: "Your revalidation dates have been calculated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Calculation Failed",
        description: error.message || "Could not calculate revalidation dates. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle verification form submission
  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      toast({
        title: "Validation Error",
        description: "Please enter your NMC PIN",
        variant: "destructive",
      });
      return;
    }

    verifyMutation.mutate({
      pin,
      dateOfBirth: dateOfBirth ? dateOfBirth.toISOString() : undefined,
    });
  };

  // Handle dates calculation form submission
  const handleDatesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expiryDate) {
      toast({
        title: "Validation Error",
        description: "Please enter your registration expiry date",
        variant: "destructive",
      });
      return;
    }

    datesMutation.mutate({
      expiryDate: expiryDate.toISOString(),
    });
  };

  // Link to NMC services
  const nmcLinks = {
    login: 'https://www.nmc.org.uk/login/',
    register: 'https://www.nmc.org.uk/registration/joining-the-register/',
    revalidation: 'https://www.nmc.org.uk/revalidation/',
    searchRegister: 'https://www.nmc.org.uk/registration/search-the-register/',
    standards: 'https://www.nmc.org.uk/standards/',
    theCode: 'https://www.nmc.org.uk/standards/code/',
    contact: 'https://www.nmc.org.uk/contact-us/'
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-revalpro-blue to-revalpro-fuchsia bg-clip-text text-transparent">
        NMC Integration
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        Connect with the Nursing & Midwifery Council portal
      </p>

      {/* Service Status */}
      <div className="mb-8">
        <Alert variant={serviceStatus?.status === 'Available' ? 'default' : 'destructive'}>
          {statusLoading ? (
            <Server className="h-4 w-4 animate-pulse" />
          ) : serviceStatus?.status === 'Available' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            NMC Services: {statusLoading ? "Checking..." : serviceStatus?.status}
          </AlertTitle>
          <AlertDescription>
            {statusLoading
              ? "Checking NMC service availability..."
              : serviceStatus?.status === 'Available'
                ? "NMC services are currently available."
                : serviceStatus?.status === 'Maintenance'
                  ? "NMC services are currently under maintenance. Please try again later."
                  : "NMC services are currently unavailable. Please try again later or visit the NMC website directly."}
            {serviceStatus && (
              <div className="text-xs mt-1">
                Last checked: {formatDateFull(serviceStatus.lastChecked)}
              </div>
            )}
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="verify" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="verify">Verify Registration</TabsTrigger>
          <TabsTrigger value="dates">Revalidation Dates</TabsTrigger>
          <TabsTrigger value="links">NMC Links</TabsTrigger>
        </TabsList>

        {/* Registration Verification Tab */}
        <TabsContent value="verify">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Verify Your NMC Registration</CardTitle>
                <CardDescription>
                  Check your registration status with the Nursing & Midwifery Council
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerifySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pin">NMC PIN Number</Label>
                    <Input
                      id="pin"
                      placeholder="e.g. 12A3456E"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Your NMC PIN is your unique registration number
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth (Optional)</Label>
                    <DatePicker
                      id="dob"
                      date={dateOfBirth}
                      setDate={setDateOfBirth}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      Optional: For more accurate verification
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!pin || verifyMutation.isPending}
                  >
                    {verifyMutation.isPending ? (
                      <>Verifying...</>
                    ) : (
                      <>
                        <SearchIcon className="mr-2 h-4 w-4" />
                        Verify Registration
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={nmcLinks.searchRegister}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Go to NMC Register <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registration Requirements</CardTitle>
                <CardDescription>
                  Current NMC revalidation requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {requirementsLoading ? (
                  <div className="py-8 text-center">Loading requirements...</div>
                ) : (
                  <ul className="space-y-3">
                    {requirements?.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a
                    href={nmcLinks.revalidation}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Full Revalidation Guidelines
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Verification Results */}
          {verifyMutation.isSuccess && (
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Verification Results</CardTitle>
                  <Badge variant={
                    verifyMutation.data.registrationStatus === 'Registered'
                      ? 'success'
                      : verifyMutation.data.registrationStatus === 'Lapsed'
                        ? 'warning'
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
        </TabsContent>

        {/* Revalidation Dates Tab */}
        <TabsContent value="dates">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Calculate Revalidation Dates</CardTitle>
                <CardDescription>
                  Plan your revalidation timeline based on your registration expiry date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDatesSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Registration Expiry Date</Label>
                    <DatePicker
                      id="expiryDate"
                      date={expiryDate}
                      setDate={setExpiryDate}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter the date your current NMC registration expires
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!expiryDate || datesMutation.isPending}
                  >
                    {datesMutation.isPending ? (
                      <>Calculating...</>
                    ) : (
                      <>
                        <CalendarCheck className="mr-2 h-4 w-4" />
                        Calculate Dates
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  NMC allows revalidation submission from 60 days before your expiry date
                </p>
              </CardFooter>
            </Card>

            {/* Calculated Dates */}
            {datesMutation.isSuccess && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Revalidation Timeline</CardTitle>
                  <CardDescription>
                    Key dates for your revalidation process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Renewal Period</Label>
                      <div className="font-medium">
                        {datesMutation.data.renewalPeriodStart && datesMutation.data.renewalPeriodEnd ? (
                          <>
                            {formatDateFull(datesMutation.data.renewalPeriodStart)} to{" "}
                            {formatDateFull(datesMutation.data.renewalPeriodEnd)}
                          </>
                        ) : (
                          "Not available"
                        )}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <Label className="text-sm text-muted-foreground">Application Deadline</Label>
                      <div className="font-medium">
                        {datesMutation.data.applicationDeadline
                          ? formatDateFull(datesMutation.data.applicationDeadline)
                          : "Not available"}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <Label className="text-sm text-muted-foreground">Revalidation Deadline</Label>
                      <div className="font-medium">
                        {datesMutation.data.revalidationDeadline
                          ? formatDateFull(datesMutation.data.revalidationDeadline)
                          : "Not available"}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Alert variant="default" className="w-full">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Add these dates to your calendar to ensure you don't miss any deadlines
                    </AlertDescription>
                  </Alert>
                </CardFooter>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* NMC Links Tab */}
        <TabsContent value="links">
          <Card>
            <CardHeader>
              <CardTitle>NMC Online Resources</CardTitle>
              <CardDescription>
                Quick links to important NMC services and resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Button asChild variant="outline" className="h-auto py-4 justify-start">
                  <a
                    href={nmcLinks.login}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-start"
                  >
                    <span className="font-semibold">NMC Online</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      Log in to your NMC Online account
                    </span>
                  </a>
                </Button>

                <Button asChild variant="outline" className="h-auto py-4 justify-start">
                  <a
                    href={nmcLinks.revalidation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-start"
                  >
                    <span className="font-semibold">Revalidation</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      Official revalidation guidance from the NMC
                    </span>
                  </a>
                </Button>

                <Button asChild variant="outline" className="h-auto py-4 justify-start">
                  <a
                    href={nmcLinks.searchRegister}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-start"
                  >
                    <span className="font-semibold">Search Register</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      Check registration status of any nurse or midwife
                    </span>
                  </a>
                </Button>

                <Button asChild variant="outline" className="h-auto py-4 justify-start">
                  <a
                    href={nmcLinks.theCode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-start"
                  >
                    <span className="font-semibold">The Code</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      Professional standards for nurses and midwives
                    </span>
                  </a>
                </Button>

                <Button asChild variant="outline" className="h-auto py-4 justify-start">
                  <a
                    href={nmcLinks.standards}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-start"
                  >
                    <span className="font-semibold">Standards</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      NMC professional standards and guidance
                    </span>
                  </a>
                </Button>

                <Button asChild variant="outline" className="h-auto py-4 justify-start">
                  <a
                    href={nmcLinks.contact}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-start"
                  >
                    <span className="font-semibold">Contact NMC</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      Get support from the NMC directly
                    </span>
                  </a>
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Note: Links open the official NMC website in a new tab
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}