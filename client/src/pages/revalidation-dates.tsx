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
import { Label } from "@/components/ui/label";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CalendarCheck } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

export default function RevalidationDates() {
  const { toast } = useToast();
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  
  // Dates calculation mutation
  const datesMutation = useMutation({
    mutationFn: async (date: string) => {
      const res = await apiRequest("POST", "/api/nmc/important-dates", { expiryDate: date });
      return await res.json();
    },
    onError: (error) => {
      toast({
        title: "Calculation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDatesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expiryDate) {
      toast({
        title: "Date Required",
        description: "Please select your registration expiry date",
        variant: "destructive",
      });
      return;
    }
    datesMutation.mutate(expiryDate.toISOString());
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-revalpro-blue">Revalidation Dates Calculator</h1>
      <p className="text-muted-foreground mb-8">
        Calculate important dates for your revalidation timeline based on your registration expiry
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Dates Calculator Form */}
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

        {/* Calculated Dates Results */}
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
    </div>
  );
}