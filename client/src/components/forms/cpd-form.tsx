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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cpdRecordsStorage } from "@/lib/storage";
import { insertCpdRecordSchema, type CpdRecord, CodeSectionsEnum } from "@shared/schema";
import { formatDateForInput, toDate } from "@/lib/date-utils";

// Extend the schema with form validation
const formSchema = insertCpdRecordSchema.extend({
  date: z.string().min(1, "Date is required"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  hours: z.coerce.number().min(0.5, "Hours must be at least 0.5"),
  participatory: z.boolean(),
  relevanceToCode: z.string().optional(),
  description: z.string().optional().transform(val => val || ""),
});

type CpdFormProps = {
  initialData: CpdRecord | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CpdForm({ initialData, onClose, onSuccess }: CpdFormProps) {
  const { toast } = useToast();
  
  // Initialize form with default values or existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      date: new Date(initialData.date).toISOString().split('T')[0],
      title: initialData.title,
      description: initialData.description || "",
      hours: initialData.hours,
      participatory: initialData.participatory,
      relevanceToCode: initialData.relevanceToCode || "",
      attachment: initialData.attachment || "",
    } : {
      date: new Date().toISOString().split('T')[0],
      title: "",
      description: "",
      hours: 1,
      participatory: false,
      relevanceToCode: "",
      attachment: "",
    },
  });
  
  // Create or update mutation
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const formattedData = {
        ...data,
        // Convert the string date to a Date object for storage
        date: new Date(data.date),
      };

      if (initialData) {
        // Update existing record
        await cpdRecordsStorage.update(initialData.id, formattedData);
        return initialData.id;
      } else {
        // Create new record
        return await cpdRecordsStorage.add(formattedData);
      }
    },
    onSuccess: () => {
      toast({
        title: initialData ? "Record updated" : "Record added",
        description: initialData 
          ? "CPD record has been updated" 
          : "CPD activity has been added to your records",
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
          <DialogTitle>{initialData ? "Edit CPD Activity" : "Add CPD Activity"}</DialogTitle>
          <DialogDescription>
            Record your continuing professional development activities for NMC revalidation. 
            You need 35 hours total, including 20 hours of participatory learning.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Hours</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0.5" 
                        step="0.5" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Infection Control Workshop" {...field} />
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
                      placeholder="Describe what you did and what you learned" 
                      className="resize-none min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="participatory"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Participatory Learning</FormLabel>
                    <FormDescription>
                      Check this if the activity involved learning with other professionals 
                      (e.g., attending a workshop, conference, or group discussion)
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="relevanceToCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relevance to The Code</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select which part of The Code this relates to" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Not specified</SelectItem>
                      {Object.values(CodeSectionsEnum).map((section) => (
                        <SelectItem key={section} value={section}>
                          {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select which part of The Code your activity relates to (optional)
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
