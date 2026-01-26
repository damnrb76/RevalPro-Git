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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { confirmationStorage } from "@/lib/storage";
import { insertConfirmationSchema, type Confirmation } from "@shared/schema";

// Extend the schema with form validation
const formSchema = insertConfirmationSchema.extend({
  confirmerName: z.string().min(1, "Confirmer name is required"),
  confirmerEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  confirmerNmcPin: z.string().optional(),
  confirmerRelationship: z.string().min(1, "Relationship is required"),
  confirmationDate: z.coerce.date(),
  completed: z.boolean(),
});

type ConfirmationFormProps = {
  initialData: Confirmation | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ConfirmationForm({ initialData, onClose, onSuccess }: ConfirmationFormProps) {
  const { toast } = useToast();
  
  // Initialize form with default values or existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      confirmerName: initialData.confirmerName,
      confirmerEmail: initialData.confirmerEmail || "",
      confirmerNmcPin: initialData.confirmerNmcPin || "",
      confirmerRelationship: initialData.confirmerRelationship,
      confirmationDate: initialData.confirmationDate ? new Date(initialData.confirmationDate) : new Date(),
      completed: initialData.completed,
    } : {
      confirmerName: "",
      confirmerEmail: "",
      confirmerNmcPin: "",
      confirmerRelationship: "",
      confirmationDate: new Date(),
      completed: false,
    },
  });
  
  // Create or update mutation
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (initialData) {
        // Update existing record
        await confirmationStorage.update(initialData.id, data);
        return initialData.id;
      } else {
        // Create new record
        return await confirmationStorage.add(data);
      }
    },
    onSuccess: () => {
      toast({
        title: initialData ? "Confirmation updated" : "Confirmation recorded",
        description: initialData 
          ? "Your confirmation details have been updated" 
          : "Your confirmation details have been recorded",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${initialData ? 'update' : 'record'} confirmation: ${error.message}`,
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
          <DialogTitle>Revalidation Confirmation</DialogTitle>
          <DialogDescription>
            Record details of the person who has confirmed your revalidation.
          </DialogDescription>
        </DialogHeader>
        
        <Alert className="bg-revalpro-blue/10 border-revalpro-blue my-2">
          <InfoIcon className="h-4 w-4 text-revalpro-blue" />
          <AlertDescription className="text-revalpro-black">
            Your confirmer is an appropriate person who has verified that you have met all the revalidation requirements.
          </AlertDescription>
        </Alert>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="confirmerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name of your confirmer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="confirmerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="confirmer@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmerNmcPin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NMC PIN (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 98X1234E" {...field} />
                      </FormControl>
                      <FormDescription>If they are an NMC registrant</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="confirmerRelationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Relationship</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Line Manager, Team Leader" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Confirmation</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="completed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 card-gradient-green">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Confirmation Completed</FormLabel>
                    <FormDescription>
                      I confirm that I have had my confirmation discussion and this person has verified my revalidation requirements.
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
                className="bg-revalpro-blue hover:bg-revalpro-dark-blue"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : initialData ? "Update" : "Record Confirmation"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
