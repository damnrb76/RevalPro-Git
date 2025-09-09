import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Image } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { exportAllData } from "@/lib/storage";
import { calculateProgress, RevalidationSummaryData } from "@/lib/infographic-generator";
import type { UserProfile } from "@shared/schema";

export default function SummaryInfographicPage() {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [userData, setUserData] = useState<RevalidationSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data and generate the infographic preview when component loads
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const data = await exportAllData();
      
      const summaryData: RevalidationSummaryData = {
        userProfile: data.userProfile[0] || null,
        practiceHours: data.practiceHours || [],
        cpdRecords: data.cpdRecords || [],
        feedbackRecords: data.feedbackRecords || [],
        reflectiveAccounts: data.reflectiveAccounts || [],
        hasHealthDeclaration: data.healthDeclaration && data.healthDeclaration.length > 0,
        hasConfirmation: data.confirmation && data.confirmation.length > 0,
        lastUpdated: new Date()
      };
      
      setUserData(summaryData);
      generatePreviewImage(summaryData);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error",
        description: "Failed to load your revalidation data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generatePreviewImage = (data?: RevalidationSummaryData) => {
    const summaryData = data || userData;
    if (!summaryData) {
      console.log('No data available for preview generation');
      return;
    }
    try {
      // Create a canvas element for the preview
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas context not available');
      }
      
      // Set white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add RevalPro header
      ctx.fillStyle = '#2962ff'; // RevalPro blue
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('RevalPro', canvas.width / 2, 60);
      
      // Add subtitle
      ctx.fillStyle = '#000000';
      ctx.font = '24px Arial';
      ctx.fillText('Revalidation Progress Summary', canvas.width / 2, 100);
      
      // Add nurse details
      ctx.font = '18px Arial';
      const userName = summaryData.userProfile?.name || 'Your Name';
      const regNumber = summaryData.userProfile?.registrationNumber || 'Your PIN';
      ctx.fillText(`${userName} (Nurse)`, canvas.width / 2, 140);
      ctx.fillText(`NMC PIN: ${regNumber}`, canvas.width / 2, 170);
      
      // Draw progress bars for canvas
      const drawProgressBar = (y: number, label: string, progress: number, color: string) => {
        // Background bar
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(150, y, 500, 30);
        
        // Progress bar
        ctx.fillStyle = color;
        ctx.fillRect(150, y, (progress / 100) * 500, 30);
        
        // Label
        ctx.fillStyle = '#000000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(label, 150, y - 10);
        
        // Percentage
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`${progress}%`, 400, y + 20);
      };
      
      // Calculate actual progress percentages
      const progress = calculateProgress(summaryData);
      
      // Progress indicators with real data
      drawProgressBar(220, `Practice Hours (${progress.practiceHours.required}+ required)`, progress.practiceHours.percentage, '#2962ff');
      drawProgressBar(280, `CPD Hours (${progress.cpd.required}+ required)`, progress.cpd.percentage, '#00b894');
      drawProgressBar(340, `Feedback Records (${progress.feedback.required}+ required)`, progress.feedback.percentage, '#e84393');
      drawProgressBar(400, `Reflective Accounts (${progress.reflectiveAccounts.required}+ required)`, progress.reflectiveAccounts.percentage, '#fd79a8');
      drawProgressBar(460, 'Health Declaration', progress.healthDeclaration ? 100 : 0, '#74b9ff');
      drawProgressBar(520, 'Confirmation', progress.confirmation ? 100 : 0, '#a29bfe');
      
      // Add achievements section
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Key Achievements:', 150, 600);
      
      ctx.font = '16px Arial';
      const achievements = [
        {
          text: `Practice hours: ${progress.practiceHours.completed}/${progress.practiceHours.required} hours`,
          completed: progress.practiceHours.percentage >= 100
        },
        {
          text: `CPD hours: ${progress.cpd.completed}/${progress.cpd.required} hours`,
          completed: progress.cpd.percentage >= 100
        },
        {
          text: `Feedback records: ${progress.feedback.completed}/${progress.feedback.required} records`,
          completed: progress.feedback.percentage >= 100
        },
        {
          text: `Reflective accounts: ${progress.reflectiveAccounts.completed}/${progress.reflectiveAccounts.required} accounts`,
          completed: progress.reflectiveAccounts.percentage >= 100
        },
        {
          text: 'Health declaration',
          completed: progress.healthDeclaration
        },
        {
          text: 'Confirmation process',
          completed: progress.confirmation
        }
      ];
      
      achievements.forEach((achievement, index) => {
        const symbol = achievement.completed ? '✓' : '○';
        const color = achievement.completed ? '#00b894' : '#666666';
        ctx.fillStyle = color;
        ctx.fillText(`${symbol} ${achievement.text}`, 150, 640 + (index * 30));
      });
      
      // Add footer
      ctx.font = 'italic 14px Arial';
      ctx.fillStyle = '#888888';
      ctx.textAlign = 'center';
      ctx.fillText('Generated by RevalPro - Your Nursing Revalidation Assistant', canvas.width / 2, 950);
      
      // Convert canvas to image and set preview
      const imageDataUrl = canvas.toDataURL('image/png');
      setPreviewImage(imageDataUrl);
      
    } catch (error) {
      console.error("Error generating preview:", error);
      toast({
        title: "Error",
        description: "Failed to generate preview",
        variant: "destructive",
      });
    }
  };

  // Generate JSON data using real user data
  const handleJsonDownload = () => {
    try {
      if (!userData) {
        toast({
          title: "No Data",
          description: "Please wait for data to load before exporting",
          variant: "destructive",
        });
        return;
      }

      const blob = new Blob([JSON.stringify(userData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "revalidation-data-export.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported",
        description: "Your revalidation data has been downloaded",
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating JSON:", error);
      toast({
        title: "Error",
        description: "Failed to generate sample JSON",
        variant: "destructive",
      });
    }
  };

  // Download as image
  const handleImageDownload = () => {
    try {
      if (!previewImage || !userData) {
        if (!userData) {
          loadUserData();
        } else {
          generatePreviewImage();
        }
        return;
      }

      const a = document.createElement("a");
      a.href = previewImage;
      a.download = "revalidation-infographic.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast({
        title: "Infographic Downloaded",
        description: "Your revalidation summary has been saved as PNG image",
        variant: "default",
      });
    } catch (error) {
      console.error("Error downloading image:", error);
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-revalpro-dark-blue">
            Summary Infographic
          </h1>
          <p className="text-gray-600 mt-2">
            Generate a visual summary of your revalidation progress
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Preview
            </CardTitle>
            <p className="text-sm text-gray-500">PNG Image</p>
          </CardHeader>
          <CardContent>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50 min-h-[400px] flex items-center justify-center"
              data-preview-container
            >
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Revalidation Progress Infographic" 
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              ) : (
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isLoading ? 'Loading Your Data...' : 'Your Revalidation Summary'}
                  </h3>
                  <p className="text-gray-500">
                    {isLoading ? 'Please wait while we load your progress' : 'Your personalized infographic is ready'}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-3">
              <h4 className="font-medium">The infographic includes:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Your actual revalidation progress</li>
                <li>• Real completion percentages for each requirement</li>
                <li>• Practice hours, CPD, feedback, and reflective accounts status</li>
                <li>• Professional visual summary for portfolios</li>
              </ul>
            </div>

            <Button 
              onClick={handleImageDownload}
              className="w-full mt-6 bg-revalpro-blue hover:bg-revalpro-dark-blue text-white"
              disabled={isLoading || !userData}
            >
              <Download className="mr-2 h-4 w-4" />
              {isLoading ? 'Loading...' : 'Download Your Infographic'}
            </Button>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
            <p className="text-sm text-gray-500">
              Choose your preferred download format
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Visual Formats</h4>
              <div className="space-y-2">
                <Button
                  onClick={handleImageDownload}
                  variant="outline"
                  className="w-full justify-start"
                  disabled={isLoading || !userData}
                >
                  <Image className="mr-2 h-4 w-4" />
                  PNG Image (Recommended)
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Data Formats</h4>
              <div className="space-y-2">
                <Button
                  onClick={handleJsonDownload}
                  variant="outline"
                  className="w-full justify-start"
                  disabled={!userData}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export Your Data (JSON)
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                💡 Professional Tip
              </h4>
              <p className="text-sm text-blue-800">
                The infographic format is perfect for presentations, portfolio reviews, 
                and quick progress sharing with supervisors or mentors.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}