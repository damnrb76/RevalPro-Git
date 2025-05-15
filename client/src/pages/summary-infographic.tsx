import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import RevalidationInfographic from "@/components/infographic/revalidation-infographic";
import { 
  userProfileStorage, 
  practiceHoursStorage, 
  cpdRecordsStorage, 
  feedbackRecordsStorage, 
  reflectiveAccountsStorage,
  healthDeclarationStorage,
  confirmationStorage,
  exportAllData
} from "@/lib/storage";
import { RevalidationSummaryData } from "@/lib/infographic-generator";
import { 
  PlusCircle, 
  Share, 
  FileImage, 
  ChevronLeft,
  Download, 
  Printer, 
  FileJson, 
  FileText,
  PackageOpen,
  Upload
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadRevalidationPack } from "@/lib/pdf-generator";

export default function SummaryInfographicPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<RevalidationSummaryData | null>(null);
  
  // Preview demo data for NMC-compliant document generation
  const [previewMode, setPreviewMode] = useState(true); // Set to true for demo purposes

  // Fetch all data needed for the summary
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => userProfileStorage.getCurrent(),
  });

  const { data: practiceHours } = useQuery({
    queryKey: ['practiceHours'],
    queryFn: async () => practiceHoursStorage.getAll(),
  });

  const { data: cpdRecords } = useQuery({
    queryKey: ['cpdRecords'],
    queryFn: async () => cpdRecordsStorage.getAll(),
  });

  const { data: feedbackRecords } = useQuery({
    queryKey: ['feedbackRecords'],
    queryFn: async () => feedbackRecordsStorage.getAll(),
  });

  const { data: reflectiveAccounts } = useQuery({
    queryKey: ['reflectiveAccounts'],
    queryFn: async () => reflectiveAccountsStorage.getAll(),
  });

  const { data: healthDeclarations } = useQuery({
    queryKey: ['healthDeclarations'],
    queryFn: async () => healthDeclarationStorage.getAll(),
  });

  const { data: confirmations } = useQuery({
    queryKey: ['confirmations'],
    queryFn: async () => confirmationStorage.getAll(),
  });

  // Prepare summary data once all queries are resolved
  useEffect(() => {
    // For preview mode, use sample data
    if (previewMode) {
      // Demo data for NMC document preview
      const demoUser = {
        id: 1,
        name: "Sarah Johnson",
        registrationNumber: "98X1234E",
        expiryDate: "2026-05-15",
        jobTitle: "Registered Nurse",
        email: "demo@example.com",
        profileImage: null,
        created: new Date()
      };

      const demoPracticeHours = [
        { id: 1, workSetting: "Hospital", scope: "Adult Nursing", startDate: "2023-05-01", endDate: "2024-04-30", hours: 300, created: new Date(), notes: "Regular shifts on ward 5B" },
        { id: 2, workSetting: "Community Care", scope: "Adult Nursing", startDate: "2023-06-15", endDate: "2024-03-15", hours: 200, created: new Date(), notes: "District nursing rotation" }
      ];
      
      const demoCpdRecords = [
        { id: 1, userId: 1, title: "Infection Control Workshop", date: "2024-01-15", hours: 10, participatory: true, description: "Workshop on latest infection control practices", created: new Date(), relevanceToCode: "Preserve Safety", attachment: null },
        { id: 2, userId: 1, title: "Medication Management Course", date: "2024-02-20", hours: 8, participatory: true, description: "Online course on medication safety", created: new Date(), relevanceToCode: "Preserve Safety", attachment: null },
        { id: 3, userId: 1, title: "Clinical Skills Update", date: "2024-03-10", hours: 12, participatory: true, description: "Hands-on clinical skills refresher", created: new Date(), relevanceToCode: "Practise Effectively", attachment: null },
        { id: 4, userId: 1, title: "Professional Ethics Study", date: "2024-04-05", hours: 6, participatory: false, description: "Self-directed learning on ethical practice", created: new Date(), relevanceToCode: "Promote Professionalism", attachment: null }
      ];
      
      setSummaryData({
        userProfile: demoUser,
        practiceHours: demoPracticeHours,
        cpdRecords: demoCpdRecords,
        feedbackRecords: [
          { id: 1, userId: 1, date: "2024-01-10", source: "Patient", content: "Excellent care provided during my stay", reflection: "Positive feedback on communication skills", created: new Date(), attachment: null },
          { id: 2, userId: 1, date: "2024-02-15", source: "Colleague", content: "Great teamwork during emergency situation", reflection: "Showed good crisis management", created: new Date(), attachment: null },
          { id: 3, userId: 1, date: "2024-03-20", source: "Manager", content: "Demonstrated leadership in team meetings", reflection: "Developing leadership capabilities", created: new Date(), attachment: null },
          { id: 4, userId: 1, date: "2024-04-05", source: "Student", content: "Excellent mentorship and teaching", reflection: "Effective teaching methods", created: new Date(), attachment: null },
          { id: 5, userId: 1, date: "2024-04-25", source: "Patient Family", content: "Compassionate care provided to my mother", reflection: "Importance of family-centered care", created: new Date(), attachment: null }
        ],
        reflectiveAccounts: [
          { id: 1, userId: 1, title: "Managing Complex Care", date: "2024-01-20", description: "Reflection on caring for patient with multiple conditions", reflectiveModel: "Gibbs", experience: "Coordinated care for elderly patient with multiple comorbidities", natureOfExperience: "Clinical", whatLearned: "Importance of interdisciplinary approach", howChanged: "Now regularly consult with specialist teams", created: new Date(), attachment: null, codeRelation: "Prioritise People" },
          { id: 2, userId: 1, title: "Communication Challenge", date: "2024-02-25", description: "Reflection on difficult conversation with family", reflectiveModel: "Johns", experience: "Had to explain poor prognosis to patient's family", natureOfExperience: "Communication", whatLearned: "Techniques for sensitive discussions", howChanged: "Improved approach to difficult conversations", created: new Date(), attachment: null, codeRelation: "Practise Effectively" },
          { id: 3, userId: 1, title: "Medication Error Prevention", date: "2024-03-15", description: "Reflection on near-miss incident", reflectiveModel: "Driscoll", experience: "Identified potential medication error before administration", natureOfExperience: "Safety", whatLearned: "Importance of double-checking", howChanged: "Implemented personal safety checklist", created: new Date(), attachment: null, codeRelation: "Preserve Safety" },
          { id: 4, userId: 1, title: "Patient Advocacy", date: "2024-04-01", description: "Reflection on advocating for patient needs", reflectiveModel: "Gibbs", experience: "Advocated for patient's cultural needs during care", natureOfExperience: "Advocacy", whatLearned: "Cultural competence in care planning", howChanged: "Now consider cultural factors in all assessments", created: new Date(), attachment: null, codeRelation: "Prioritise People" },
          { id: 5, userId: 1, title: "Team Conflict Resolution", date: "2024-04-20", description: "Reflection on resolving team disagreement", reflectiveModel: "Kolb", experience: "Mediated disagreement between healthcare professionals", natureOfExperience: "Teamwork", whatLearned: "Conflict resolution strategies", howChanged: "Better equipped to handle team dynamics", created: new Date(), attachment: null, codeRelation: "Promote Professionalism" }
        ],
        hasHealthDeclaration: true,
        hasConfirmation: true,
        lastUpdated: new Date()
      });
      setIsLoading(false);
      return;
    }
    
    // Regular data loading for non-preview mode
    if (
      userProfile !== undefined &&
      practiceHours !== undefined &&
      cpdRecords !== undefined &&
      feedbackRecords !== undefined &&
      reflectiveAccounts !== undefined &&
      healthDeclarations !== undefined &&
      confirmations !== undefined
    ) {
      setSummaryData({
        userProfile,
        practiceHours: practiceHours || [],
        cpdRecords: cpdRecords || [],
        feedbackRecords: feedbackRecords || [],
        reflectiveAccounts: reflectiveAccounts || [],
        hasHealthDeclaration: (healthDeclarations || []).length > 0,
        hasConfirmation: (confirmations || []).length > 0,
        lastUpdated: new Date()
      });
      setIsLoading(false);
    }
  }, [
    userProfile,
    practiceHours,
    cpdRecords,
    feedbackRecords,
    reflectiveAccounts,
    healthDeclarations,
    confirmations,
    previewMode
  ]);

  return (
    <main className="container mx-auto px-4 py-6 max-w-5xl">
      <Helmet>
        <title>Revalidation Summary Infographic | RevalPro</title>
        <meta 
          name="description" 
          content="Generate and download a visual summary of your NMC revalidation progress." 
        />
      </Helmet>

      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-revalpro-blue hover:underline mb-2">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-revalpro-dark mb-2">Revalidation Summary Infographic</h1>
        <p className="text-muted-foreground">
          Generate a professional infographic of your revalidation progress to save, print, or share
        </p>
      </div>

      {!userProfile && !isLoading && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Profile Not Set Up</AlertTitle>
          <AlertDescription>
            You need to set up your profile before generating an infographic summary.
            <div className="mt-4">
              <Link href="/settings">
                <Button size="sm" variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Set Up Profile
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      ) : summaryData && (
        <RevalidationInfographic summaryData={summaryData} />
      )}

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-revalpro-blue">Download Revalidation Summary</h2>
        
        <div className="mb-8">
          <Button
            variant="default"
            size="lg"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-revalpro-blue to-revalpro-teal text-white"
            onClick={() => downloadRevalidationPack()}
          >
            <Download className="h-5 w-5" />
            <span>Download Revalidation Summary</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 h-auto py-4 border-2"
            onClick={() => downloadRevalidationPack()}
          >
            <Printer className="h-5 w-5 text-revalpro-blue" />
            <div className="text-left">
              <div className="font-medium">Complete Pack</div>
              <div className="text-xs text-gray-500">All NMC forms bundled</div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 h-auto py-4 border-2"
            onClick={() => {
              // Handle infographic download
              window.print();
            }}
          >
            <Upload className="h-5 w-5 text-revalpro-purple" />
            <div className="text-left">
              <div className="font-medium">Infographic</div>
              <div className="text-xs text-gray-500">Visual progress summary</div>
            </div>
          </Button>
        </div>
        
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 h-auto py-4 mb-4 border-2"
          onClick={() => {
            // Handle form-only download (NMC format)
            downloadRevalidationPack();
          }}
        >
          <FileText className="h-5 w-5 text-revalpro-teal" />
          <div className="text-left">
            <div className="font-medium">Export Form</div>
            <div className="text-xs text-gray-500">Official NMC format documents</div>
          </div>
        </Button>
        
        <Button
          variant="secondary"
          className="w-full flex items-center justify-center gap-2 h-auto py-4 bg-gray-100"
          onClick={async () => {
            // Export raw data as JSON
            const data = await exportAllData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `revalidation-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
        >
          <FileJson className="h-5 w-5 text-gray-600" />
          <div className="text-left">
            <div className="font-medium">Export Raw Data (JSON)</div>
            <div className="text-xs text-gray-500">For backup or transferring</div>
          </div>
        </Button>
      </div>
    </main>
  );
}