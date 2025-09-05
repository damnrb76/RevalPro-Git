import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { calculatePercentage } from "@/lib/utils";

type RequirementsCardProps = {
  title: string;
  description: string;
  completed: number;
  total: number;
  unit?: string;
  additionalInfo?: string;
  status: "not_started" | "in_progress" | "attention_needed" | "completed";
  linkHref: string;
  linkText: string;
};

export default function RequirementsCard({
  title,
  description,
  completed,
  total,
  unit = "",
  additionalInfo = "",
  status,
  linkHref,
  linkText
}: RequirementsCardProps) {
  const percentage = calculatePercentage(completed, total);
  
  // Helper to get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "completed";
      case "in_progress":
        return "in-progress";
      case "attention_needed":
        return "attention-needed";
      case "not_started":
      default:
        return "not-started";
    }
  };
  
  // Get progress bar color
  const getProgressVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "revalpro-green";
      case "attention_needed":
        return "revalpro-orange";
      case "not_started":
        return "revalpro-pink";
      case "in_progress":
      default:
        return "revalpro-blue";
    }
  };
  
  // Helper for status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      case "attention_needed":
        return "Attention Needed";
      case "not_started":
      default:
        return "Not Started";
    }
  };
  
  return (
    <Card className="p-5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-revalpro-dark-blue">{title}</h3>
        <Badge variant={getStatusVariant(status)}>
          {getStatusText(status)}
        </Badge>
      </div>
      
      <p className="text-sm text-revalpro-black mb-3">{description}</p>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-revalpro-black">Completed</span>
          <span className="font-medium text-revalpro-black">
            {completed}/{total} {unit}
            {additionalInfo && ` (${additionalInfo})`}
          </span>
        </div>
        <Progress 
          value={completed} 
          max={total} 
          variant={getProgressVariant(status)}
        />
      </div>
      
      <Link href={linkHref}>
        <Button 
          className="mt-auto w-full bg-revalpro-blue hover:bg-revalpro-dark-blue" 
          size="sm"
        >
          {linkText}
        </Button>
      </Link>
    </Card>
  );
}
