import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, FileDown, FileText, ListCheck, Printer } from "lucide-react";
import { calculatePercentage, getColorFromPercentage } from "@/lib/utils";
import { formatDateFull } from "@/lib/date-utils";
import { 
  downloadRevalidationPack, 
  downloadSpecificForm, 
  downloadSummaryReport,
  downloadRawData 
} from "@/lib/pdf-generator";
import type { UserProfile } from "@shared/schema";
import { useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

type RevalidationSummaryProps = {
  userProfile: UserProfile | null;
  practiceHours: number;
  cpdHours: number;
  participatoryHours: number;
  feedbackCount: number;
  reflectionsCount: number;
  reflectiveDiscussionCompleted: boolean;
  healthDeclarationCompleted: boolean;
  confirmationCompleted: boolean;
};

export default function RevalidationSummary({
  userProfile,
  practiceHours,
  cpdHours,
  participatoryHours,
  feedbackCount,
  reflectionsCount,
  reflectiveDiscussionCompleted,
  healthDeclarationCompleted,
  confirmationCompleted
}: RevalidationSummaryProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Calculate percentages
  const practiceHoursPercentage = calculatePercentage(practiceHours, 450);
  const cpdPercentage = calculatePercentage(cpdHours, 35);
  const participatoryPercentage = calculatePercentage(participatoryHours, 20);
  const feedbackPercentage = calculatePercentage(feedbackCount, 5);
  const reflectionPercentage = calculatePercentage(reflectionsCount, 5);
  const reflectiveDiscussionPercentage = reflectiveDiscussionCompleted ? 100 : 0;
  const healthDeclarationPercentage = healthDeclarationCompleted ? 100 : 0;
  const confirmationPercentage = confirmationCompleted ? 100 : 0;
  
  // Calculate overall percentage (expanded to include all requirements)
  const overallPercentage = Math.round(
    (
      practiceHoursPercentage + 
      cpdPercentage + 
      feedbackPercentage + 
      reflectionPercentage + 
      reflectiveDiscussionPercentage +
      healthDeclarationPercentage +
      confirmationPercentage
    ) / 7
  );
  
  // Handle document download functions
  const handleDownloadCompletePack = async () => {
    try {
      setIsGenerating(true);
      await downloadRevalidationPack();
      toast({
        title: "Success",
        description: "Complete revalidation pack has been generated and downloaded.",
      });
    } catch (error) {
      console.error("Failed to generate complete revalidation pack:", error);
      toast({
        title: "Error",
        description: "Failed to generate the PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownloadSummaryReport = async () => {
    try {
      setIsGenerating(true);
      await downloadSummaryReport();
      toast({
        title: "Success",
        description: "Summary report has been generated and downloaded.",
      });
    } catch (error) {
      console.error("Failed to generate summary report:", error);
      toast({
        title: "Error",
        description: "Failed to generate the PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownloadForm = async (formType: string) => {
    try {
      setIsGenerating(true);
      await downloadSpecificForm(formType);
      toast({
        title: "Success",
        description: `${formType} form has been generated and downloaded.`,
      });
    } catch (error) {
      console.error(`Failed to generate ${formType} form:`, error);
      toast({
        title: "Error",
        description: "Failed to generate the PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownloadRawData = async () => {
    try {
      setIsGenerating(true);
      await downloadRawData();
      toast({
        title: "Success",
        description: "Raw data JSON file has been downloaded.",
      });
    } catch (error) {
      console.error("Failed to export raw data:", error);
      toast({
        title: "Error",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
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
                  <span className="text-sm font-medium text-revalpro-black">Overall Completion</span>
                  <span className="text-sm font-medium text-revalpro-black">{overallPercentage}%</span>
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
                    variant="revalpro-blue"
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
                    variant="revalpro-green"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Participatory CPD (20 required)</span>
                    <span className="font-medium">{participatoryHours}/20</span>
                  </div>
                  <Progress 
                    value={participatoryHours} 
                    max={20} 
                    variant="revalpro-teal"
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
                    variant="revalpro-orange"
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
                    variant="revalpro-purple"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Other Requirements</span>
                    <span className="font-medium">
                      {reflectiveDiscussionCompleted ? "✓" : "✗"} Discussion | 
                      {healthDeclarationCompleted ? "✓" : "✗"} Health | 
                      {confirmationCompleted ? "✓" : "✗"} Confirmation
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <Progress 
                      value={reflectiveDiscussionCompleted ? 100 : 0} 
                      max={100} 
                      variant="revalpro-indigo"
                    />
                    <Progress 
                      value={healthDeclarationCompleted ? 100 : 0} 
                      max={100} 
                      variant="revalpro-pink"
                    />
                    <Progress 
                      value={confirmationCompleted ? 100 : 0} 
                      max={100} 
                      variant="revalpro-red"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="mb-4">
                <h3 className="text-md font-semibold text-revalpro-dark-blue mb-2">Upcoming Revalidation</h3>
                {userProfile ? (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-revalpro-black">Registration Number:</div>
                    <div className="font-medium text-revalpro-black">{userProfile.registrationNumber}</div>
                    
                    <div className="text-revalpro-black">Expiry Date:</div>
                    <div className="font-medium text-revalpro-black">{formatDateFull(userProfile.expiryDate)}</div>
                    
                    <div className="text-revalpro-black">Revalidation Due:</div>
                    <div className="font-medium text-revalpro-black">3-year cycle ending</div>
                  </div>
                ) : (
                  <div className="text-sm text-revalpro-black">
                    <p>No profile information found. Please set up your profile in Settings.</p>
                    <Link href="/settings">
                      <span className="text-revalpro-blue hover:underline mt-2 inline-block cursor-pointer">
                        Set up profile
                      </span>
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="mt-auto flex flex-col space-y-2">
                <Button 
                  className="bg-revalpro-blue hover:bg-revalpro-dark-blue"
                  onClick={handleDownloadSummaryReport}
                  disabled={isGenerating}
                >
                  <ListCheck className="mr-2 h-4 w-4" />
                  {isGenerating ? "Generating..." : "Download Revalidation Summary"}
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleDownloadCompletePack}
                    disabled={isGenerating}
                    className="text-revalpro-dark-blue border-revalpro-dark-blue hover:bg-revalpro-grey"
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Complete Pack
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        disabled={isGenerating}
                        className="text-revalpro-dark-blue border-revalpro-dark-blue hover:bg-revalpro-grey"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Export Form
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => handleDownloadForm('practiceHours')}>
                        Practice Hours Log
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadForm('cpd')}>
                        CPD Records
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadForm('feedback')}>
                        Feedback Records
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadForm('reflectiveAccounts')}>
                        Reflective Accounts
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadForm('reflectiveDiscussion')}>
                        Reflective Discussion Form
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadForm('healthDeclaration')}>
                        Health Declaration
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadForm('confirmation')}>
                        Confirmation Form
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={handleDownloadRawData}
                  disabled={isGenerating}
                  className="text-gray-500 border-gray-300 hover:bg-gray-100"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Export Raw Data (JSON)
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
