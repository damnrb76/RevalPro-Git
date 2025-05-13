import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Interface for feedback submissions
interface FeedbackSubmission {
  id: string;
  name: string;
  email: string;
  feedbackType: string;
  feedbackText: string;
  rating: number;
  timestamp: string;
}

export default function TesterFeedbackPage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackType, setFeedbackType] = useState("general");
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAdminView, setShowAdminView] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackSubmission[]>([]);

  // Load existing feedback on component mount
  useEffect(() => {
    const storedFeedback = localStorage.getItem('testerFeedback');
    if (storedFeedback) {
      try {
        setFeedbackList(JSON.parse(storedFeedback));
      } catch (error) {
        console.error("Error parsing stored feedback:", error);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create a new feedback submission
      const newFeedback: FeedbackSubmission = {
        id: Date.now().toString(),
        name,
        email,
        feedbackType,
        feedbackText,
        rating,
        timestamp: new Date().toISOString()
      };

      // Get existing feedback and add the new one
      const existingFeedback = localStorage.getItem('testerFeedback');
      let updatedFeedback: FeedbackSubmission[] = [];
      
      if (existingFeedback) {
        try {
          updatedFeedback = JSON.parse(existingFeedback);
        } catch (error) {
          console.error("Error parsing existing feedback:", error);
        }
      }
      
      updatedFeedback.push(newFeedback);
      
      // Save back to localStorage
      localStorage.setItem('testerFeedback', JSON.stringify(updatedFeedback));
      
      // Update the feedback list in the component state
      setFeedbackList(updatedFeedback);
      
      setIsSubmitted(true);
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback! It helps us improve RevalPro.",
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setFeedbackType("general");
    setFeedbackText("");
    setRating(3);
    setIsSubmitted(false);
  };

  const exportFeedback = () => {
    try {
      // Convert feedback to a CSV file
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Add headers
      csvContent += "ID,Name,Email,Type,Rating,Timestamp,Feedback\n";
      
      // Add data rows
      feedbackList.forEach(item => {
        const formattedDate = new Date(item.timestamp).toLocaleString();
        // Escape quotes in the text and wrap in quotes
        const escapedText = `"${item.feedbackText.replace(/"/g, '""')}"`;
        csvContent += `${item.id},${item.name},${item.email},${item.feedbackType},${item.rating},${formattedDate},${escapedText}\n`;
      });
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `revalpro_feedback_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: "Feedback has been exported to a CSV file.",
      });
    } catch (error) {
      console.error("Error exporting feedback:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the feedback.",
        variant: "destructive",
      });
    }
  };

  const clearFeedback = () => {
    if (window.confirm("Are you sure you want to clear all feedback? This action cannot be undone.")) {
      localStorage.removeItem('testerFeedback');
      setFeedbackList([]);
      toast({
        title: "Feedback cleared",
        description: "All feedback has been removed.",
      });
    }
  };

  // Trigger admin view with double shift + A key combination
  useEffect(() => {
    let shiftPressed = false;
    let shiftCount = 0;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        if (shiftPressed) {
          shiftCount++;
          if (shiftCount >= 2) {
            if (e.getModifierState('Shift') && e.key.toLowerCase() === 'a') {
              setShowAdminView(prev => !prev);
            }
          }
        } else {
          shiftPressed = true;
          shiftCount = 1;
        }
      } else if (e.key.toLowerCase() === 'a' && shiftPressed && shiftCount >= 2) {
        setShowAdminView(prev => !prev);
      } else {
        shiftPressed = false;
        shiftCount = 0;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-revalpro-blue">RevalPro Tester Feedback</h1>
          <p className="text-muted-foreground">
            Your feedback helps us improve the app for all NHS professionals.
          </p>
        </div>
        <Button 
          variant="outline" 
          className="border-revalpro-blue text-revalpro-blue hover:bg-revalpro-blue/10"
          onClick={() => setShowAdminView(!showAdminView)}
        >
          {showAdminView ? "Exit Admin Mode" : "Admin View"}
        </Button>
      </div>

      {showAdminView ? (
        // Admin view for feedback management
        <Card className="border-revalpro-blue/20">
          <CardHeader className="bg-gradient-to-r from-revalpro-purple/20 to-revalpro-blue/20">
            <CardTitle>Feedback Management</CardTitle>
            <CardDescription>
              Review and export tester feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-medium">Total submissions: {feedbackList.length}</h3>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  onClick={exportFeedback}
                  disabled={feedbackList.length === 0}
                  className="flex items-center gap-1 bg-revalpro-blue hover:bg-revalpro-blue/90"
                >
                  <Download size={16} />
                  Export CSV
                </Button>
                <Button
                  variant="destructive"
                  onClick={clearFeedback}
                  disabled={feedbackList.length === 0}
                >
                  Clear All
                </Button>
              </div>
            </div>

            {feedbackList.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No feedback submissions yet.
              </div>
            ) : (
              <div className="space-y-4">
                {feedbackList.map((feedback) => (
                  <Card key={feedback.id} className="border-gray-200">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">
                            {feedback.name || "Anonymous User"}
                          </CardTitle>
                          <CardDescription>
                            {new Date(feedback.timestamp).toLocaleString()}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            feedback.feedbackType === 'bug' ? 'destructive' : 
                            feedback.feedbackType === 'feature' ? 'default' :
                            'outline'
                          }>
                            {feedback.feedbackType}
                          </Badge>
                          <Badge variant="outline" className="bg-revalpro-blue/10">
                            Rating: {feedback.rating}/5
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">{feedback.feedbackText}</p>
                      {feedback.email && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Contact: {feedback.email}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        // User feedback form
        <Card className="border-revalpro-blue/20">
          <CardHeader className="bg-gradient-to-r from-revalpro-blue/10 to-revalpro-purple/10">
            <CardTitle>Share Your Thoughts</CardTitle>
            <CardDescription>
              Let us know what's working well and what could be improved
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Thank You!</h3>
                <p className="text-muted-foreground mb-6">
                  Your feedback has been recorded and will help us improve RevalPro.
                </p>
                <Button onClick={resetForm}>Submit Another Response</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name (Optional)</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Your Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Feedback Type</Label>
                  <RadioGroup
                    value={feedbackType}
                    onValueChange={setFeedbackType}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="general" id="general" />
                      <Label htmlFor="general">General</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="usability" id="usability" />
                      <Label htmlFor="usability">Usability</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="feature" id="feature" />
                      <Label htmlFor="feature">Feature Request</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bug" id="bug" />
                      <Label htmlFor="bug">Bug Report</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback">Your Feedback</Label>
                  <Textarea
                    id="feedback"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Please share your thoughts, suggestions, or issues..."
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>How would you rate this app? (1-5)</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Button
                        key={value}
                        type="button"
                        variant={rating === value ? "default" : "outline"}
                        className={`w-12 h-12 ${
                          rating === value
                            ? "bg-revalpro-blue hover:bg-revalpro-blue/90"
                            : ""
                        }`}
                        onClick={() => setRating(value)}
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground pt-1">
                    <span>Needs Improvement</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !feedbackText.trim()}
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4 text-xs text-muted-foreground">
            <p>
              Feedback is stored locally on your device and will be reviewed to improve the application.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}