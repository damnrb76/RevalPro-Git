import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, ListCheck } from "lucide-react";
import { calculatePercentage, getColorFromPercentage } from "@/lib/utils";
import { formatDateFull } from "@/lib/date-utils";
import { downloadRevalidationSummary } from "@/lib/pdf-generator";
import type { UserProfile } from "@shared/schema";

type RevalidationSummaryProps = {
  userProfile: UserProfile | null;
  practiceHours: number;
  cpdHours: number;
  participatoryHours: number;
  feedbackCount: number;
  reflectionsCount: number;
};

export default function RevalidationSummary({
  userProfile,
  practiceHours,
  cpdHours,
  participatoryHours,
  feedbackCount,
  reflectionsCount
}: RevalidationSummaryProps) {
  // Calculate percentages
  const practiceHoursPercentage = calculatePercentage(practiceHours, 450);
  const cpdPercentage = calculatePercentage(cpdHours, 35);
  const feedbackPercentage = calculatePercentage(feedbackCount, 5);
  const reflectionPercentage = calculatePercentage(reflectionsCount, 5);
  
  // Calculate overall percentage (simplified version)
  const overallPercentage = Math.round(
    (practiceHoursPercentage + cpdPercentage + feedbackPercentage + reflectionPercentage) / 4
  );
  
  // Handle export summary
  const handleExportSummary = async () => {
    try {
      await downloadRevalidationSummary();
    } catch (error) {
      console.error("Failed to export summary:", error);
    }
  };
  
  return (
    <section className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Your Revalidation Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-nhs-dark-grey">Overall Completion</span>
                  <span className="text-sm font-medium text-nhs-dark-grey">{overallPercentage}%</span>
                </div>
                <Progress 
                  value={overallPercentage} 
                  max={100} 
                  variant={getColorFromPercentage(overallPercentage).replace('bg-', '') as any}
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Practice Hours (450 required)</span>
                    <span className="font-medium">{practiceHours}/450</span>
                  </div>
                  <Progress 
                    value={practiceHours} 
                    max={450} 
                    variant="nhs-blue"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CPD Hours (35 required)</span>
                    <span className="font-medium">{cpdHours}/35</span>
                  </div>
                  <Progress 
                    value={cpdHours} 
                    max={35} 
                    variant="nhs-blue"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Feedback (5 required)</span>
                    <span className="font-medium">{feedbackCount}/5</span>
                  </div>
                  <Progress 
                    value={feedbackCount} 
                    max={5} 
                    variant="nhs-blue"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Reflective Accounts (5 required)</span>
                    <span className="font-medium">{reflectionsCount}/5</span>
                  </div>
                  <Progress 
                    value={reflectionsCount} 
                    max={5} 
                    variant="nhs-blue"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="mb-4">
                <h3 className="text-md font-semibold text-nhs-black mb-2">Upcoming Revalidation</h3>
                {userProfile ? (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-nhs-dark-grey">Registration Number:</div>
                    <div className="font-medium">{userProfile.registrationNumber}</div>
                    
                    <div className="text-nhs-dark-grey">Expiry Date:</div>
                    <div className="font-medium">{formatDateFull(userProfile.expiryDate)}</div>
                    
                    <div className="text-nhs-dark-grey">Revalidation Due:</div>
                    <div className="font-medium">3-year cycle ending</div>
                  </div>
                ) : (
                  <div className="text-sm text-nhs-dark-grey">
                    <p>No profile information found. Please set up your profile in Settings.</p>
                    <Link href="/settings">
                      <a className="text-nhs-blue hover:underline mt-2 inline-block">
                        Set up profile
                      </a>
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="mt-auto flex flex-col space-y-2">
                <Button>
                  <ListCheck className="mr-2 h-4 w-4" />
                  View Revalidation Checklist
                </Button>
                <Button variant="outline" onClick={handleExportSummary}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Revalidation Data
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
