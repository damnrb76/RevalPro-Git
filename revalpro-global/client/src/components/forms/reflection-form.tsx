import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { reflectiveAccountsStorage } from "@/lib/storage";
import { 
  insertReflectiveAccountSchema, 
  type ReflectiveAccount, 
  CodeSectionsEnum,
  ReflectiveModelEnum,
  type ReflectiveModel
} from "@shared/schema";

// Extend the schema with form validation
const formSchema = insertReflectiveAccountSchema.extend({
  date: z.string().min(1, "Date is required"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  reflectiveModel: z.string().min(1, "Please select a reflective model"),
  
  // Standard NMC model fields (always required)
  experience: z.string().min(10, "Please provide a detailed description of your experience"),
  natureOfExperience: z.string().min(2, "Please specify the nature of this experience"),
  codeRelation: z.string().min(1, "Please select which part of The Code this relates to"),
  
  // These fields are conditionally required based on selected model
  whatLearned: z.string().optional(),
  howChanged: z.string().optional(),
  
  // Gibbs Model
  description: z.string().optional(),
  feelings: z.string().optional(),
  evaluation: z.string().optional(),
  analysis: z.string().optional(),
  conclusion: z.string().optional(),
  actionPlan: z.string().optional(),
  
  // Johns Model
  aesthetic: z.string().optional(),
  personal: z.string().optional(),
  ethics: z.string().optional(),
  empirics: z.string().optional(),
  reflexivity: z.string().optional(),
});

type ReflectionFormProps = {
  initialData: ReflectiveAccount | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ReflectionForm({ initialData, onClose, onSuccess }: ReflectionFormProps) {
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState<string>(
    initialData?.reflectiveModel || ReflectiveModelEnum.STANDARD
  );
  
  // Initialize form with default values or existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      date: new Date(initialData.date).toISOString().split('T')[0],
      title: initialData.title,
      reflectiveModel: initialData.reflectiveModel || ReflectiveModelEnum.STANDARD,
      experience: initialData.experience,
      natureOfExperience: initialData.natureOfExperience,
      whatLearned: initialData.whatLearned || "",
      howChanged: initialData.howChanged || "",
      codeRelation: initialData.codeRelation,
      // Gibbs Model fields
      description: initialData.description || "",
      feelings: initialData.feelings || "",
      evaluation: initialData.evaluation || "",
      analysis: initialData.analysis || "",
      conclusion: initialData.conclusion || "",
      actionPlan: initialData.actionPlan || "",
      // Johns Model fields
      aesthetic: initialData.aesthetic || "",
      personal: initialData.personal || "",
      ethics: initialData.ethics || "",
      empirics: initialData.empirics || "",
      reflexivity: initialData.reflexivity || "",
    } : {
      date: new Date().toISOString().split('T')[0],
      title: "",
      reflectiveModel: ReflectiveModelEnum.STANDARD,
      experience: "",
      natureOfExperience: "",
      whatLearned: "",
      howChanged: "",
      codeRelation: "",
      // Gibbs Model fields
      description: "",
      feelings: "",
      evaluation: "",
      analysis: "",
      conclusion: "",
      actionPlan: "",
      // Johns Model fields
      aesthetic: "",
      personal: "",
      ethics: "",
      empirics: "",
      reflexivity: "",
    },
  });
  
  // Watch for reflective model changes
  const watchReflectiveModel = form.watch("reflectiveModel");
  
  // Update selected model when it changes in the form
  useEffect(() => {
    if (watchReflectiveModel) {
      setSelectedModel(watchReflectiveModel);
    }
  }, [watchReflectiveModel]);

  // Create or update mutation
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      // Prepare required fields for chosen model
      let modelSpecificData: any = { ...data };
      
      // Convert date string to Date object
      modelSpecificData.date = new Date(data.date);
      
      if (initialData) {
        // Update existing record
        await reflectiveAccountsStorage.update(initialData.id, modelSpecificData);
        return initialData.id;
      } else {
        // Create new record
        return await reflectiveAccountsStorage.add(modelSpecificData);
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
              name="reflectiveModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reflective Model</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reflective model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ReflectiveModelEnum).map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose which reflective framework you want to use for this account
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
            
            {/* Conditional fields based on selected reflective model */}
            {selectedModel === ReflectiveModelEnum.STANDARD && (
              <>
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
              </>
            )}
            
            {/* Gibbs Reflective Cycle Fields */}
            {selectedModel === ReflectiveModelEnum.GIBBS && (
              <>
                <div className="bg-blue-50 p-4 rounded-md mb-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Using Gibbs Reflective Cycle</h3>
                  <p className="text-sm text-blue-700">
                    This model guides you through six stages: Description, Feelings, Evaluation, 
                    Analysis, Conclusion, and Action Plan.
                  </p>
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (What happened?)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the situation in detail. What happened?" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a factual account of the situation without analysis
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="feelings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feelings (What were you thinking and feeling?)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What thoughts and feelings did you have during this experience?" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Describe your emotions, thoughts, and feelings during the experience
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="evaluation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Evaluation (What was good and bad about the experience?)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Evaluate what was positive and negative about the experience" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Evaluate the experience objectively - what went well and what didn't
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="analysis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Analysis (What sense can you make of the situation?)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Analyze what happened and why, drawing on theory and evidence" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Make sense of the situation using relevant theories, evidence, or NMC guidelines
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="conclusion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conclusion (What else could you have done?)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What other options did you have? What might have happened if you took a different approach?" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Identify what you could have done differently and what you learned
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="actionPlan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Action Plan (If it arose again what would you do?)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What specific actions will you take if a similar situation arises in the future?" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Develop a concrete plan for handling similar situations in the future
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {/* Johns' Model of Reflection Fields */}
            {selectedModel === ReflectiveModelEnum.JOHNS && (
              <>
                <div className="bg-purple-50 p-4 rounded-md mb-4">
                  <h3 className="text-sm font-medium text-purple-800 mb-2">Using Johns' Model of Reflection</h3>
                  <p className="text-sm text-purple-700">
                    This structured reflection model focuses on aesthetic, personal, ethical, empirical, 
                    and reflexive patterns of knowing.
                  </p>
                </div>
                
                <FormField
                  control={form.control}
                  name="aesthetic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aesthetic (Description and Outcomes)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What was I trying to achieve? What were the consequences for the patient, others, and myself?" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Describe what happened, what you were trying to achieve, and the outcomes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="personal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal (Feelings and Thoughts)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How did I feel about this experience? What internal factors were influencing me?" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Explore your feelings, thoughts, and internal factors that influenced you
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ethics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ethics (Influencing Factors and Choices)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What external factors influenced my decision-making? What ethical considerations guided my actions?" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Identify external factors and ethical considerations that influenced your actions
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="empirics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empirics (Knowledge Base)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What knowledge informed or should have informed me? What research, theory, or evidence guided my practice?" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Discuss what research, theory, evidence, or knowledge informed your practice
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reflexivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reflexivity (Learning and Future Practice)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How has this experience changed my ways of knowing? How might I respond more effectively in similar situations?" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Reflect on what you've learned and how you'll apply it to future practice
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {/* Driscoll's What? Model Fields */}
            {selectedModel === ReflectiveModelEnum.DRISCOLL && (
              <>
                <div className="bg-green-50 p-4 rounded-md mb-4">
                  <h3 className="text-sm font-medium text-green-800 mb-2">Using Driscoll's What? Model</h3>
                  <p className="text-sm text-green-700">
                    This simple three-stage model asks: What? (description), So What? (analysis), 
                    and Now What? (action plan).
                  </p>
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What? (Description of the Event)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What happened? What did you observe? What was your role? What issues seem significant?" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Describe the event and your role in detail
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="analysis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>So What? (Analysis and Meaning)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="So what does this mean? What have you learned? What was good/bad about the experience? How did you feel? What knowledge did or should have informed you?" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Analyze the significance of the event and what you've learned from it
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="actionPlan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Now What? (Action Plan)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Now what will you do differently next time? What actions will you take based on what you learned? How will this affect your future practice?" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Describe how this will change your future practice and specific actions you'll take
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {/* Kolb's Learning Cycle Fields */}
            {selectedModel === ReflectiveModelEnum.KOLB && (
              <>
                <div className="bg-amber-50 p-4 rounded-md mb-4">
                  <h3 className="text-sm font-medium text-amber-800 mb-2">Using Kolb's Learning Cycle</h3>
                  <p className="text-sm text-amber-700">
                    This model focuses on learning through experience with four stages: 
                    Concrete Experience, Reflective Observation, Abstract Conceptualization, and Active Experimentation.
                  </p>
                </div>
                
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Concrete Experience (What happened?)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the specific experience or event in detail" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a detailed account of the experience
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="feelings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reflective Observation (What did you observe?)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What did you observe about the experience? What went well or poorly? What were your reactions and those of others?" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Reflect on what you observed about the experience from different perspectives
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="analysis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Abstract Conceptualization (What did you learn?)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What conclusions can you draw? How does this connect to theory or evidence? What principles or broader lessons emerge?" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Connect your experience to theories, evidence, or broader principles
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="actionPlan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Active Experimentation (What will you do differently?)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How will you apply what you've learned? What specific actions will you take in future similar situations?" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Plan how you'll apply your insights to future situations
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {/* Rolfe's Framework Fields */}
            {selectedModel === ReflectiveModelEnum.ROLFE && (
              <>
                <div className="bg-rose-50 p-4 rounded-md mb-4">
                  <h3 className="text-sm font-medium text-rose-800 mb-2">Using Rolfe's Framework</h3>
                  <p className="text-sm text-rose-700">
                    This simple framework asks three key questions: What? (description), 
                    So What? (theory and knowledge building), and Now What? (action-oriented reflection).
                  </p>
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What? (Descriptive Level)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What happened? What was the context? What was your role? What were the consequences?" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Describe the situation, context, your actions, and outcomes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="analysis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>So What? (Theory & Knowledge Building)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="So what does this mean? What did you learn? How does this relate to theory or evidence? What was good/bad? What knowledge informed you?" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Analyze what the experience means in terms of theory, evidence, and personal learning
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="actionPlan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Now What? (Action-Oriented)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Now what will you do? What will happen next? What actions will you take based on what you learned? How will your practice change?" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Describe specific actions and changes you'll implement in your practice
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
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
