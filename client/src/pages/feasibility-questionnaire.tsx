import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface QuestionnaireResponse {
  id: string;
  testerName: string;
  email: string;
  nmcPin: string;
  nursingSpecialty: string;
  yearsExperience: string;
  previousRevalidation: string;
  currentTrackingMethod: string;
  
  // Navigation & Usability
  easeOfNavigation: number;
  navigationComments: string;
  intuitivenessRating: number;
  confusingFeatures: string;
  
  // Feature Testing
  practiceHoursUseful: number;
  cpdTrackingUseful: number;
  reflectiveAccountsUseful: number;
  aiAssistantUseful: number;
  declarationsUseful: number;
  missingFeatures: string;
  
  // User Experience
  overallSatisfaction: number;
  designRating: number;
  mobileExperience: number;
  speedPerformance: number;
  
  // NMC Compliance
  confidenceInCompliance: number;
  documentationQuality: number;
  revalidationPreparedness: number;
  
  // Comparison & Value
  comparedToCurrentMethod: string;
  willingnessToPayFree: string;
  willingnessToPayStandard: string;
  willingnessToPayPremium: string;
  recommendToColleagues: number;
  
  // Open Feedback
  mostValuableFeature: string;
  biggestFrustration: string;
  improvementSuggestions: string;
  additionalComments: string;
  
  timestamp: string;
}

const ADMIN_USERNAMES = ['demouser', 'admin', 'damon', 'dan', 'RevalProAdmin'];

export default function FeasibilityQuestionnairePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAdminView, setShowAdminView] = useState(false);
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    testerName: "",
    email: "",
    nmcPin: "",
    nursingSpecialty: "",
    yearsExperience: "",
    previousRevalidation: "",
    currentTrackingMethod: "",
    
    easeOfNavigation: 5,
    navigationComments: "",
    intuitivenessRating: 5,
    confusingFeatures: "",
    
    practiceHoursUseful: 5,
    cpdTrackingUseful: 5,
    reflectiveAccountsUseful: 5,
    aiAssistantUseful: 5,
    declarationsUseful: 5,
    missingFeatures: "",
    
    overallSatisfaction: 5,
    designRating: 5,
    mobileExperience: 5,
    speedPerformance: 5,
    
    confidenceInCompliance: 5,
    documentationQuality: 5,
    revalidationPreparedness: 5,
    
    comparedToCurrentMethod: "",
    willingnessToPayFree: "",
    willingnessToPayStandard: "",
    willingnessToPayPremium: "",
    recommendToColleagues: 5,
    
    mostValuableFeature: "",
    biggestFrustration: "",
    improvementSuggestions: "",
    additionalComments: ""
  });

  const isAdmin = user && ADMIN_USERNAMES.includes(user.username);

  useEffect(() => {
    if (!isAdmin && showAdminView) {
      setShowAdminView(false);
    }
  }, [isAdmin, showAdminView]);

  useEffect(() => {
    const savedResponses = localStorage.getItem('feasibilityResponses');
    if (savedResponses) {
      setResponses(JSON.parse(savedResponses));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newResponse: QuestionnaireResponse = {
        id: Date.now().toString(),
        ...formData,
        timestamp: new Date().toISOString()
      };

      const updatedResponses = [...responses, newResponse];
      setResponses(updatedResponses);
      localStorage.setItem('feasibilityResponses', JSON.stringify(updatedResponses));

      setIsSubmitted(true);
      toast({
        title: "Thank you!",
        description: "Your detailed feedback has been submitted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const RatingScale = ({ value, onChange, label, description }: {
    value: number;
    onChange: (value: number) => void;
    label: string;
    description?: string;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {description && <p className="text-xs text-gray-600">{description}</p>}
      <RadioGroup
        value={value.toString()}
        onValueChange={(val) => onChange(parseInt(val))}
        className="flex space-x-4"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <div key={num} className="flex items-center space-x-1">
            <RadioGroupItem value={num.toString()} id={`${label}-${num}`} />
            <Label htmlFor={`${label}-${num}`} className="text-xs">{num}</Label>
          </div>
        ))}
      </RadioGroup>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Very Poor</span>
        <span>Excellent</span>
      </div>
    </div>
  );

  if (showAdminView) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Feasibility Test Responses ({responses.length})</CardTitle>
            <Button onClick={() => setShowAdminView(false)} variant="outline">
              Back to Form
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {responses.length === 0 ? (
                <p>No responses yet.</p>
              ) : (
                responses.map((response, index) => (
                  <Card key={response.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Response #{index + 1} - {response.testerName}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {response.email} | {response.nursingSpecialty} | {new Date(response.timestamp).toLocaleDateString()}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <strong>Overall Satisfaction:</strong> {response.overallSatisfaction}/10
                        </div>
                        <div>
                          <strong>NMC Compliance Confidence:</strong> {response.confidenceInCompliance}/10
                        </div>
                        <div>
                          <strong>Recommend to Colleagues:</strong> {response.recommendToColleagues}/10
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <strong>Most Valuable Feature:</strong>
                        <p className="mt-1">{response.mostValuableFeature}</p>
                      </div>
                      <div>
                        <strong>Biggest Frustration:</strong>
                        <p className="mt-1">{response.biggestFrustration}</p>
                      </div>
                      <div>
                        <strong>Improvement Suggestions:</strong>
                        <p className="mt-1">{response.improvementSuggestions}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-green-600">Thank You!</CardTitle>
            <CardDescription className="text-center">
              Your detailed feedback has been submitted. This information is invaluable for improving RevalPro.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Continue testing the application and feel free to submit additional feedback if you discover anything else.
            </p>
            <Button onClick={() => {
              setIsSubmitted(false);
              setFormData({
                testerName: "",
                email: "",
                nmcPin: "",
                nursingSpecialty: "",
                yearsExperience: "",
                previousRevalidation: "",
                currentTrackingMethod: "",
                easeOfNavigation: 5,
                navigationComments: "",
                intuitivenessRating: 5,
                confusingFeatures: "",
                practiceHoursUseful: 5,
                cpdTrackingUseful: 5,
                reflectiveAccountsUseful: 5,
                aiAssistantUseful: 5,
                declarationsUseful: 5,
                missingFeatures: "",
                overallSatisfaction: 5,
                designRating: 5,
                mobileExperience: 5,
                speedPerformance: 5,
                confidenceInCompliance: 5,
                documentationQuality: 5,
                revalidationPreparedness: 5,
                comparedToCurrentMethod: "",
                willingnessToPayFree: "",
                willingnessToPayStandard: "",
                willingnessToPayPremium: "",
                recommendToColleagues: 5,
                mostValuableFeature: "",
                biggestFrustration: "",
                improvementSuggestions: "",
                additionalComments: ""
              });
            }}>
              Submit Another Response
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            RevalPro Feasibility Test Questionnaire
            {isAdmin && (
              <Button onClick={() => setShowAdminView(true)} variant="outline" size="sm">
                View All Responses ({responses.length})
              </Button>
            )}
          </CardTitle>
          <CardDescription>
            Help us improve RevalPro by providing detailed feedback on your testing experience. 
            This should take 10-15 minutes to complete.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="testerName">Name *</Label>
                  <Input
                    id="testerName"
                    value={formData.testerName}
                    onChange={(e) => handleInputChange('testerName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nmcPin">NMC PIN (Optional)</Label>
                  <Input
                    id="nmcPin"
                    value={formData.nmcPin}
                    onChange={(e) => handleInputChange('nmcPin', e.target.value)}
                    placeholder="e.g., 12A3456E"
                  />
                </div>
                <div>
                  <Label htmlFor="nursingSpecialty">Nursing Specialty *</Label>
                  <Select value={formData.nursingSpecialty} onValueChange={(value) => handleInputChange('nursingSpecialty', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adult-nursing">Adult Nursing</SelectItem>
                      <SelectItem value="mental-health">Mental Health Nursing</SelectItem>
                      <SelectItem value="childrens-nursing">Children's Nursing</SelectItem>
                      <SelectItem value="learning-disability">Learning Disability Nursing</SelectItem>
                      <SelectItem value="midwifery">Midwifery</SelectItem>
                      <SelectItem value="community-nursing">Community Nursing</SelectItem>
                      <SelectItem value="emergency-nursing">Emergency Nursing</SelectItem>
                      <SelectItem value="critical-care">Critical Care</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="yearsExperience">Years of Nursing Experience *</Label>
                  <Select value={formData.yearsExperience} onValueChange={(value) => handleInputChange('yearsExperience', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="11-20">11-20 years</SelectItem>
                      <SelectItem value="20+">20+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="previousRevalidation">Previous NMC Revalidations *</Label>
                  <Select value={formData.previousRevalidation} onValueChange={(value) => handleInputChange('previousRevalidation', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (First revalidation)</SelectItem>
                      <SelectItem value="1">1 revalidation</SelectItem>
                      <SelectItem value="2">2 revalidations</SelectItem>
                      <SelectItem value="3">3 revalidations</SelectItem>
                      <SelectItem value="4+">4+ revalidations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="currentTrackingMethod">How do you currently track your revalidation requirements? *</Label>
                <Textarea
                  id="currentTrackingMethod"
                  value={formData.currentTrackingMethod}
                  onChange={(e) => handleInputChange('currentTrackingMethod', e.target.value)}
                  placeholder="e.g., Excel spreadsheet, paper diary, no tracking system, etc."
                  required
                />
              </div>
            </div>

            <Separator />

            {/* Navigation & Usability */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Navigation & Usability</h3>
              
              <RatingScale
                value={formData.easeOfNavigation}
                onChange={(value) => handleInputChange('easeOfNavigation', value)}
                label="How easy was it to navigate around RevalPro?"
                description="1 = Very difficult, 10 = Very easy"
              />

              <div>
                <Label htmlFor="navigationComments">Navigation Comments</Label>
                <Textarea
                  id="navigationComments"
                  value={formData.navigationComments}
                  onChange={(e) => handleInputChange('navigationComments', e.target.value)}
                  placeholder="Any specific feedback about navigation, menu layout, or finding features?"
                />
              </div>

              <RatingScale
                value={formData.intuitivenessRating}
                onChange={(value) => handleInputChange('intuitivenessRating', value)}
                label="How intuitive did you find the overall interface?"
                description="1 = Very confusing, 10 = Very intuitive"
              />

              <div>
                <Label htmlFor="confusingFeatures">Which features (if any) were confusing or hard to understand?</Label>
                <Textarea
                  id="confusingFeatures"
                  value={formData.confusingFeatures}
                  onChange={(e) => handleInputChange('confusingFeatures', e.target.value)}
                  placeholder="Describe any features that were unclear or difficult to use"
                />
              </div>
            </div>

            <Separator />

            {/* Feature Testing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Feature Evaluation</h3>
              
              <RatingScale
                value={formData.practiceHoursUseful}
                onChange={(value) => handleInputChange('practiceHoursUseful', value)}
                label="Practice Hours Tracking - How useful is this feature?"
                description="1 = Not useful at all, 10 = Extremely useful"
              />

              <RatingScale
                value={formData.cpdTrackingUseful}
                onChange={(value) => handleInputChange('cpdTrackingUseful', value)}
                label="CPD Record Management - How useful is this feature?"
              />

              <RatingScale
                value={formData.reflectiveAccountsUseful}
                onChange={(value) => handleInputChange('reflectiveAccountsUseful', value)}
                label="Reflective Accounts - How useful is this feature?"
              />

              <RatingScale
                value={formData.aiAssistantUseful}
                onChange={(value) => handleInputChange('aiAssistantUseful', value)}
                label="AI Assistant - How useful is this feature?"
              />

              <RatingScale
                value={formData.declarationsUseful}
                onChange={(value) => handleInputChange('declarationsUseful', value)}
                label="Health & Character Declarations - How useful is this feature?"
              />

              <div>
                <Label htmlFor="missingFeatures">What important features are missing from RevalPro?</Label>
                <Textarea
                  id="missingFeatures"
                  value={formData.missingFeatures}
                  onChange={(e) => handleInputChange('missingFeatures', e.target.value)}
                  placeholder="Describe any features you expected to see but couldn't find"
                />
              </div>
            </div>

            <Separator />

            {/* User Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">User Experience</h3>
              
              <RatingScale
                value={formData.overallSatisfaction}
                onChange={(value) => handleInputChange('overallSatisfaction', value)}
                label="Overall satisfaction with RevalPro"
                description="1 = Very dissatisfied, 10 = Very satisfied"
              />

              <RatingScale
                value={formData.designRating}
                onChange={(value) => handleInputChange('designRating', value)}
                label="How would you rate the visual design and layout?"
                description="1 = Very poor, 10 = Excellent"
              />

              <RatingScale
                value={formData.mobileExperience}
                onChange={(value) => handleInputChange('mobileExperience', value)}
                label="Mobile/tablet experience (if tested)"
                description="1 = Very poor, 10 = Excellent, leave at 5 if not tested"
              />

              <RatingScale
                value={formData.speedPerformance}
                onChange={(value) => handleInputChange('speedPerformance', value)}
                label="How would you rate the speed and performance?"
                description="1 = Very slow, 10 = Very fast"
              />
            </div>

            <Separator />

            {/* NMC Compliance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">NMC Compliance & Confidence</h3>
              
              <RatingScale
                value={formData.confidenceInCompliance}
                onChange={(value) => handleInputChange('confidenceInCompliance', value)}
                label="How confident are you that RevalPro meets NMC requirements?"
                description="1 = Not confident at all, 10 = Very confident"
              />

              <RatingScale
                value={formData.documentationQuality}
                onChange={(value) => handleInputChange('documentationQuality', value)}
                label="Quality of generated documents (PDFs, summaries)"
                description="1 = Very poor, 10 = Professional quality"
              />

              <RatingScale
                value={formData.revalidationPreparedness}
                onChange={(value) => handleInputChange('revalidationPreparedness', value)}
                label="How prepared would you feel for revalidation using RevalPro?"
                description="1 = Not prepared, 10 = Fully prepared"
              />
            </div>

            <Separator />

            {/* Value & Comparison */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Value Proposition</h3>
              
              <div>
                <Label htmlFor="comparedToCurrentMethod">How does RevalPro compare to your current tracking method?</Label>
                <RadioGroup
                  value={formData.comparedToCurrentMethod}
                  onValueChange={(value) => handleInputChange('comparedToCurrentMethod', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="much-better" id="much-better" />
                    <Label htmlFor="much-better">Much better</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="better" id="better" />
                    <Label htmlFor="better">Better</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="similar" id="similar" />
                    <Label htmlFor="similar">Similar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="worse" id="worse" />
                    <Label htmlFor="worse">Worse</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="much-worse" id="much-worse" />
                    <Label htmlFor="much-worse">Much worse</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Would you use RevalPro if it were completely free?</Label>
                <RadioGroup
                  value={formData.willingnessToPayFree}
                  onValueChange={(value) => handleInputChange('willingnessToPayFree', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="definitely" id="free-definitely" />
                    <Label htmlFor="free-definitely">Definitely yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="probably" id="free-probably" />
                    <Label htmlFor="free-probably">Probably yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maybe" id="free-maybe" />
                    <Label htmlFor="free-maybe">Maybe</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="probably-not" id="free-probably-not" />
                    <Label htmlFor="free-probably-not">Probably not</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="definitely-not" id="free-definitely-not" />
                    <Label htmlFor="free-definitely-not">Definitely not</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Would you pay £4.99/month for the Standard plan?</Label>
                <RadioGroup
                  value={formData.willingnessToPayStandard}
                  onValueChange={(value) => handleInputChange('willingnessToPayStandard', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="definitely" id="standard-definitely" />
                    <Label htmlFor="standard-definitely">Definitely yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="probably" id="standard-probably" />
                    <Label htmlFor="standard-probably">Probably yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maybe" id="standard-maybe" />
                    <Label htmlFor="standard-maybe">Maybe</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="probably-not" id="standard-probably-not" />
                    <Label htmlFor="standard-probably-not">Probably not</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="definitely-not" id="standard-definitely-not" />
                    <Label htmlFor="standard-definitely-not">Definitely not</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Would you pay £9.99/month for the Premium plan?</Label>
                <RadioGroup
                  value={formData.willingnessToPayPremium}
                  onValueChange={(value) => handleInputChange('willingnessToPayPremium', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="definitely" id="premium-definitely" />
                    <Label htmlFor="premium-definitely">Definitely yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="probably" id="premium-probably" />
                    <Label htmlFor="premium-probably">Probably yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maybe" id="premium-maybe" />
                    <Label htmlFor="premium-maybe">Maybe</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="probably-not" id="premium-probably-not" />
                    <Label htmlFor="premium-probably-not">Probably not</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="definitely-not" id="premium-definitely-not" />
                    <Label htmlFor="premium-definitely-not">Definitely not</Label>
                  </div>
                </RadioGroup>
              </div>

              <RatingScale
                value={formData.recommendToColleagues}
                onChange={(value) => handleInputChange('recommendToColleagues', value)}
                label="How likely are you to recommend RevalPro to nursing colleagues?"
                description="1 = Very unlikely, 10 = Very likely"
              />
            </div>

            <Separator />

            {/* Open Feedback */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Open Feedback</h3>
              
              <div>
                <Label htmlFor="mostValuableFeature">What is the most valuable feature of RevalPro? *</Label>
                <Textarea
                  id="mostValuableFeature"
                  value={formData.mostValuableFeature}
                  onChange={(e) => handleInputChange('mostValuableFeature', e.target.value)}
                  placeholder="Describe the feature you found most useful and why"
                  required
                />
              </div>

              <div>
                <Label htmlFor="biggestFrustration">What was your biggest frustration or challenge while using RevalPro? *</Label>
                <Textarea
                  id="biggestFrustration"
                  value={formData.biggestFrustration}
                  onChange={(e) => handleInputChange('biggestFrustration', e.target.value)}
                  placeholder="Describe any problems, bugs, or frustrating experiences"
                  required
                />
              </div>

              <div>
                <Label htmlFor="improvementSuggestions">What specific improvements would you suggest? *</Label>
                <Textarea
                  id="improvementSuggestions"
                  value={formData.improvementSuggestions}
                  onChange={(e) => handleInputChange('improvementSuggestions', e.target.value)}
                  placeholder="Provide specific suggestions for how RevalPro could be improved"
                  required
                />
              </div>

              <div>
                <Label htmlFor="additionalComments">Any additional comments or feedback?</Label>
                <Textarea
                  id="additionalComments"
                  value={formData.additionalComments}
                  onChange={(e) => handleInputChange('additionalComments', e.target.value)}
                  placeholder="Anything else you'd like to share about your RevalPro experience"
                />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button type="submit" disabled={isSubmitting} size="lg">
                {isSubmitting ? "Submitting..." : "Submit Questionnaire"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}