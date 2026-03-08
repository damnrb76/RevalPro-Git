import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const questions = [
  {
    id: 1,
    text: "When is your revalidation due?",
    options: [
      { text: "More than 6 months away", score: 10, feedback: "Great! You have plenty of time to prepare." },
      { text: "3-6 months away", score: 8, feedback: "Good timing. Start gathering your evidence now." },
      { text: "Less than 3 months away", score: 5, feedback: "It's crunch time! You need to act fast." },
      { text: "I'm not sure / Overdue", score: 0, feedback: "Urgent! Check your NMC Online account immediately." }
    ]
  },
  {
    id: 2,
    text: "How many practice hours have you logged?",
    options: [
      { text: "All 450 hours logged & verified", score: 10, feedback: "Excellent work!" },
      { text: "Most hours done, just need to log them", score: 7, feedback: "Don't let the paperwork pile up." },
      { text: "I have the hours but no records", score: 4, feedback: "You need to start documenting ASAP." },
      { text: "I haven't met the hours requirement", score: 0, feedback: "This is critical. You may need an extension." }
    ]
  },
  {
    id: 3,
    text: "Have you completed your 5 written reflections?",
    options: [
      { text: "Yes, all 5 are written and linked to the Code", score: 10, feedback: "Perfect!" },
      { text: "I have notes but haven't written them formally", score: 6, feedback: "Use our templates to turn notes into reflections quickly." },
      { text: "I have 1 or 2 done", score: 4, feedback: "You need 5 total. Try to do one a week." },
      { text: "I haven't started any", score: 0, feedback: "This is the most time-consuming part. Start today!" }
    ]
  },
  {
    id: 4,
    text: "Do you have a Confirmer ready?",
    options: [
      { text: "Yes, meeting scheduled/completed", score: 10, feedback: "You're all set." },
      { text: "Yes, but we haven't set a date", score: 8, feedback: "Book it now! Diaries fill up fast." },
      { text: "I have someone in mind but haven't asked", score: 5, feedback: "Ask them today. Don't assume they are available." },
      { text: "I don't know who can confirm me", score: 0, feedback: "Check the NMC guidance on who can be a confirmer." }
    ]
  },
  {
    id: 5,
    text: "How organized is your evidence portfolio?",
    options: [
      { text: "Digital, organized, and backed up", score: 10, feedback: "Professional and safe." },
      { text: "It's in a folder/binder somewhere", score: 6, feedback: "Make sure you have digital backups." },
      { text: "Scattered across emails and drawers", score: 3, feedback: "High risk of losing evidence. Centralize it now." },
      { text: "What portfolio?", score: 0, feedback: "You need a single place for all your evidence." }
    ]
  }
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [, setLocation] = useLocation();

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateTotalScore = () => {
    return answers.reduce((a, b) => a + b, 0);
  };

  const getResult = () => {
    const total = calculateTotalScore();
    const maxScore = questions.length * 10;
    const percentage = (total / maxScore) * 100;

    if (percentage >= 90) return {
      title: "Revalidation Ready!",
      description: "You are in excellent shape. Just keep doing what you're doing.",
      color: "text-green-600",
      icon: CheckCircle2,
      action: "Get your 'Ready' certificate"
    };
    if (percentage >= 60) return {
      title: "Almost There",
      description: "You're on the right track, but there are some gaps to fill.",
      color: "text-yellow-600",
      icon: AlertTriangle,
      action: "Get your Action Plan"
    };
    return {
      title: "At Risk",
      description: "You have significant gaps in your revalidation evidence.",
      color: "text-red-600",
      icon: XCircle,
      action: "Get Emergency Help"
    };
  };

  const result = showResults ? getResult() : null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your backend/Mailchimp
    console.log("Lead captured:", email, "Score:", calculateTotalScore());
    // Redirect to a thank you page or dashboard
    setLocation('/auth?signup=true&email=' + encodeURIComponent(email));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center border-b bg-white rounded-t-xl">
          <CardTitle className="text-2xl font-bold text-slate-800">
            NMC Revalidation Readiness Check
          </CardTitle>
          <CardDescription>
            Find out if you're ready to revalidate in less than 60 seconds.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {!showResults ? (
            <div className="space-y-6">
              <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(((currentQuestion) / questions.length) * 100)}% completed</span>
              </div>
              <Progress value={((currentQuestion) / questions.length) * 100} className="h-2" />
              
              <h3 className="text-xl font-medium text-slate-900 mt-6 mb-8">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="grid gap-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto py-4 px-6 text-left text-base hover:border-primary hover:bg-primary/5 transition-all"
                    onClick={() => handleAnswer(option.score)}
                  >
                    {option.text}
                  </Button>
                ))}
              </div>
              
              {currentQuestion > 0 && (
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setCurrentQuestion(currentQuestion - 1);
                    setAnswers(answers.slice(0, -1));
                  }}
                  className="mt-4 text-slate-400 hover:text-slate-600"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className={`inline-flex items-center justify-center p-4 rounded-full bg-slate-100 mb-4 ${result?.color}`}>
                {result && <result.icon className="w-16 h-16" />}
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900">{result?.title}</h2>
              <p className="text-lg text-slate-600 max-w-md mx-auto">
                {result?.description}
              </p>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mt-8 max-w-md mx-auto">
                <h4 className="font-semibold text-blue-900 mb-2">Get your detailed Action Plan</h4>
                <p className="text-sm text-blue-700 mb-4">
                  Enter your email to receive your personalized checklist and a 10% discount code for RevalPro tools.
                </p>
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <input
                    type="email"
                    required
                    placeholder="nurse@nhs.net"
                    className="w-full px-4 py-2 rounded border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Send My Plan <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
                <p className="text-xs text-blue-400 mt-3">
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
