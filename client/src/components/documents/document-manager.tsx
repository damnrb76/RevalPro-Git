import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentUploader from "./document-uploader";
import DocumentList from "./document-list";
import { useToast } from "@/hooks/use-toast";

type DocumentManagerProps = {
  category: string;
  title?: string;
  description?: string;
};

export default function DocumentManager({ 
  category, 
  title = "Document Manager", 
  description = "Upload and manage documents related to your revalidation" 
}: DocumentManagerProps) {
  const [activeTab, setActiveTab] = useState<string>("view");
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  const handleUploadComplete = (url: string, docRef: string) => {
    toast({
      title: "Document Uploaded",
      description: "Your document has been uploaded successfully.",
    });
    
    // Switch to view tab and refresh the list
    setActiveTab("view");
    setRefreshKey(prev => prev + 1);
  };

  const handleDelete = () => {
    // Refresh the list when a document is deleted
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6 pb-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6 pt-0">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="view" className="text-center py-2">
            View Documents
          </TabsTrigger>
          <TabsTrigger value="upload" className="text-center py-2">
            Upload New
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="view" className="mt-0">
          <DocumentList 
            key={refreshKey} 
            category={category} 
            onDocumentDeleted={handleDelete} 
          />
        </TabsContent>
        
        <TabsContent value="upload" className="mt-0">
          <DocumentUploader 
            category={category} 
            onUploadComplete={handleUploadComplete} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}