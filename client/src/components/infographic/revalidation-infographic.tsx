import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DownloadCloud, 
  FileImage, 
  Share2, 
  BarChart3,
  Loader2
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { RevalidationSummaryData, generateInfographicCanvas } from '@/lib/infographic-generator';
import { getDaysUntil } from '@/lib/date-utils';

interface RevalidationInfographicProps {
  summaryData: RevalidationSummaryData;
}

const RevalidationInfographic: React.FC<RevalidationInfographicProps> = ({ summaryData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Helper to get color based on days remaining
  const getDeadlineColor = (daysRemaining: number): string => {
    if (daysRemaining < 30) return 'text-red-600';
    if (daysRemaining < 90) return 'text-amber-600';
    return 'text-teal-600';
  };

  const handleDownloadInfographic = async () => {
    setIsGenerating(true);

    try {
      // Calculate progress
      const progress = {
        practiceHours: {
          required: 450,
          completed: summaryData.practiceHours.reduce((sum, record) => sum + record.hours, 0),
          percentage: Math.min(100, (summaryData.practiceHours.reduce((sum, record) => sum + record.hours, 0) / 450) * 100)
        },
        cpd: {
          required: 35,
          completed: summaryData.cpdRecords.reduce((sum, record) => sum + record.hours, 0),
          percentage: Math.min(100, (summaryData.cpdRecords.reduce((sum, record) => sum + record.hours, 0) / 35) * 100)
        },
        feedback: {
          required: 5,
          completed: summaryData.feedbackRecords.length,
          percentage: Math.min(100, (summaryData.feedbackRecords.length / 5) * 100)
        },
        reflectiveAccounts: {
          required: 5,
          completed: summaryData.reflectiveAccounts.length,
          percentage: Math.min(100, (summaryData.reflectiveAccounts.length / 5) * 100)
        },
        healthDeclaration: summaryData.hasHealthDeclaration,
        confirmation: summaryData.hasConfirmation,
        overallPercentage: calculateOverallProgress(),
        status: calculateStatus()
      };
      
      // Generate canvas with infographic
      const canvas = await generateInfographicCanvas(summaryData, progress);
      
      // Convert to image and download
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      
      link.href = imgData;
      
      // Generate filename with date
      const date = new Date().toISOString().split('T')[0];
      const name = summaryData.userProfile?.name.replace(/\s+/g, '_') || 'revalidation';
      link.download = name + '_revalidation_summary_' + date + '.png';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Infographic generated",
        description: "Your revalidation summary has been downloaded as an image file.",
      });
    } catch (error) {
      console.error('Error generating infographic:', error);
      toast({
        title: "Generation failed",
        description: "There was an error generating your infographic. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Calculate overall progress percentage
  const calculateOverallProgress = (): number => {
    const TOTAL_REQUIREMENTS = 6; // 4 main categories + health declaration + confirmation
    let completed = 0;

    // Practice hours (450 required)
    const totalPracticeHours = summaryData.practiceHours.reduce((sum, record) => sum + record.hours, 0);
    if (totalPracticeHours >= 450) completed++;

    // CPD hours (35 required)
    const totalCpdHours = summaryData.cpdRecords.reduce((sum, record) => sum + record.hours, 0);
    if (totalCpdHours >= 35) completed++;

    // Feedback records (5 required)
    if (summaryData.feedbackRecords.length >= 5) completed++;

    // Reflective accounts (5 required)
    if (summaryData.reflectiveAccounts.length >= 5) completed++;

    // Health declaration
    if (summaryData.hasHealthDeclaration) completed++;

    // Confirmation
    if (summaryData.hasConfirmation) completed++;

    return Math.round((completed / TOTAL_REQUIREMENTS) * 100);
  };

  const progressPercentage = calculateOverallProgress();

  return (
    <Card className="w-full border-revalpro-blue/20">
      <CardHeader className="bg-gradient-to-r from-revalpro-blue/5 to-revalpro-purple/5">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-revalpro-blue" />
          Revalidation Summary Infographic
        </CardTitle>
        <CardDescription>
          Generate a visual summary of your revalidation progress
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-lg mb-3">
              Your Revalidation Overview
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <h4 className="font-medium mb-2">Progress Overview</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Overall Completion</span>
                  <span className="font-medium">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      progressPercentage < 30 
                        ? "bg-red-500" 
                        : progressPercentage < 70 
                          ? "bg-amber-500" 
                          : "bg-green-500"
                    }`} 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {summaryData.userProfile && (
                <div className="p-4 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-2">Registration Details</h4>
                  <div className="space-y-1">
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-gray-600">NMC PIN:</span>
                      <span className="font-medium">{summaryData.userProfile.registrationNumber}</span>
                    </div>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-gray-600">Expiry Date:</span>
                      <span className="font-medium">{new Date(summaryData.userProfile.expiryDate).toLocaleDateString()}</span>
                    </div>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-gray-600">Days Remaining:</span>
                      <span className={`font-medium ${getDeadlineColor(getDaysUntil(summaryData.userProfile.expiryDate))}`}>
                        {getDaysUntil(summaryData.userProfile.expiryDate)} days
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-md">
                <h4 className="font-medium mb-2">Requirements</h4>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Practice Hours</span>
                      <span className="font-medium">
                        {summaryData.practiceHours.reduce((sum, record) => sum + record.hours, 0)} / 450 hours
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-revalpro-blue h-1.5 rounded-full" 
                        style={{ width: `${Math.min(100, (summaryData.practiceHours.reduce((sum, record) => sum + record.hours, 0) / 450) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">CPD Hours</span>
                      <span className="font-medium">
                        {summaryData.cpdRecords.reduce((sum, record) => sum + record.hours, 0)} / 35 hours
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-revalpro-purple h-1.5 rounded-full" 
                        style={{ width: `${Math.min(100, (summaryData.cpdRecords.reduce((sum, record) => sum + record.hours, 0) / 35) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Feedback Records</span>
                      <span className="font-medium">
                        {summaryData.feedbackRecords.length} / 5 records
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-revalpro-teal h-1.5 rounded-full" 
                        style={{ width: `${Math.min(100, (summaryData.feedbackRecords.length / 5) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Reflective Accounts</span>
                      <span className="font-medium">
                        {summaryData.reflectiveAccounts.length} / 5 accounts
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-revalpro-orange h-1.5 rounded-full" 
                        style={{ width: `${Math.min(100, (summaryData.reflectiveAccounts.length / 5) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="bg-gray-50 p-4 rounded-md mb-4 flex-grow">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Preview</h4>
                <div className="px-2 py-1 bg-gray-200 rounded text-xs">
                  PNG Image
                </div>
              </div>
              <div className="h-64 bg-white border border-dashed border-gray-300 rounded-md flex items-center justify-center">
                <div className="text-center p-4">
                  <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-1">
                    Professional Infographic Summary
                  </p>
                  <p className="text-xs text-gray-400">
                    Click the button below to generate and download
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>The infographic will include:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Overall revalidation progress</li>
                  <li>Registration details and expiry date</li>
                  <li>Breakdown of all NMC requirements</li>
                  <li>Visual progress indicators</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3 mt-auto">
              <Button 
                onClick={handleDownloadInfographic} 
                className="w-full flex items-center justify-center gap-2 bg-revalpro-blue hover:bg-revalpro-blue/90"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Infographic...
                  </>
                ) : (
                  <>
                    <DownloadCloud className="h-4 w-4" />
                    Download as Image
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                disabled={isGenerating}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast({
                    title: "Link copied",
                    description: "You can now share this link with others.",
                  });
                }}
              >
                <Share2 className="h-4 w-4" />
                Share Summary
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 text-xs text-gray-500 border-t">
        Generated information is based on your current records as of {new Date().toLocaleDateString()}
      </CardFooter>
    </Card>
  );
};

export default RevalidationInfographic;