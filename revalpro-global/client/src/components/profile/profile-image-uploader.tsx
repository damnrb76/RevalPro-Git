import { useState, useRef, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Trash2, Camera, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileImageUploaderProps {
  currentImageUrl?: string | null;
  initials: string;
  onImageUpload: (imageDataUrl: string) => Promise<void>;
  onImageRemove?: () => Promise<void>;
}

export default function ProfileImageUploader({
  currentImageUrl,
  initials,
  onImageUpload,
  onImageRemove,
}: ProfileImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Convert the file to a data URL
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        
        // Set preview
        setPreviewUrl(dataUrl);
        
        // Upload image
        try {
          await onImageUpload(dataUrl);
          toast({
            title: "Profile image updated",
            description: "Your profile image has been updated successfully",
          });
        } catch (error) {
          toast({
            title: "Upload failed",
            description: (error as Error).message || "Failed to update profile image",
            variant: "destructive",
          });
          // Reset preview if upload fails
          setPreviewUrl(currentImageUrl || null);
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.onerror = () => {
        toast({
          title: "Error reading file",
          description: "Failed to process the selected image",
          variant: "destructive",
        });
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      toast({
        title: "Error uploading image",
        description: (error as Error).message || "An unexpected error occurred",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!onImageRemove) return;
    
    try {
      setIsUploading(true);
      await onImageRemove();
      setPreviewUrl(null);
      toast({
        title: "Image removed",
        description: "Your profile image has been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to remove profile image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="border-dashed border-2 border-gray-200 bg-white">
      <CardContent className="p-6 flex flex-col items-center">
        <div className="relative mb-4">
          <Avatar className="h-32 w-32">
            {previewUrl ? (
              <AvatarImage src={previewUrl} alt="Profile" className="object-cover" />
            ) : (
              <AvatarFallback className="text-4xl bg-revalpro-purple text-white">
                {initials}
              </AvatarFallback>
            )}

            {isUploading && (
              <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
          </Avatar>

          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />

        <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {previewUrl ? "Change Photo" : "Upload Photo"}
          </Button>
          
          {previewUrl && onImageRemove && (
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleRemoveImage}
              disabled={isUploading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          )}
        </div>
        
        <p className="text-xs text-gray-500 mt-4 text-center">
          Upload a profile picture (JPEG or PNG, max 5MB)
        </p>
      </CardContent>
    </Card>
  );
}