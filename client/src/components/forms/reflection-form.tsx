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
import { reflectiveAccountsStorage } from "@/lib/storage";
import { insertReflectiveAccountSchema, type ReflectiveAccount, CodeSectionsEnum } from "@shared/schema";

// Extend the schema with form validation
const formSchema = insertReflectiveAccountSchema.extend({
  date: z.string().min(1, "Date is required"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  experience: z.string().min(10, "Please provide a detailed description of your experience"),
  natureOfExperience: z.string().min(2, "Please specify the nature of this experience"),
  whatLearned: z.string().min(10, "Please describe what you learned from this experience"),
  howChanged: z.string().min(10, "Please describe how this changed your practice"),
  codeRelation: z.string().min(1, "Please select which part of The Code this relates to"),
});

type ReflectionFormProps = {
  initialData: ReflectiveAccount | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ReflectionForm({ initialData, onClose, onSuccess }: ReflectionFormProps) {
  const { toast } = useToast();
  
  // Initialize form with default values or existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      date: new Date(initialData.date).toISOString().split('T')[0],
      title: initialData.title,
      experience: initialData.experience,
      natureOfExperience: initialData.natureOfExperience,
      whatLearned: initialData.whatLearned,
      howChanged: initialData.howChanged,
      codeRelation: initialData.codeRelation,
    } : {
      date: new Date().toISOString().split('T')[0],
      title: "",
      experience: "",
      natureOfExperience: "",
      whatLearned: "",
      howChanged: "",
      codeRelation: "",
    },
  });
  
  // Create or update mutation
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (initialData) {
        // Update existing record
        await reflectiveAccountsStorage.update(initialData.id, {
          ...data,
          date: new Date(data.date),
        });
        return initialData.id;
      } else {
        // Create new record
        return await reflectiveAccountsStorage.add({
          ...data,
          date: new Date(data.date),
        });
      }
    },
    onSuccess: () => {
      toast({
        title: initialData ? "Reflection updated" : "Reflection added",
        description: initialData 
          ? "Reflective account has been updated" 
          : "Reflective account has been added to your records",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${initialData ? 'update' : 'add'} reflection: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
  };
  
  const experienceTypes = [
    "CPD Activity",
    "Feedback Received",
    "Clinical Event",
    "Patient Interaction",
    "Training Session",
    "Team Meeting",
    "Change in Practice",
    "New Procedure/Equipment",
    "Difficult Situation",
    "Positive Experience",
    "Other"
  ];
  
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Reflective Account" : "Add Reflective Account"}</DialogTitle>
          <DialogDescription>
            Record a reflective account for NMC revalidation. 
            You need 5 written reflective accounts that relate to The Code.
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
                    <FormLabel>Date of Reflection</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="natureOfExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nature of Experience</FormLabel>
                    <FormControl>
                      <Input 
                        list="experience-types"
                        placeholder="What type of experience is this?" 
                        {...field} 
                      />
                    </FormControl>
                    <datalist id="experience-types">
                      {experienceTypes.map((type) => (
                        <option key={type} value={type} />
                      ))}
                    </datalist>
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
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Give your reflection a title" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A brief title to identify this reflective account
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="codeRelation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relation to The Code</FormLabel>
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
                      {Object.values(CodeSectionsEnum).map((section) => (
                        <SelectItem key={section} value={section}>
                          {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Which theme from The Code does this reflection relate to?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description of Experience</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what happened or what you experienced" 
                      className="resize-none min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Describe a situation, CPD activity, or feedback that you wish to reflect on
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="whatLearned"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What You Learned</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What did you learn from this experience?" 
                      className="resize-none min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Describe what you learned from this experience and how it relates to The Code
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="howChanged"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How Your Practice Changed</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="How has this changed or improved your practice?" 
                      className="resize-none min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Describe how this experience has changed or will change your nursing practice
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
