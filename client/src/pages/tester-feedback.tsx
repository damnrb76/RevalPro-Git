import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function TesterFeedbackPage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackType, setFeedbackType] = useState("general");
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/tester-feedback", {
        name,
        email,
        feedbackType,
        feedbackText,
        rating,
        timestamp: new Date().toISOString()
      });

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

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2 text-revalpro-blue">RevalPro Tester Feedback</h1>
      <p className="text-muted-foreground mb-6">
        Your feedback helps us improve the app for all NHS professionals.
      </p>

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
      </Card>
    </div>
  );
}