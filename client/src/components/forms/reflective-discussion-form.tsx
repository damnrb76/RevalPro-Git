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
import { Checkbox } from "@/components/ui/checkbox";
import { reflectiveDiscussionStorage } from "@/lib/storage";
import { insertReflectiveDiscussionSchema, type ReflectiveDiscussion } from "@shared/schema";

// Extend the schema with form validation
const formSchema = insertReflectiveDiscussionSchema.extend({
  date: z.string().min(1, "Date is required"),
  partnerName: z.string().min(2, "Partner name must be at least 2 characters"),
  partnerNmcPin: z.string().min(5, "NMC PIN is required").regex(/^\d{2}[A-Z]\d{4}[A-Z]$/, "NMC PIN format should be like 08I3421E"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  notes: z.string().optional(),
  completed: z.boolean(),
});

type ReflectiveDiscussionFormProps = {
  initialData: ReflectiveDiscussion | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ReflectiveDiscussionForm({ 
  initialData, 
  onClose, 
  onSuccess 
}: ReflectiveDiscussionFormProps) {
  const { toast } = useToast();
  
  // Initialize form with default values or existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      date: new Date(initialData.date).toISOString().split('T')[0],
      partnerName: initialData.partnerName,
      partnerNmcPin: initialData.partnerNmcPin,
      email: initialData.email || "",
      notes: initialData.notes || "",
      completed: initialData.completed,
    } : {
      date: new Date().toISOString().split('T')[0],
      partnerName: "",
      partnerNmcPin: "",
      email: "",
      notes: "",
      completed: false,
    },
  });
  
  // Create or update mutation
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (initialData) {
        // Update existing record
        await reflectiveDiscussionStorage.update(initialData.id, {
          ...data,
          date: new Date(data.date),
        });
        return initialData.id;
      } else {
        // Create new record
        return await reflectiveDiscussionStorage.add({
          ...data,
          date: new Date(data.date),
        });
      }
    },
    onSuccess: () => {
      toast({
        title: initialData ? "Record updated" : "Record added",
        description: initialData 
          ? "Reflective discussion record has been updated" 
          : "Reflective discussion has been recorded",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${initialData ? 'update' : 'add'} record: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
  };
  
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Reflective Discussion" : "Record Reflective Discussion"}
          </DialogTitle>
          <DialogDescription>
            Record details of your reflective discussion with another NMC registrant.
            This is a required part of the revalidation process.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Discussion</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="partnerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discussion Partner's Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Full name of NMC registrant" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    The name of the NMC registrant who you had your reflective discussion with
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="partnerNmcPin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partner's NMC PIN</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., 08I3421E" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    The NMC PIN of your discussion partner
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partner's Email (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="name@example.com" 
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
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes about your discussion" 
                      className="resize-none min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Any notes about the discussion or points raised
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="completed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Mark as completed</FormLabel>
                    <FormDescription>
                      Check this to confirm that you have completed your reflective discussion
                    </FormDescription>
                  </div>
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
