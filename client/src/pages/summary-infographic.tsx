import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Image } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { UserProfile, PracticeHours, CpdRecord, FeedbackRecord, ReflectiveAccount, HealthDeclaration } from "@shared/schema";
import { confirmationStorage } from "@/lib/storage";

export default function SummaryInfographicPage() {
  const [previewImage, setPreviewImage] = useState<string>("");

  // Fetch all necessary data
  const { data: userProfile } = useQuery<UserProfile>({ queryKey: ['/api/user-profile'] });
  const { data: practiceHours = [] } = useQuery<PracticeHours[]>({ queryKey: ['/api/practice-hours'] });
  const { data: cpdRecords = [] } = useQuery<CpdRecord[]>({ queryKey: ['/api/cpd-records'] });
  const { data: feedbackRecords = [] } = useQuery<FeedbackRecord[]>({ queryKey: ['/api/feedback-records'] });
  const { data: reflectiveAccounts = [] } = useQuery<ReflectiveAccount[]>({ queryKey: ['/api/reflective-accounts'] });
  const { data: healthDeclarations = [] } = useQuery<HealthDeclaration[]>({ queryKey: ['/api/health-declarations'] });
  
  // Fetch confirmation data from IndexedDB
  const { data: confirmationCompleted = false } = useQuery({
    queryKey: ['confirmationCompleted'],
    queryFn: async () => {
      const confirmations = await confirmationStorage.getAll();
      return confirmations.length > 0;
    },
  });

  // Calculate progress percentages
  const calculateProgress = () => {
    const totalPracticeHours = practiceHours.reduce((sum, record) => sum + record.hours, 0);
    const totalCpdHours = cpdRecords.reduce((sum, record) => sum + record.hours, 0);
    
    return {
      practiceHours: Math.min(100, Math.round((totalPracticeHours / 450) * 100)),
      cpdHours: Math.min(100, Math.round((totalCpdHours / 35) * 100)),
      feedback: Math.min(100, Math.round((feedbackRecords.length / 5) * 100)),
      reflections: Math.min(100, Math.round((reflectiveAccounts.length / 5) * 100)),
      healthDeclaration: healthDeclarations.length > 0 ? 100 : 0,
      confirmation: confirmationCompleted ? 100 : 0
    };
  };

  // Generate the infographic preview when data loads (removed userProfile guard)
  useEffect(() => {
    generatePreviewImage();
  }, [practiceHours, cpdRecords, feedbackRecords, reflectiveAccounts, healthDeclarations, confirmationCompleted]);

  const generatePreviewImage = () => {
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
      ctx.fillStyle = '#1FB6E1'; // RevalPro vibrant blue
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('RevalPro', canvas.width / 2, 60);
      
      // Add subtitle
      ctx.fillStyle = '#000000';
      ctx.font = '24px Arial';
      ctx.fillText('Revalidation Progress Summary', canvas.width / 2, 100);
      
      // Add nurse details with fallback
      ctx.font = '18px Arial';
      const profileName = userProfile?.name || 'Your Progress';
      ctx.fillText(profileName, canvas.width / 2, 140);
      const registrationStatus = userProfile?.registrationNumber 
        ? `Registration: ${userProfile.registrationNumber}`
        : 'Registration Status: Active';
      ctx.fillText(registrationStatus, canvas.width / 2, 170);
      
      // Get actual progress values
      const progress = calculateProgress();
      
      // Draw progress bars for canvas
      const drawProgressBar = (y: number, label: string, progressValue: number, color: string) => {
        // Background bar
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(150, y, 500, 30);
        
        // Progress bar
        ctx.fillStyle = color;
        ctx.fillRect(150, y, (progressValue / 100) * 500, 30);
        
        // Label
        ctx.fillStyle = '#000000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(label, 150, y - 10);
        
        // Percentage
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`${progressValue}%`, 400, y + 20);
      };
      
      // Progress indicators with actual data
      drawProgressBar(220, 'Practice Hours (450+ required)', progress.practiceHours, '#1FB6E1');
      drawProgressBar(280, 'CPD Hours (35+ required)', progress.cpdHours, '#00b894');
      drawProgressBar(340, 'Feedback Records (5+ required)', progress.feedback, '#e84393');
      drawProgressBar(400, 'Reflective Accounts (5+ required)', progress.reflections, '#fd79a8');
      drawProgressBar(460, 'Health Declaration', progress.healthDeclaration, '#74b9ff');
      drawProgressBar(520, 'Confirmation', progress.confirmation, '#a29bfe');
      
      // Add achievements section
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Current Progress:', 150, 600);
      
      ctx.font = '16px Arial';
      const totalPracticeHours = practiceHours.reduce((sum, record) => sum + record.hours, 0);
      const totalCpdHours = cpdRecords.reduce((sum, record) => sum + record.hours, 0);
      
      const achievements = [
        `${progress.practiceHours >= 100 ? '✓' : '○'} Practice Hours: ${totalPracticeHours}/450 hours`,
        `${progress.cpdHours >= 100 ? '✓' : '○'} CPD Hours: ${totalCpdHours}/35 hours`,
        `${progress.feedback >= 100 ? '✓' : '○'} Feedback Records: ${feedbackRecords.length}/5`,
        `${progress.reflections >= 100 ? '✓' : '○'} Reflective Accounts: ${reflectiveAccounts.length}/5`,
        `${progress.healthDeclaration >= 100 ? '✓' : '○'} Health Declaration`,
        `${progress.confirmation >= 100 ? '✓' : '○'} Confirmation`
      ];
      
      achievements.forEach((achievement, index) => {
        ctx.fillText(achievement, 150, 640 + (index * 30));
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

  // Generate JSON sample data
  const handleJsonDownload = () => {
    try {
      const sampleData = {
        userProfile: {
          id: 1,
          name: "Damon Bruce",
          registrationNumber: "98X1234E",
          expiryDate: "2026-05-15",
          specialty: "Adult Nursing",
          jobTitle: "Senior Staff Nurse",
          email: "dbruce@example.com",
          created: new Date().toISOString(),
        },
        practiceHours: [
          {
            id: 1,
            startDate: "2023-05-15",
            endDate: "2024-05-15",
            hours: 450,
            setting: "Hospital",
            scope: "Adult Nursing",
            notes: "Full-time hospital work",
            created: new Date().toISOString(),
          }
        ],
        cpdRecords: [
          {
            id: 1,
            title: "Infection Control Workshop",
            date: "2023-08-12",
            hours: 35,
            participatory: true,
            description: "Comprehensive infection control training",
            created: new Date().toISOString(),
          }
        ]
      };

      const blob = new Blob([JSON.stringify(sampleData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "revalidation-data-sample.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Sample JSON Generated",
        description: "Sample data file has been downloaded",
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
      if (!previewImage) {
        generatePreviewImage();
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
        description: "Visual summary has been saved as PNG image",
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
            <span className="gradient-text">Summary Infographic</span>
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
                    Professional Infographic Summary
                  </h3>
                  <p className="text-gray-500">
                    Click the button below to generate and download
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-3">
              <h4 className="font-medium">The infographic will include:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Overall revalidation progress</li>
                <li>• Registration details and expiry date</li>
                <li>• Breakdown of all NMC requirements</li>
                <li>• Visual progress indicators</li>
              </ul>
            </div>

            <Button 
              onClick={handleImageDownload}
              className="w-full mt-6 bg-revalpro-blue hover:bg-revalpro-dark-blue text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download as Image
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
                >
                  <FileText className="mr-2 h-4 w-4" />
                  JSON Data Sample
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