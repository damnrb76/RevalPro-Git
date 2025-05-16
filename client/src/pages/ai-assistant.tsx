import NhsAiAssistant from "@/components/ai/nhs-ai-assistant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function AiAssistantPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-2 text-revalpro-dark-blue">
        NHS Revalidation AI Assistant
      </h1>
      <p className="text-gray-600 mb-6">
        Get personalized guidance, reflection templates, and CPD suggestions based on your nursing specialty
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <NhsAiAssistant 
            className="h-full" 
            suggestedQuestions={[
              "What are the requirements for NMC revalidation?",
              "What counts as practice hours for revalidation?",
              "How do I find a confirmer for my revalidation?",
              "Can you explain the participatory CPD requirement?",
              "What should I include in my reflective accounts?",
              "When should I start preparing for revalidation?",
            ]}
          />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-revalpro-dark-blue">About This Assistant</CardTitle>
              <CardDescription>
                Powered by OpenAI GPT-4o, built for NHS professionals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-revalpro-blue/5 border-revalpro-blue/20">
                <Info className="h-4 w-4" />
                <AlertTitle>Privacy Notice</AlertTitle>
                <AlertDescription className="text-sm">
                  Your conversations and data are not stored or shared with third parties.
                  All processing is done on demand using Google's Gemini AI.
                </AlertDescription>
              </Alert>
              
              <div>
                <h3 className="font-medium text-sm mb-2">What you can do:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li>Ask questions about NMC revalidation requirements</li>
                  <li>Generate structured reflective account templates</li>
                  <li>Get personalized CPD activity suggestions</li>
                  <li>Understand specific aspects of the NMC Code</li>
                  <li>Get help with revalidation documentation</li>
                </ul>
              </div>
              
              <Tabs defaultValue="tab1" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="tab1">For New Nurses</TabsTrigger>
                  <TabsTrigger value="tab2">For Returning</TabsTrigger>
                  <TabsTrigger value="tab3">For Overseas</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1" className="text-sm text-gray-600 space-y-2 pt-2">
                  <p>If you're new to revalidation, try asking about:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Timeline for collecting evidence</li>
                    <li>Basic requirements overview</li>
                    <li>How to record practice hours</li>
                  </ul>
                </TabsContent>
                <TabsContent value="tab2" className="text-sm text-gray-600 space-y-2 pt-2">
                  <p>If you're returning to practice, consider:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Return to practice requirements</li>
                    <li>Using previous experience for reflection</li>
                    <li>CPD for returnees</li>
                  </ul>
                </TabsContent>
                <TabsContent value="tab3" className="text-sm text-gray-600 space-y-2 pt-2">
                  <p>For overseas nurses, ask about:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>UK-specific requirements</li>
                    <li>Using overseas experience</li>
                    <li>NMC registration for international nurses</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-revalpro-dark-blue">Helpful Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li>
                  <a 
                    href="https://www.nmc.org.uk/revalidation/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-revalpro-blue hover:underline flex items-center gap-1"
                  >
                    NMC Revalidation Portal
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.nmc.org.uk/globalassets/sitedocuments/revalidation/how-to-revalidate-booklet.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-revalpro-blue hover:underline flex items-center gap-1"
                  >
                    How to Revalidate (PDF Guide)
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.nmc.org.uk/standards/code/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-revalpro-blue hover:underline flex items-center gap-1"
                  >
                    The Code: Professional standards
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.rcn.org.uk/professional-development/revalidation" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-revalpro-blue hover:underline flex items-center gap-1"
                  >
                    RCN Revalidation Support
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}