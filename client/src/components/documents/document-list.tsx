import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, File, FileText, Image, Trash2, ExternalLink, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

type Document = {
  id: string;
  userId: number;
  username: string;
  fileName: string;
  description: string;
  category: string;
  fileURL: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  createdAt: {
    toDate: () => Date;
  };
};

type DocumentListProps = {
  category: string;
  limit?: number;
  onDocumentDeleted?: () => void;
};

export default function DocumentList({ category, limit, onDocumentDeleted }: DocumentListProps) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch documents from Firestore
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    
    const q = query(
      collection(db, "documents"),
      where("userId", "==", user.id),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Document[];
        
        setDocuments(limit ? docs.slice(0, limit) : docs);
        setLoading(false);
        setError("");
      },
      (err) => {
        console.error("Error fetching documents:", err);
        setError("Failed to load documents: " + err.message);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user, category, limit]);

  // Handle document deletion
  const handleDelete = async (document: Document) => {
    if (!window.confirm(`Are you sure you want to delete "${document.fileName}"?`)) {
      return;
    }

    setDeletingId(document.id);
    
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "documents", document.id));
      
      // Delete from Storage
      const storageRef = ref(storage, document.filePath);
      await deleteObject(storageRef);
      
      if (onDocumentDeleted) {
        onDocumentDeleted();
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      setError("Failed to delete document: " + (err as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  // Helper to get icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (fileType.includes("image")) {
      return <Image className="h-5 w-5 text-blue-500" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return bytes + " B";
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-revalpro-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
        <File className="h-10 w-10 mx-auto mb-3 text-gray-400" />
        <h3 className="text-sm font-medium text-gray-900">No Documents</h3>
        <p className="mt-1 text-sm text-gray-500">
          You haven't uploaded any documents for this category yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Card key={doc.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-2">
                {getFileIcon(doc.fileType)}
                <CardTitle className="text-base font-semibold">{doc.fileName}</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">
                {formatFileSize(doc.fileSize)}
              </Badge>
            </div>
          </CardHeader>
          
          {doc.description && (
            <CardContent className="pb-2 text-sm text-gray-600">
              {doc.description}
            </CardContent>
          )}
          
          <CardFooter className="pt-2 flex justify-between items-center text-xs text-gray-500">
            <span>
              Uploaded {formatDistanceToNow(doc.createdAt.toDate(), { addSuffix: true })}
            </span>
            
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>{doc.fileName}</DialogTitle>
                    <DialogDescription>
                      Uploaded {formatDistanceToNow(doc.createdAt.toDate(), { addSuffix: true })}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex justify-center">
                    {doc.fileType.includes("image") ? (
                      <img 
                        src={doc.fileURL} 
                        alt={doc.fileName} 
                        className="max-h-[70vh] max-w-full object-contain rounded-md" 
                      />
                    ) : (
                      <iframe 
                        src={doc.fileURL} 
                        className="w-full h-[70vh] rounded-md"
                        title={doc.fileName}
                      />
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => window.open(doc.fileURL, '_blank')}>
                      Open in New Tab
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDelete(doc)}
                disabled={deletingId === doc.id}
              >
                {deletingId === doc.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}