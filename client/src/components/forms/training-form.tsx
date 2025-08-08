import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { trainingRecordsStorage } from "@/lib/storage";
import { insertTrainingRecordSchema, TrainingRecord, TrainingCategoryEnum, TrainingStatusEnum } from "@shared/schema";
import { Camera, X, FileText } from "lucide-react";
import { z } from "zod";

// Form schema with client validation
const trainingFormSchema = insertTrainingRecordSchema.extend({
  date: z.string().min(1, "Date is required"),
  expiryDate: z.string().optional(),
});

type TrainingFormData = z.infer<typeof trainingFormSchema>;

interface TrainingFormProps {
  record?: TrainingRecord | null;
  onSuccess?: () => void;
}

export default function TrainingForm({ record, onSuccess }: TrainingFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!record;
  const [certificatePhoto, setCertificatePhoto] = useState<string | null>(record?.attachment || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<TrainingFormData>({
    resolver: zodResolver(trainingFormSchema),
    defaultValues: {
      title: record?.title || "",
      description: record?.description || "",
      provider: record?.provider || "",
      duration: record?.duration || 0,
      category: record?.category || "",
      status: record?.status || "completed",
      date: record?.date ? new Date(record.date).toISOString().split('T')[0] : "",
      expiryDate: record?.expiryDate ? new Date(record.expiryDate).toISOString().split('T')[0] : "",
      certificateNumber: record?.certificateNumber || "",
      attachment: record?.attachment || "",
      notes: record?.notes || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TrainingFormData) => {
      // Convert string dates to proper format and include photo
      const formattedData = {
        ...data,
        date: new Date(data.date).toISOString().split('T')[0],
        expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString().split('T')[0] : null,
        attachment: certificatePhoto || null,
      };
      
      if (isEditing && record) {
        return await trainingRecordsStorage.update(record.id!, formattedData);
      } else {
        return await trainingRecordsStorage.add(formattedData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainingRecords"] });
      toast({
        title: "Success",
        description: isEditing ? "Training record updated successfully" : "Training record added successfully",
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Training record mutation error:", error);
      toast({
        title: "Error",
        description: "Failed to save training record",
        variant: "destructive",
      });
    },
  });

  // Photo capture functionality
  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCertificatePhoto(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeCertificatePhoto = () => {
    setCertificatePhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (data: TrainingFormData) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Training Title *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Fire Safety Training" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Training Provider *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., NHS Trust, RCN" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(TrainingCategoryEnum).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(TrainingStatusEnum).map(([key, value]) => (
                      <SelectItem key={key} value={value}>
                        {value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (hours) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="e.g., 2"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Training Date *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date (if applicable)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="certificateNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certificate Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., CERT-2024-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Certificate Photo Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Certificate Photo (Optional)</Label>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            {certificatePhoto ? (
              <div className="space-y-3">
                <div className="relative">
                  <img 
                    src={certificatePhoto} 
                    alt="Certificate" 
                    className="w-full max-w-md h-auto rounded border shadow-sm"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={removeCertificatePhoto}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCameraCapture}
                  className="w-full"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Replace Photo
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Take a photo of your training certificate for your records
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCameraCapture}
                    className="w-full"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              className="hidden"
            />
          </div>
          <p className="text-xs text-gray-500">
            Photos are stored securely on your device only and never uploaded to servers.
          </p>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of the training content"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional notes or comments"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="bg-revalpro-blue hover:bg-revalpro-dark-blue"
          >
            {mutation.isPending ? "Saving..." : isEditing ? "Update Record" : "Add Record"}
          </Button>
        </div>
      </form>
    </Form>
  );
}