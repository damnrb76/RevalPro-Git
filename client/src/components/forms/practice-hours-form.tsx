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
import WeeklyHoursCalculator from "./weekly-hours-calculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Extend the schema with form validation
const formSchema = insertPracticeHoursSchema.extend({
  startDate: z.coerce.date({
    errorMap: () => ({ message: "Start date is required" }),
  }),
  endDate: z.coerce.date({
    errorMap: () => ({ message: "End date is required" }),
  }),
  hours: z.coerce.number().min(1, "Hours must be a positive number"),
  workSetting: z.string().min(1, "Work setting is required"),
  scope: z.string().min(1, "Scope of practice is required"),
  registration: z.string().min(1, "Registration is required"),
});

type PracticeHoursFormProps = {
  initialData: PracticeHours | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function PracticeHoursForm({ initialData, onClose, onSuccess }: PracticeHoursFormProps) {
  const { toast } = useToast();
  const [calculationMethod, setCalculationMethod] = useState<"manual" | "weekly">("manual");
  const [calculatedHours, setCalculatedHours] = useState<number>(0);
  const [weeklyBreakdown, setWeeklyBreakdown] = useState<any[]>([]);
  
  // Initialize form with default values or existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      startDate: new Date(initialData.startDate),
      endDate: new Date(initialData.endDate),
      hours: initialData.hours,
      workSetting: initialData.workSetting,
      scope: initialData.scope,
      registration: initialData.registration,
      notes: initialData.notes || "",
    } : {
      startDate: new Date(),
      endDate: new Date(),
      hours: calculationMethod === "weekly" ? calculatedHours : 0,
      workSetting: "",
      scope: "",
      registration: "",
      notes: "",
    },
  });

  // Update hours when calculation method or calculated hours change
  const handleHoursCalculated = (totalHours: number, breakdown: any[]) => {
    setCalculatedHours(totalHours);
    setWeeklyBreakdown(breakdown);
    if (calculationMethod === "weekly") {
      form.setValue("hours", totalHours);
    }
  };
  
  // Create or update mutation
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (initialData) {
        // Update existing record - use original data types
        await practiceHoursStorage.update(initialData.id, {
          startDate: data.startDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD string
          endDate: data.endDate.toISOString().split('T')[0],
          hours: data.hours,
          workSetting: data.workSetting,
          scope: data.scope,
          registration: data.registration,
          notes: data.notes || null,
        });
        return initialData.id;
      } else {
        // Create new record - use insert schema types
        return await practiceHoursStorage.add({
          startDate: data.startDate,
          endDate: data.endDate,
          hours: data.hours,
          workSetting: data.workSetting,
          scope: data.scope,
          registration: data.registration,
          notes: data.notes || null,
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

  const registrationOptions = [
    "Registered Nurse",
    "Midwife",
    "Nursing Associate",
    "Registered Nurse/SCPHN",
    "Midwife/SCPHN",
    "Registered Nurse and Midwife (including Registered Nurse/SCPHN and Midwife/SCPHN)"
  ];
  
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Practice Hours" : "Add Practice Hours"}</DialogTitle>
          <DialogDescription>
            Record your nursing practice hours for NMC revalidation. You need 450 hours (900 for dual registration).
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={calculationMethod} onValueChange={(value) => setCalculationMethod(value as "manual" | "weekly")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Calculator</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Common Date Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              field.onChange(new Date(e.target.value));
                            } else {
                              field.onChange(new Date());
                            }
                          }}
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
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              field.onChange(new Date(e.target.value));
                            } else {
                              field.onChange(new Date());
                            }
                          }}
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <TabsContent value="manual">
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
              </TabsContent>

              <TabsContent value="weekly">
                <div className="space-y-4">
                  <WeeklyHoursCalculator
                    startDate={form.watch("startDate")}
                    endDate={form.watch("endDate")}
                    onHoursCalculated={handleHoursCalculated}
                  />
                  <FormField
                    control={form.control}
                    name="hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calculated Total Hours</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            value={calculatedHours}
                            disabled
                            className="bg-muted"
                          />
                        </FormControl>
                        <FormDescription>
                          Total hours calculated from your weekly schedule and adjustments
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            
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
              name="registration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your registration type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {registrationOptions.map((registration) => (
                        <SelectItem key={registration} value={registration}>
                          {registration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select your NMC registration type
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
                      value={field.value || ''}
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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
