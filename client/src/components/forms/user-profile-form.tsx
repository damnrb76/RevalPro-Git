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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { userProfileStorage } from "@/lib/storage";
import { insertUserProfileSchema, type UserProfile } from "@shared/schema";
import { addYears } from "date-fns";

// Extend the schema with form validation
const formSchema = insertUserProfileSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  registrationNumber: z.string().min(5, "Registration number is required").regex(/^\d{2}[A-Z]\d{4}[A-Z]$/, "NMC PIN format should be like 08I3421E"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
});

type UserProfileFormProps = {
  initialData: UserProfile | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function UserProfileForm({ initialData, onClose, onSuccess }: UserProfileFormProps) {
  const { toast } = useToast();
  
  // Calculate default expiry date (3 years from now)
  const defaultExpiryDate = addYears(new Date(), 3).toISOString().split('T')[0];
  
  // Initialize form with default values or existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      registrationNumber: initialData.registrationNumber,
      expiryDate: new Date(initialData.expiryDate).toISOString().split('T')[0],
      email: initialData.email || "",
    } : {
      name: "",
      registrationNumber: "",
      expiryDate: defaultExpiryDate,
      email: "",
    },
  });
  
  // Create or update mutation
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (initialData) {
        // Update existing profile
        await userProfileStorage.update(initialData.id, {
          ...data,
          expiryDate: new Date(data.expiryDate),
        });
        return initialData.id;
      } else {
        // Create new profile
        return await userProfileStorage.add({
          ...data,
          expiryDate: new Date(data.expiryDate),
        });
      }
    },
    onSuccess: () => {
      toast({
        title: initialData ? "Profile updated" : "Profile created",
        description: initialData 
          ? "Your profile has been updated successfully" 
          : "Your profile has been created successfully",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${initialData ? 'update' : 'create'} profile: ${error.message}`,
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
          <DialogTitle>{initialData ? "Edit Profile" : "Create Profile"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update your profile information" : "Set up your profile to track your revalidation progress"}
          </DialogDescription>
        </DialogHeader>
        
        <Alert className="bg-nhs-pale-grey border-nhs-light-blue my-2">
          <InfoIcon className="h-4 w-4 text-nhs-light-blue" />
          <AlertDescription>
            Your information is stored only on this device and is not shared with the NMC or any other organization.
          </AlertDescription>
        </Alert>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="registrationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NMC PIN</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 08I3421E" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your Nursing & Midwifery Council registration number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Expiry Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    The date when your current NMC registration expires
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
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="Your email address" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Your email for notifications (stored locally only)
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
                {mutation.isPending ? "Saving..." : initialData ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
