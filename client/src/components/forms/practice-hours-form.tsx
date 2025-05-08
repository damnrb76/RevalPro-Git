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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { practiceHoursStorage } from "@/lib/storage";
import { insertPracticeHoursSchema, type PracticeHours } from "@shared/schema";

// Extend the schema with form validation
const formSchema = insertPracticeHoursSchema.extend({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  hours: z.coerce.number().min(1, "Hours must be a positive number"),
  workSetting: z.string().min(1, "Work setting is required"),
  scope: z.string().min(1, "Scope of practice is required"),
});

type PracticeHoursFormProps = {
  initialData: PracticeHours | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function PracticeHoursForm({ initialData, onClose, onSuccess }: PracticeHoursFormProps) {
  const { toast } = useToast();
  
  // Initialize form with default values or existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      startDate: new Date(initialData.startDate).toISOString().split('T')[0],
      endDate: new Date(initialData.endDate).toISOString().split('T')[0],
      hours: initialData.hours,
      workSetting: initialData.workSetting,
      scope: initialData.scope,
      notes: initialData.notes || "",
    } : {
      startDate: "",
      endDate: "",
      hours: 0,
      workSetting: "",
      scope: "",
      notes: "",
    },
  });
  
  // Create or update mutation
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (initialData) {
        // Update existing record
        await practiceHoursStorage.update(initialData.id, {
          ...data,
          startDate: data.startDate,
          endDate: data.endDate,
        });
        return initialData.id;
      } else {
        // Create new record
        return await practiceHoursStorage.add({
          ...data,
          startDate: data.startDate,
          endDate: data.endDate,
        });
      }
    },
    onSuccess: () => {
      toast({
        title: initialData ? "Record updated" : "Record added",
        description: initialData 
          ? "Practice hours record has been updated" 
          : "Practice hours have been added to your records",
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
  
  const workSettings = [
    "NHS Hospital",
    "Private Hospital",
    "GP Practice",
    "Community Care",
    "Care Home",
    "Hospice",
    "Education",
    "Research",
    "Management",
    "Policy",
    "Other"
  ];
  
  const scopeOptions = [
    "Adult Nursing",
    "Children's Nursing",
    "Learning Disability Nursing",
    "Mental Health Nursing",
    "Midwifery",
    "Health Visiting",
    "District Nursing",
    "Practice Nursing",
    "Specialist Nursing",
    "Management",
    "Education",
    "Research",
    "Other"
  ];
  
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Practice Hours" : "Add Practice Hours"}</DialogTitle>
          <DialogDescription>
            Record your nursing practice hours for NMC revalidation. You need 450 hours (900 for dual registration).
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
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
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Hours</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the total number of practice hours for this period
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="workSetting"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Setting</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select work setting" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workSettings.map((setting) => (
                        <SelectItem key={setting} value={setting}>
                          {setting}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the type of work setting where you practiced
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="scope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scope of Practice</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select scope of practice" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {scopeOptions.map((scope) => (
                        <SelectItem key={scope} value={scope}>
                          {scope}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Specify your scope of practice during this period
                  </FormDescription>
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
                      placeholder="Add any additional notes about this practice" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
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
