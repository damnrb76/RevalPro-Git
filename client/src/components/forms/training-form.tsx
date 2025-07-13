import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertTrainingRecordSchema, TrainingRecord, TrainingCategoryEnum, TrainingStatusEnum } from "@shared/schema";
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
    mutationFn: (data: TrainingFormData) => {
      const url = isEditing ? `/api/training-records/${record.id}` : "/api/training-records";
      const method = isEditing ? "PUT" : "POST";
      
      // Convert string dates to proper format
      const formattedData = {
        ...data,
        date: new Date(data.date).toISOString().split('T')[0],
        expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString().split('T')[0] : null,
      };
      
      return apiRequest(url, {
        method,
        body: JSON.stringify(formattedData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/training-records"] });
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