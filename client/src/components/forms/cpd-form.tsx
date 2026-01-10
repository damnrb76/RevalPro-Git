import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
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
import { type CpdRecord, CodeSectionsEnum } from "@shared/schema";
import { formatDateForInput, toDate } from "@/lib/date-utils";

// Create a form-specific schema for CPD records with string date for form handling
const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  method: z.string().min(1, "Method is required"),
  hours: z.union([
    z.literal(''),
    z.number().min(0.5, "Hours must be at least 0.5")
  ]).transform(val => val === '' ? 0.5 : val),
  participatory: z.boolean(),
  relevanceToCode: z.string().optional(),
  description: z.string().optional().transform(val => val || ""),
  attachment: z.string().optional().nullable(),
});

// Define the form values type
type CpdFormValues = z.infer<typeof formSchema>;

type CpdFormProps = {
  initialData: CpdRecord | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CpdForm({ initialData, onClose, onSuccess }: CpdFormProps) {
  const { toast } = useToast();
  
  // Initialize form with default values or existing data
  const form = useForm<CpdFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      date: new Date(initialData.date).toISOString().split('T')[0],
      title: initialData.title,
      method: (initialData as any).method || "",
      description: initialData.description || "",
      hours: initialData.hours,
      participatory: initialData.participatory,
      relevanceToCode: initialData.relevanceToCode || "",
      attachment: initialData.attachment || "",
    } : {
      date: new Date().toISOString().split('T')[0],
      title: "",
      method: "",
      description: "",
      hours: 1,
      participatory: false,
      relevanceToCode: "",
      attachment: "",
    },
  });
  
  // Create or update mutation
  const mutation = useMutation({
    mutationFn: async (data: CpdFormValues) => {
      // Keep the date as a string - the database layer will handle it
      // This resolves the type mismatch errors
      const formattedData = {
        ...data,
        // Don't convert date to Date
      };

      if (initialData) {
        // Update existing record - use type assertion to avoid type checking issues
        await cpdRecordsStorage.update(initialData.id, formattedData as any);
        return initialData.id;
      } else {
        // Create new record - use type assertion to avoid type checking issues
        return await cpdRecordsStorage.add(formattedData as any);
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
  
  const onSubmit = (data: CpdFormValues) => {
    // Convert form data to the format expected by storage
    const formattedData = {
      ...data,
      // Don't convert to Date here - will be done in the mutation
    };
    mutation.mutate(formattedData);
  };
  
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTitle className="text-xl text-revalpro-blue">
              {initialData ? "Edit CPD Activity" : "Add CPD Activity"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Record your continuing professional development activities for NMC revalidation. 
              You need 35 hours total, including 20 hours of participatory learning.
            </DialogDescription>
          </motion.div>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Date and Hours Section */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-revalpro-blue font-medium">Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        className="focus-visible:ring-2 ring-revalpro-blue/20 transition-all"
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
                    <FormLabel className="text-revalpro-blue font-medium">Number of Hours</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0.5" 
                        step="0.5"
                        className="focus-visible:ring-2 ring-revalpro-blue/20 transition-all"
                        value={field.value}
                        onChange={(e) => {
                          // Parse the value as a number and update the field
                          const value = e.target.value === '' ? '' : parseFloat(e.target.value);
                          field.onChange(value);
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            
            {/* Activity Title and Method */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-revalpro-blue font-medium">Activity Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Infection Control Workshop" 
                        className="focus-visible:ring-2 ring-revalpro-blue/20 transition-all"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-revalpro-blue font-medium">Method</FormLabel>
                    <FormControl>
                      <Input 
                        list="cpd-methods"
                        placeholder="e.g., Course attendance, Online learning" 
                        className="focus-visible:ring-2 ring-revalpro-blue/20 transition-all"
                        {...field} 
                      />
                    </FormControl>
                    <datalist id="cpd-methods">
                      <option value="Online learning" />
                      <option value="Course attendance" />
                      <option value="Independent learning" />
                      <option value="Conference attendance" />
                      <option value="Workshop" />
                      <option value="Seminar" />
                      <option value="Webinar" />
                      <option value="Meeting attendance" />
                      <option value="Reading" />
                      <option value="Research" />
                      <option value="Study day" />
                      <option value="Training session" />
                      <option value="Other" />
                    </datalist>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-revalpro-blue font-medium">Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what you did and what you learned" 
                        className="resize-none min-h-[100px] focus-visible:ring-2 ring-revalpro-blue/20 transition-all" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            
            {/* Participatory Learning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <FormField
                control={form.control}
                name="participatory"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 border-revalpro-teal/30 hover:border-revalpro-teal/50 transition-colors">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-revalpro-teal data-[state=checked]:text-white"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-revalpro-teal font-medium">Participatory Learning</FormLabel>
                      <FormDescription>
                        Check this if the activity involved learning with other professionals 
                        (e.g., attending a workshop, conference, or group discussion)
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </motion.div>
            
            {/* Relevance to The Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <FormField
                control={form.control}
                name="relevanceToCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-revalpro-blue font-medium">Relevance to The Code</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="focus:ring-2 ring-revalpro-blue/20 transition-all">
                          <SelectValue placeholder="Select which part of The Code this relates to" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="not-specified">Not specified</SelectItem>
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
            </motion.div>
            
            {/* Footer Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <DialogFooter className="gap-2 sm:gap-0 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  disabled={mutation.isPending}
                  className="border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button 
                    type="submit"
                    disabled={mutation.isPending}
                    className="bg-gradient-to-r from-revalpro-blue to-revalpro-teal text-white hover:from-revalpro-dark-blue hover:to-revalpro-blue"
                  >
                    {mutation.isPending ? "Saving..." : initialData ? "Update" : "Save"}
                  </Button>
                </motion.div>
              </DialogFooter>
            </motion.div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
