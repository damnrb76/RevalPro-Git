import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Send, Info, HelpCircle, BookOpen, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  getRevalidationAdvice, 
  generateReflectiveTemplate,
  suggestCpdActivities
} from "@/lib/gemini-service";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Message = {
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
};

type NhsAiAssistantProps = {
  className?: string;
  defaultTab?: "advice" | "reflection" | "cpd";
  suggestedQuestions?: string[];
};

export default function NhsAiAssistant({ 
  className, 
  defaultTab = "advice",
  suggestedQuestions = [
    "How many practice hours do I need for revalidation?",
    "What counts as participatory CPD?",
    "How do I find a confirmer for my revalidation?",
    "What documents do I need for revalidation?",
    "What happens if I miss my revalidation deadline?"
  ]
}: NhsAiAssistantProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Reflection inputs
  const [reflectionExperience, setReflectionExperience] = useState<string>("");
  const [reflectionCodeSection, setReflectionCodeSection] = useState<string>("prioritise-people");
  const [reflectionTemplate, setReflectionTemplate] = useState<string>("");
  const [isGeneratingReflection, setIsGeneratingReflection] = useState<boolean>(false);
  
  // CPD suggestions inputs
  const [nurseSpecialty, setNurseSpecialty] = useState<string>("");
  const [nurseInterests, setNurseInterests] = useState<string>("");
  const [cpdSuggestions, setCpdSuggestions] = useState<string>("");
  const [isGeneratingCpdSuggestions, setIsGeneratingCpdSuggestions] = useState<boolean>(false);

  // Scroll to bottom when messages are updated
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Initialize with a welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "Hello! I'm your NHS revalidation assistant. I can help with questions about the NMC revalidation process, requirements, or guidance. How can I help you today?",
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length]);
  
  // Check if Gemini API key is configured properly
  useEffect(() => {
    const checkApiKey = async () => {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: "ℹ️ I'm currently operating in offline mode with pre-configured responses about NMC revalidation. For more personalized assistance, ask your administrator to set up the Gemini API integration.",
            timestamp: new Date()
          }
        ]);
      }
    };
    
    checkApiKey();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      // Get AI response
      const response = await getRevalidationAdvice(inputValue);
      
      // Add assistant message
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting advice:", error);
      
      // Add error message
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };
  
  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleGenerateReflection = async () => {
    if (!reflectionExperience.trim()) return;
    
    setIsGeneratingReflection(true);
    
    try {
      const template = await generateReflectiveTemplate(
        reflectionExperience,
        reflectionCodeSection
      );
      
      setReflectionTemplate(template);
    } catch (error) {
      console.error("Error generating reflection template:", error);
      setReflectionTemplate("Sorry, I encountered an error while generating your reflection template. Please try again later.");
    } finally {
      setIsGeneratingReflection(false);
    }
  };

  const handleGenerateCpdSuggestions = async () => {
    if (!nurseSpecialty.trim()) return;
    
    setIsGeneratingCpdSuggestions(true);
    
    try {
      const suggestions = await suggestCpdActivities(
        nurseSpecialty,
        nurseInterests
      );
      
      setCpdSuggestions(suggestions);
    } catch (error) {
      console.error("Error generating CPD suggestions:", error);
      setCpdSuggestions("Sorry, I encountered an error while generating CPD suggestions. Please try again later.");
    } finally {
      setIsGeneratingCpdSuggestions(false);
    }
  };

  return (
    <Card className={`ai-assistant-card ${className} shadow-lg`}>
      <CardHeader className="bg-gradient-to-r from-revalpro-blue/30 via-revalpro-teal/20 to-revalpro-purple/20 pb-2">
        <CardTitle className="flex items-center gap-2 text-white">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm">
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold">RevalPro AI Assistant</span>
            <span className="text-xs font-normal text-white/80">NMC Revalidation Guidance</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs 
          defaultValue={defaultTab} 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="advice" className="flex items-center gap-1">
              <Info className="h-4 w-4" /> 
              <span className="hidden sm:inline">Advice</span>
            </TabsTrigger>
            <TabsTrigger value="reflection" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> 
              <span className="hidden sm:inline">Reflection</span>
            </TabsTrigger>
            <TabsTrigger value="cpd" className="flex items-center gap-1">
              <FileText className="h-4 w-4" /> 
              <span className="hidden sm:inline">CPD</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Advice Q&A Tab */}
          <TabsContent value="advice" className="px-4 pb-1 space-y-4">
            <div className="max-h-[400px] overflow-y-auto pr-2">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex gap-2 mb-3 ${message.role === 'assistant' ? 'items-start' : 'items-start flex-row-reverse'}`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src="/static/nhs-logo.svg" alt="NHS" />
                      <AvatarFallback className="bg-revalpro-blue text-white">NHS</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div 
                    className={`rounded-lg p-3 max-w-[85%] text-sm ${
                      message.role === 'assistant' 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-revalpro-blue text-white'
                    }`}
                  >
                    {message.content}
                    <div className={`text-xs mt-1 ${message.role === 'assistant' ? 'text-gray-500' : 'text-revalpro-teal'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src="/static/user.svg" alt="You" />
                      <AvatarFallback className="bg-revalpro-green text-white">You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-2 mb-3 items-start">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src="/static/nhs-logo.svg" alt="NHS" />
                    <AvatarFallback className="bg-revalpro-blue text-white">NHS</AvatarFallback>
                  </Avatar>
                  
                  <div className="rounded-lg p-3 bg-gray-100 text-gray-800 flex items-center">
                    <div className="flex gap-2 items-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {suggestedQuestions && suggestedQuestions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {suggestedQuestions.map((question, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="cursor-pointer hover:bg-revalpro-blue/10 transition-colors"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex gap-2 pt-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about revalidation..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>
          
          {/* Reflection Helper Tab */}
          <TabsContent value="reflection" className="p-4 space-y-4">
            <Alert className="bg-revalpro-blue/5 border-revalpro-blue/20">
              <BookOpen className="h-4 w-4" />
              <AlertTitle>Reflective Account Helper</AlertTitle>
              <AlertDescription className="text-xs text-gray-600">
                Generate a structured reflective account template based on your experience. This helps meet the NMC requirement for 5 reflective accounts.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Describe your experience or situation</label>
                <textarea 
                  className="w-full p-2 border rounded-md text-sm min-h-[100px]" 
                  placeholder="Briefly describe a professional experience you'd like to reflect on..."
                  value={reflectionExperience}
                  onChange={(e) => setReflectionExperience(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Which section of The Code does this relate to?</label>
                <select 
                  className="w-full p-2 border rounded-md text-sm"
                  value={reflectionCodeSection}
                  onChange={(e) => setReflectionCodeSection(e.target.value)}
                >
                  <option value="prioritise-people">Prioritise people</option>
                  <option value="practice-effectively">Practice effectively</option>
                  <option value="preserve-safety">Preserve safety</option>
                  <option value="promote-professionalism">Promote professionalism and trust</option>
                </select>
              </div>
              
              <Button 
                onClick={handleGenerateReflection}
                disabled={!reflectionExperience.trim() || isGeneratingReflection}
                className="w-full"
              >
                {isGeneratingReflection ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>Generate Reflection Template</>
                )}
              </Button>
            </div>
            
            {reflectionTemplate && (
              <div className="mt-4 border rounded-md p-3 bg-white">
                <h3 className="text-sm font-medium mb-2">Your Reflective Account Template</h3>
                <div className="text-sm whitespace-pre-line">{reflectionTemplate}</div>
              </div>
            )}
          </TabsContent>
          
          {/* CPD Suggestions Tab */}
          <TabsContent value="cpd" className="p-4 space-y-4">
            <Alert className="bg-revalpro-blue/5 border-revalpro-blue/20">
              <FileText className="h-4 w-4" />
              <AlertTitle>CPD Activity Suggestions</AlertTitle>
              <AlertDescription className="text-xs text-gray-600">
                Get personalized CPD activity suggestions based on your specialty and interests to help you meet the 35-hour requirement.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Your nursing specialty</label>
                <Input 
                  placeholder="e.g., Medical-surgical, Mental health, Pediatrics..."
                  value={nurseSpecialty}
                  onChange={(e) => setNurseSpecialty(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Your professional interests (optional)</label>
                <textarea 
                  className="w-full p-2 border rounded-md text-sm min-h-[70px]" 
                  placeholder="Topics you're interested in developing knowledge about..."
                  value={nurseInterests}
                  onChange={(e) => setNurseInterests(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleGenerateCpdSuggestions}
                disabled={!nurseSpecialty.trim() || isGeneratingCpdSuggestions}
                className="w-full"
              >
                {isGeneratingCpdSuggestions ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>Generate CPD Suggestions</>
                )}
              </Button>
            </div>
            
            {cpdSuggestions && (
              <div className="mt-4 border rounded-md p-3 bg-white">
                <h3 className="text-sm font-medium mb-2">Suggested CPD Activities</h3>
                <div className="text-sm whitespace-pre-line">{cpdSuggestions}</div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pb-2 pt-1 px-4 text-xs text-gray-500 flex items-center justify-between">
        <div>
          {import.meta.env.VITE_GEMINI_API_KEY 
            ? "AI-powered by Gemini" 
            : <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Running with fallback data</span>
              </span>
          }
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="text-[10px] h-5">
            NHS-Compliant
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}