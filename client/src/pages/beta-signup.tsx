import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Heart, Users, Zap, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface BetaSignupForm {
  name: string;
  email: string;
  nmcPin: string;
  nursingSpecialty: string;
  workLocation: string;
  experience: string;
  revalidationDate: string;
  motivation: string;
  agreeTerms: boolean;
  agreeMarketing: boolean;
}

export default function BetaSignupPage() {
  const [formData, setFormData] = useState<BetaSignupForm>({
    name: "",
    email: "",
    nmcPin: "",
    nursingSpecialty: "",
    workLocation: "",
    experience: "",
    revalidationDate: "",
    motivation: "",
    agreeTerms: false,
    agreeMarketing: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof BetaSignupForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await apiRequest("POST", "/api/beta-signup", formData);
      
      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: "Application Submitted!",
          description: "Thank you for applying to be a RevalPro beta tester. We'll be in touch soon!",
        });
      } else {
        throw new Error("Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting beta signup:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-green-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Application Submitted!</CardTitle>
            <CardDescription className="text-green-600">
              Thank you for your interest in beta testing RevalPro. We'll review your application and be in touch within 48 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              In the meantime, follow us on social media for updates on the beta program.
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              RevalPro Beta Program
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join 20 exclusive beta testers helping shape the future of UK nursing revalidation. 
            Get early access to innovative tools designed by nurses, for nurses.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-800 mb-2">Exclusive Access</h3>
              <p className="text-sm text-blue-600">Be among the first 20 testers to experience RevalPro</p>
            </CardContent>
          </Card>
          
          <Card className="border-teal-200 bg-teal-50/50">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-teal-600 mx-auto mb-3" />
              <h3 className="font-semibold text-teal-800 mb-2">Shape the Future</h3>
              <p className="text-sm text-teal-600">Your feedback directly influences the final product</p>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 bg-purple-50/50">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-purple-800 mb-2">Free Premium Access</h3>
              <p className="text-sm text-purple-600">Complimentary premium features for 6 months</p>
            </CardContent>
          </Card>
        </div>

        {/* Sign-up Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Beta Tester Application</CardTitle>
            <CardDescription>
              Tell us about yourself and your nursing practice. All information is confidential and used only for beta selection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nmcPin">NMC PIN (Optional)</Label>
                  <Input
                    id="nmcPin"
                    type="text"
                    value={formData.nmcPin}
                    onChange={(e) => handleInputChange("nmcPin", e.target.value)}
                    placeholder="Your NMC PIN number"
                  />
                  <p className="text-xs text-gray-500 mt-1">Used for personalized revalidation reminders</p>
                </div>
                
                <div>
                  <Label htmlFor="nursingSpecialty">Nursing Specialty *</Label>
                  <Select onValueChange={(value) => handleInputChange("nursingSpecialty", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adult-nursing">Adult Nursing</SelectItem>
                      <SelectItem value="mental-health">Mental Health Nursing</SelectItem>
                      <SelectItem value="childrens-nursing">Children's Nursing</SelectItem>
                      <SelectItem value="learning-disability">Learning Disability Nursing</SelectItem>
                      <SelectItem value="district-nursing">District Nursing</SelectItem>
                      <SelectItem value="school-nursing">School Nursing</SelectItem>
                      <SelectItem value="occupational-health">Occupational Health</SelectItem>
                      <SelectItem value="emergency-nursing">Emergency/A&E Nursing</SelectItem>
                      <SelectItem value="critical-care">Critical Care/ICU</SelectItem>
                      <SelectItem value="theatre-nursing">Theatre Nursing</SelectItem>
                      <SelectItem value="community-nursing">Community Nursing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workLocation">Work Location *</Label>
                  <Select onValueChange={(value) => handleInputChange("workLocation", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Where do you work?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nhs-hospital">NHS Hospital</SelectItem>
                      <SelectItem value="private-hospital">Private Hospital</SelectItem>
                      <SelectItem value="community-health">Community Health Service</SelectItem>
                      <SelectItem value="care-home">Care Home</SelectItem>
                      <SelectItem value="mental-health-trust">Mental Health Trust</SelectItem>
                      <SelectItem value="agency-work">Agency/Bank Work</SelectItem>
                      <SelectItem value="independent-practice">Independent Practice</SelectItem>
                      <SelectItem value="education">Education/Training</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Select onValueChange={(value) => handleInputChange("experience", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 years (Newly qualified)</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="11-15">11-15 years</SelectItem>
                      <SelectItem value="16-20">16-20 years</SelectItem>
                      <SelectItem value="20+">20+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="revalidationDate">Next Revalidation Date (Optional)</Label>
                <Input
                  id="revalidationDate"
                  type="date"
                  value={formData.revalidationDate}
                  onChange={(e) => handleInputChange("revalidationDate", e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Helps us provide timely testing scenarios</p>
              </div>

              <div>
                <Label htmlFor="motivation">Why do you want to beta test RevalPro? *</Label>
                <Textarea
                  id="motivation"
                  value={formData.motivation}
                  onChange={(e) => handleInputChange("motivation", e.target.value)}
                  placeholder="Tell us about your revalidation challenges and what you hope to gain from testing RevalPro..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              {/* Agreements */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
                  />
                  <Label htmlFor="agreeTerms" className="text-sm leading-tight">
                    I agree to participate in the RevalPro beta program and provide constructive feedback. I understand this is a testing environment and data may be reset during the beta period. *
                  </Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeMarketing"
                    checked={formData.agreeMarketing}
                    onCheckedChange={(checked) => handleInputChange("agreeMarketing", checked as boolean)}
                  />
                  <Label htmlFor="agreeMarketing" className="text-sm leading-tight">
                    I'd like to receive updates about RevalPro features and nursing technology news (optional)
                  </Label>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Privacy Notice:</strong> Your information is encrypted and stored securely. We'll only contact you about the beta program and will never share your details with third parties.
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting Application..." : "Apply for Beta Access"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Questions about the beta program? Email us at <a href="mailto:beta@revalpro.co.uk" className="text-blue-600 hover:underline">beta@revalpro.co.uk</a></p>
        </div>
      </div>
    </main>
  );
}