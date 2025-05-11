import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { feedbackRecordsStorage } from "@/lib/storage";
import { insertFeedbackRecordSchema, type FeedbackRecord } from "@shared/schema";

// Extend the schema with form validation
const formSchema = insertFeedbackRecordSchema.extend({
  date: z.string().min(1, "Date is required"),
  source: z.string().min(2, "Source must be at least 2 characters"),
  content: z.string().min(5, "Content must be at least 5 characters"),
});

type FeedbackFormProps = {
  initialData: FeedbackRecord | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function FeedbackForm({ initialData, onClose, onSuccess }: FeedbackFormProps) {
  const { toast } = useToast();
  
  // Initialize form with default values or existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      date: new Date(initialData.date).toISOString().split('T')[0],
      source: initialData.source,
      content: initialData.content,
      reflection: initialData.reflection || "",
      attachment: initialData.attachment || "",
    } : {
      date: new Date().toISOString().split('T')[0],
      source: "",
      content: "",
      reflection: "",
      attachment: "",
    },
  });
  
  // Create or update mutation
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (initialData) {
        // Update existing record
        await feedbackRecordsStorage.update(initialData.id, {
          ...data,
          date: new Date(data.date),
        });
        return initialData.id;
      } else {
        // Create new record
        return await feedbackRecordsStorage.add({
          ...data,
          date: new Date(data.date),
        });
      }
    },
    onSuccess: () => {
      toast({
        title: initialData ? "Feedback updated" : "Feedback added",
        description: initialData 
          ? "Feedback record has been updated" 
          : "Feedback has been added to your records",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${initialData ? 'update' : 'add'} feedback: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
  };
  
  const feedbackSources = [
    "Patient/Service User",
    "Patient's Family/Carer",
    "Colleague (Nurse/Midwife)",
    "Colleague (Other Healthcare Professional)",
    "Manager/Team Leader",
    "Student",
    "Annual Appraisal",
    "Clinical Supervision",
    "Team Meeting",
    "Other"
  ];
  
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Feedback" : "Add Feedback"}</DialogTitle>
          <DialogDescription>
            Record practice-related feedback for NMC revalidation. 
            You need 5 pieces of feedback from different sources.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Received</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback Source</FormLabel>
                  <FormControl>
                    <Input 
                      list="feedback-sources"
                      placeholder="e.g., Patient, Colleague, Manager" 
                      {...field} 
                    />
                  </FormControl>
                  <datalist id="feedback-sources">
                    {feedbackSources.map((source) => (
                      <option key={source} value={source} />
                    ))}
                  </datalist>
                  <FormDescription>
                    Who provided this feedback? (Maintain confidentiality)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the feedback you received" 
                      className="resize-none min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Please anonymize any identifiable information about patients or colleagues
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="reflection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Reflection (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="How did this feedback affect your practice?" 
                      className="resize-none min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    How did this feedback make you feel? What did you learn from it?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : initialData ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
