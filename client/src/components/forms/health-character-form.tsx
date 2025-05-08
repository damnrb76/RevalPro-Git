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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { healthDeclarationStorage } from "@/lib/storage";
import { insertHealthDeclarationSchema, type HealthDeclaration } from "@shared/schema";

// Extend the schema with form validation
const formSchema = insertHealthDeclarationSchema.extend({
  goodHealth: z.boolean(),
  healthChanges: z.string().optional(),
  goodCharacter: z.boolean(),
  characterChanges: z.string().optional(),
  completed: z.boolean(),
});

type HealthCharacterFormProps = {
  initialData: HealthDeclaration | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function HealthCharacterForm({ initialData, onClose, onSuccess }: HealthCharacterFormProps) {
  const { toast } = useToast();
  
  // Initialize form with default values or existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      goodHealth: initialData.goodHealth,
      healthChanges: initialData.healthChanges || "",
      goodCharacter: initialData.goodCharacter,
      characterChanges: initialData.characterChanges || "",
      completed: initialData.completed,
    } : {
      goodHealth: true,
      healthChanges: "",
      goodCharacter: true,
      characterChanges: "",
      completed: false,
    },
  });
  
  // Watch for form values to show/hide conditional fields
  const goodHealth = form.watch("goodHealth");
  const goodCharacter = form.watch("goodCharacter");
  
  // Create or update mutation
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (initialData) {
        // Update existing record
        await healthDeclarationStorage.update(initialData.id, data);
        return initialData.id;
      } else {
        // Create new record
        return await healthDeclarationStorage.add(data);
      }
    },
    onSuccess: () => {
      toast({
        title: initialData ? "Declaration updated" : "Declaration completed",
        description: initialData 
          ? "Your health and character declaration has been updated" 
          : "Your health and character declaration has been recorded",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${initialData ? 'update' : 'complete'} declaration: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
  };
  
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Health and Character Declaration</DialogTitle>
          <DialogDescription>
            Complete your health and character declaration for NMC revalidation.
          </DialogDescription>
        </DialogHeader>
        
        <Alert className="bg-nhs-pale-grey border-nhs-light-blue my-2">
          <InfoIcon className="h-4 w-4 text-nhs-light-blue" />
          <AlertDescription>
            This declaration is for your personal record only. The official declaration will be made
            during your NMC revalidation application.
          </AlertDescription>
        </Alert>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Health Declaration */}
            <div className="space-y-4">
              <h3 className="font-semibold text-nhs-black">Health Declaration</h3>
              
              <FormField
                control={form.control}
                name="goodHealth"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I declare that I am in sufficiently good health</FormLabel>
                      <FormDescription>
                        I declare that my health allows me to practice safely and effectively, with 
                        or without reasonable adjustments.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              {!goodHealth && (
                <FormField
                  control={form.control}
                  name="healthChanges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Details of Health Concerns</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide details of any health issues that may affect your ability to practice safely" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Please include any reasonable adjustments that may be required
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            {/* Character Declaration */}
            <div className="space-y-4">
              <h3 className="font-semibold text-nhs-black">Character Declaration</h3>
              
              <FormField
                control={form.control}
                name="goodCharacter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I declare that I am of good character</FormLabel>
                      <FormDescription>
                        I declare that there have been no changes to my criminal record and no 
                        professional conduct issues since my last registration.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              {!goodCharacter && (
                <FormField
                  control={form.control}
                  name="characterChanges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Details of Character Concerns</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide details of any cautions, convictions, or ongoing investigations" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Include details of any disciplinary proceedings or NMC fitness to practice issues
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            {/* Confirmation */}
            <FormField
              control={form.control}
              name="completed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-nhs-pale-grey">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Confirm declaration completed</FormLabel>
                    <FormDescription>
                      I confirm that I have completed this health and character declaration 
                      to the best of my knowledge and understanding.
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
                {mutation.isPending ? "Saving..." : initialData ? "Update" : "Complete"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
