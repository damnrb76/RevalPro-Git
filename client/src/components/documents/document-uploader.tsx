import { useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Check, Loader2, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type DocumentUploaderProps = {
  category: string;
  onUploadComplete?: (url: string, docRef: string) => void;
};

export default function DocumentUploader({ category, onUploadComplete }: DocumentUploaderProps) {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Only allow certain file types
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
      
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setError("");
      } else {
        setError("Invalid file type. Please upload a PDF or image file.");
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    if (!fileName.trim()) {
      setError("Please provide a name for your document");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      // Create a unique file path for this user
      const timestamp = new Date().getTime();
      const filePath = `documents/${user?.id}/${category}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, filePath);
      
      // Upload the file with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(uploadProgress);
        },
        (error) => {
          setError("Upload failed: " + error.message);
          setUploading(false);
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Save document metadata to Firestore
          const docRef = await addDoc(collection(db, "documents"), {
            userId: user?.id,
            username: user?.username,
            fileName: fileName,
            description: description,
            category: category,
            fileURL: downloadURL,
            filePath: filePath,
            fileType: file.type,
            fileSize: file.size,
            createdAt: serverTimestamp()
          });
          
          // Reset form and show success message
          setSuccess(true);
          setUploading(false);
          setFile(null);
          setFileName("");
          setDescription("");
          setProgress(0);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          
          // Call the callback if provided
          if (onUploadComplete) {
            onUploadComplete(downloadURL, docRef.id);
          }
        }
      );
    } catch (err) {
      setError("Upload failed: " + (err as Error).message);
      setUploading(false);
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Upload Document</CardTitle>
        <CardDescription>
          Upload evidence related to your {category}. Supported formats: PDF, JPEG, PNG.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert variant="default" className="bg-revalpro-green/10 text-revalpro-green border-revalpro-green/30">
            <Check className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Document uploaded successfully!</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="file">Document File</Label>
          <Input
            ref={fileInputRef}
            id="file"
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name">Document Name</Label>
          <Input
            id="name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter a name for this document"
            disabled={uploading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a brief description of this document"
            disabled={uploading}
          />
        </div>
        
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Upload Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-gradient-to-r from-revalpro-blue to-revalpro-teal"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}