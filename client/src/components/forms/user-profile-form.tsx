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
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  registrationNumber: z.string().optional().refine((val) => {
    if (!val || val.trim() === "") return true;
    return /^\d{2}[A-Z]\d{4}[A-Z]$/.test(val);
  }, "NMC PIN format should be like 08I3421E"),
  expiryDate: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  jobTitle: z.string().optional(),
  profileImage: z.string().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

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
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      registrationNumber: initialData.registrationNumber || "",
      expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : "",
      email: initialData.email || "",
      jobTitle: initialData.jobTitle || "",
      profileImage: initialData.profileImage || "",
    } : {
      name: "",
      registrationNumber: "",
      expiryDate: "",
      email: "",
      jobTitle: "",
      profileImage: "",
    },
  });
  
  // Create or update mutation
  const mutation = useMutation({
    mutationFn: async (data: FormSchemaType) => {
      if (initialData) {
        // Update existing profile, preserving the profile image if it exists
        await userProfileStorage.update(initialData.id, {
          name: data.name,
          registrationNumber: data.registrationNumber || "",
          expiryDate: data.expiryDate || "", 
          email: data.email,
          profileImage: initialData.profileImage, // Preserve the existing profile image
        });
        return initialData.id;
      } else {
        // Create new profile
        return await userProfileStorage.add({
          name: data.name,
          registrationNumber: data.registrationNumber || null,
          expiryDate: data.expiryDate || null,
          email: data.email,
          jobTitle: data.jobTitle || null,
          profileImage: null, // Initialize with no profile image
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
  
  const onSubmit = (data: FormSchemaType) => {
    mutation.mutate(data);
  };
  
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
                  <FormLabel>NMC PIN (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 08I3421E" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your Nursing & Midwifery Council registration number. You can add this later if needed.
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
                  <FormLabel>Registration Expiry Date (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    The date when your current NMC registration expires. You can add this later if needed.
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
