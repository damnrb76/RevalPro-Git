import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SparkleIcon } from "lucide-react";
import AssistantDialog from "./assistant-dialog";

type AssistantButtonProps = {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
};

export default function AssistantButton({ 
  variant = "default", 
  size = "default",
  className = ""
}: AssistantButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)} 
        variant={variant} 
        size={size}
        className={`bg-gradient-to-r from-revalpro-blue to-revalpro-teal hover:opacity-90 ${className}`}
      >
        <SparkleIcon className="mr-2 h-4 w-4" />
        AI Assistant
      </Button>
      
      <AssistantDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}