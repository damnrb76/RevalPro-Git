import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SparkleIcon } from "lucide-react";
import AssistantDialog from "./assistant-dialog";

type AIHelperCardProps = {
  title?: string;
  description?: string;
  suggestedQuestions?: string[];
  defaultTab?: "advice" | "reflection" | "cpd";
  className?: string;
};

export default function AIHelperCard({
  title = "AI Assistant",
  description = "Get help with your revalidation questions and tasks",
  suggestedQuestions = [
    "How do I write a good reflection?",
    "What counts as participatory learning?",
    "How should I record my practice hours?",
  ],
  defaultTab = "advice",
  className = "",
}: AIHelperCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Card className={`bg-gradient-to-br from-revalpro-pale-blue to-white border-revalpro-blue/30 ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <SparkleIcon className="h-5 w-5 mr-2 text-revalpro-orange" />
            <span className="bg-gradient-to-r from-revalpro-blue to-revalpro-teal bg-clip-text text-transparent">
              {title}
            </span>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm font-medium text-nhs-dark-grey">Suggested questions:</p>
            <div className="flex flex-col space-y-2">
              {suggestedQuestions.map((question, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm" 
                  className="justify-start text-left h-auto py-2 border-revalpro-blue/20 hover:bg-revalpro-pale-blue/20"
                  onClick={() => setIsDialogOpen(true)}
                >
                  {question}
                </Button>
              ))}
            </div>
            <Button 
              className="w-full mt-4 bg-gradient-to-r from-revalpro-blue to-revalpro-teal hover:opacity-90"
              onClick={() => setIsDialogOpen(true)}
            >
              <SparkleIcon className="mr-2 h-4 w-4" />
              Open AI Assistant
            </Button>
          </div>
        </CardContent>
      </Card>

      <AssistantDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}