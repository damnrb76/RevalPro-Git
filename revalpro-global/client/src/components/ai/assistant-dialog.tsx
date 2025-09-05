import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, SparkleIcon } from "lucide-react";
import { getRevalidationAdvice, generateReflectiveTemplate, suggestCpdActivities } from "@/lib/gemini-service";

interface AssistantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AssistantDialog({ open, onOpenChange }: AssistantDialogProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("advice");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  
  // Advice tab state
  const [question, setQuestion] = useState("");
  
  // Reflection tab state
  const [experience, setExperience] = useState("");
  const [codeSection, setCodeSection] = useState("");
  
  // CPD tab state
  const [specialty, setSpecialty] = useState("");
  const [interests, setInterests] = useState("");

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast({
        title: "Please enter a question",
        description: "Your question cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await getRevalidationAdvice(question);
      setResult(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from the assistant",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReflection = async () => {
    if (!experience.trim()) {
      toast({
        title: "Please describe your experience",
        description: "Experience description cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await generateReflectiveTemplate(experience, codeSection);
      setResult(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate reflection template",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestCpd = async () => {
    if (!specialty.trim()) {
      toast({
        title: "Please enter your specialty",
        description: "Specialty cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await suggestCpdActivities(specialty, interests);
      setResult(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to suggest CPD activities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setResult("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <SparkleIcon className="h-5 w-5 mr-2 text-revalpro-orange" />
            <span className="text-xl font-bold bg-gradient-to-r from-revalpro-blue to-revalpro-teal bg-clip-text text-transparent">
              RevalPro AI Assistant
            </span>
          </DialogTitle>
          <DialogDescription>
            Get helpful guidance, generate reflection templates, and discover CPD activities tailored to your needs.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="advice">Revalidation Advice</TabsTrigger>
            <TabsTrigger value="reflection">Reflection Helper</TabsTrigger>
            <TabsTrigger value="cpd">CPD Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="advice" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">What would you like to know about revalidation?</Label>
              <Textarea
                id="question"
                placeholder="e.g., How many practice hours do I need? What counts as participatory learning?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <Button onClick={handleAskQuestion} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Answer...
                </>
              ) : (
                "Ask Question"
              )}
            </Button>
          </TabsContent>

          <TabsContent value="reflection" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="experience">Briefly describe the experience you want to reflect on</Label>
              <Textarea
                id="experience"
                placeholder="e.g., I attended a workshop on wound care and applied new techniques with my patients"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codeSection">Which section of The Code does this relate to?</Label>
              <Input
                id="codeSection"
                placeholder="e.g., Prioritise people, Practice effectively"
                value={codeSection}
                onChange={(e) => setCodeSection(e.target.value)}
              />
            </div>
            <Button onClick={handleGenerateReflection} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Reflection...
                </>
              ) : (
                "Generate Reflection Template"
              )}
            </Button>
          </TabsContent>

          <TabsContent value="cpd" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialty">What is your nursing specialty or area of practice?</Label>
              <Input
                id="specialty"
                placeholder="e.g., Mental Health, Pediatrics, Critical Care"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interests">What are your professional interests or goals? (Optional)</Label>
              <Textarea
                id="interests"
                placeholder="e.g., I'm interested in leadership development and evidence-based practice"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <Button onClick={handleSuggestCpd} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding Activities...
                </>
              ) : (
                "Suggest CPD Activities"
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {result && (
          <Card className="mt-4 bg-gray-50 border-revalpro-blue">
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex justify-between items-center">
                <span>AI Response</span>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  Copy
                </Button>
              </CardTitle>
              <CardDescription>
                {activeTab === "advice" 
                  ? "Information based on NMC guidance" 
                  : activeTab === "reflection" 
                    ? "Use this as a starting point for your reflection" 
                    : "Suggested activities for your development"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-nhs-black">
                {result}
              </div>
            </CardContent>
          </Card>
        )}

        <DialogFooter>
          <div className="w-full text-xs text-gray-500 text-center mt-2">
            Powered by Google Gemini AI. Information is provided as guidance only and should be verified against official NMC requirements.
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}