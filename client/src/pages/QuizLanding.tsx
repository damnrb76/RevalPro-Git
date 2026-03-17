import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, Target, Users, Award, Shield } from "lucide-react";
import { useLocation } from "wouter";

export default function QuizLanding() {
  const [, setLocation] = useLocation();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleStartQuiz = () => {
    setLocation("/quiz");
  };

  const benefits = [
    {
      icon: <Clock className="w-8 h-8 text-teal-600" />,
      title: "Instant Assessment",
      description: "Find out your revalidation readiness score in 2 minutes. No lengthy forms, no complicated processes.",
    },
    {
      icon: <Target className="w-8 h-8 text-teal-600" />,
      title: "Personalized Action Plan",
      description: "Receive a customized action plan based on your specific situation. Know exactly what you need to do.",
    },
    {
      icon: <Award className="w-8 h-8 text-teal-600" />,
      title: "10% Discount",
      description: "Complete the quiz and receive an exclusive 10% discount code for Premium (valid 12 months).",
    },
    {
      icon: <Shield className="w-8 h-8 text-teal-600" />,
      title: "Expert Guidance",
      description: "Access expert resources and guidance to help you close any gaps in your revalidation evidence.",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Answer 5 Quick Questions",
      description: "The quiz covers CPD hours, health declarations, reflective practice, professional indemnity insurance, and more. Takes just 2 minutes.",
    },
    {
      number: "2",
      title: "Get Your Score",
      description: "Instantly see your revalidation readiness score and status (Ready, Almost Ready, or At Risk).",
    },
    {
      number: "3",
      title: "Receive Your Action Plan",
      description: "Get a personalized action plan with specific next steps based on your results.",
    },
    {
      number: "4",
      title: "Claim Your Discount",
      description: "Use your exclusive 10% discount code to upgrade to Premium and access full revalidation tracking tools.",
    },
  ];

  const testimonials = [
    {
      quote: "I had no idea I was missing evidence in three areas. The action plan was incredibly helpful. Highly recommend!",
      author: "Sarah, RN",
    },
    {
      quote: "This saved me so much stress. I now know exactly what I need to do and when. Worth every penny.",
      author: "James, Midwife",
    },
    {
      quote: "As a nurse manager, I shared this with my team. Everyone found it useful and appreciated the clarity.",
      author: "Rachel, Nurse Manager",
    },
    {
      quote: "Quick, easy, and actually helpful. The personalized recommendations were spot-on.",
      author: "Michael, Healthcare Professional",
    },
  ];

  const faqs = [
    {
      question: "How long does the quiz take?",
      answer: "Just 2 minutes! It's designed to be quick and straightforward.",
    },
    {
      question: "Is the quiz free?",
      answer: "Yes, completely free. No credit card required.",
    },
    {
      question: "What if I'm not ready for revalidation?",
      answer: "That's what the quiz is for! It identifies gaps so you can address them. Your personalized action plan shows you exactly what to do.",
    },
    {
      question: "How long is the discount code valid?",
      answer: "Your READY10 discount code is valid for 12 months, so you can take your time and upgrade whenever you're ready.",
    },
    {
      question: "What if I have questions after the quiz?",
      answer: "We're here to help! Reply to your results email or contact our support team.",
    },
    {
      question: "Can I share the quiz with my team?",
      answer: "Absolutely! We encourage sharing. Each person gets their own personalized results and discount code.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Is Your Revalidation Evidence Complete?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Take Our Free 2-Minute Readiness Quiz and Get Instant Clarity
          </p>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Revalidation is a critical milestone in your nursing career, but it's easy to feel uncertain about whether you have enough evidence. Our Revalidation Readiness Quiz gives you instant clarity in just 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleStartQuiz}
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg rounded-lg"
            >
              Take the Quiz Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-3 text-lg rounded-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What You'll Get
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How the Quiz Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-16 w-12 h-0.5 bg-teal-200 -ml-16" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What Nurses Are Saying
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 border border-gray-200">
                <div className="flex items-start mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <p className="text-gray-900 font-semibold">— {testimonial.author}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <div className="p-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                  <span className="text-teal-600 font-bold text-xl">
                    {expandedFaq === index ? "−" : "+"}
                  </span>
                </div>
                {expandedFaq === index && (
                  <div className="px-6 pb-6 border-t border-gray-200">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Nurses Trust RevalPro
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              "Used by 1000+ nursing professionals",
              "Expert-designed assessment",
              "Personalized action plans",
              "Secure data protection",
              "24/7 customer support",
              "Money-back guarantee",
            ].map((signal, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700 text-lg">{signal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Get Clarity on Your Revalidation?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Take our free quiz now and receive your personalized action plan + 10% discount code.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleStartQuiz}
              size="lg"
              className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-3 text-lg rounded-lg font-semibold"
            >
              Take the Quiz
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-teal-600 px-8 py-3 text-lg rounded-lg"
            >
              Learn About Premium
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">RevalPro</h3>
              <p className="text-sm">UK Nursing Revalidation Platform</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-white transition">Home</a></li>
                <li><a href="/quiz" className="hover:text-white transition">Quiz</a></li>
                <li><a href="/auth" className="hover:text-white transition">Sign Up</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <p className="text-sm">support@revalpro.co.uk</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 RevalPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
