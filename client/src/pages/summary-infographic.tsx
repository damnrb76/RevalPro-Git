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
    confirmations
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