import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Check, Shield, Clock, Award, BookOpen, Users, MessageSquare, X, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import logo from "@assets/Leonardo_Phoenix_10_design_a_vibrant_and_professional_logo_for_3.jpg";
import dashboardScreenshot from "@assets/Screenshot_20250512_165421_Replit.jpg";
import cpdFormScreenshot from "@assets/Screenshot_20250512_182025_Replit.jpg";
import reportsScreenshot from "@assets/Screenshot_20250512_213835_Replit.jpg";

// Demo presentation component
function AppDemoPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const slides = [
    {
      image: dashboardScreenshot,
      title: "Your Revalidation Dashboard",
      description: "Track all your revalidation requirements in one place",
      highlights: [
        "Visual progress indicators",
        "Upcoming deadlines",
        "Quick access to all sections"
      ]
    },
    {
      image: cpdFormScreenshot,
      title: "Easy CPD Recording",
      description: "Log your continuing professional development activities",
      highlights: [
        "Track participatory learning",
        "Categorize by specialty",
        "Add reflections for each activity"
      ]
    },
    {
      image: reportsScreenshot,
      title: "Comprehensive Reports",
      description: "Generate NMC-ready documentation",
      highlights: [
        "One-click PDF generation",
        "Ready for submission",
        "Share with your confirmer"
      ]
    }
  ];
  
  // Auto-advance slides
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentSlide, isAnimating]);
  
  const nextSlide = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const prevSlide = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  return (
    <div className="w-full h-full relative flex flex-col">
      {/* Slide image */}
      <div className="flex-1 overflow-hidden relative">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              currentSlide === index 
                ? "opacity-100 z-10" 
                : "opacity-0 z-0"
            }`}
          >
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-contain" 
            />
            
            {/* Content overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
              <p className="text-white/80 mb-4">{slide.description}</p>
              
              <ul className="space-y-1">
                {slide.highlights.map((highlight, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <CheckCircle2 className="h-4 w-4 text-revalpro-green mr-2" />
                    <span>{highlight}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation controls */}
      <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-white/20 hover:bg-white/40 border-0 backdrop-blur-sm"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-white/20 hover:bg-white/40 border-0 backdrop-blur-sm"
          onClick={nextSlide}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </Button>
      </div>
      
      {/* Progress indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full ${
              currentSlide === index ? "bg-white" : "bg-white/30"
            }`}
            onClick={() => {
              setIsAnimating(true);
              setCurrentSlide(index);
              setTimeout(() => setIsAnimating(false), 500);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-8 md:py-16">
        <nav className="flex justify-between items-center mb-12">
          <div className="flex items-center">
            <img 
              src={logo} 
              alt="RevalPro Logo" 
              className="h-12 w-auto mr-3" 
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-revalpro-blue to-revalpro-teal bg-clip-text text-transparent">
              RevalPro
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-revalpro-blue transition-colors">Features</a>
            <a href="#testimonials" className="text-gray-600 hover:text-revalpro-blue transition-colors">Testimonials</a>
            <a href="#pricing" className="text-gray-600 hover:text-revalpro-blue transition-colors">Pricing</a>
            <Link href="/auth">
              <Button variant="outline" className="border-revalpro-blue text-revalpro-blue hover:bg-revalpro-blue/10">
                Log In
              </Button>
            </Link>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <span className="sr-only">Menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </Button>
          </div>
        </nav>
        
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="w-full md:w-1/2 md:pr-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Simplify Your <span className="bg-gradient-to-r from-revalpro-blue to-revalpro-teal bg-clip-text text-transparent">NMC Revalidation</span> Journey
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Secure, easy to use and designed specifically for UK nurses. Track all your nursing revalidation requirements in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-revalpro-blue to-revalpro-teal hover:from-revalpro-blue/90 hover:to-revalpro-teal/90 text-white shadow-lg w-full sm:w-auto">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-100 w-full sm:w-auto"
                onClick={() => setIsVideoPlaying(true)}
              >
                Watch Demo
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            className="w-full md:w-1/2 mt-12 md:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative rounded-2xl shadow-2xl overflow-hidden border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="RevalPro Dashboard" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <p className="font-medium">Intuitive dashboard to track your revalidation progress</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Everything You Need for Revalidation
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              RevalPro streamlines your NMC revalidation process, ensuring you stay compliant with all requirements.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="h-12 w-12 text-revalpro-green" />,
                title: "Practice Hours Tracker",
                description: "Easily log and monitor your practice hours to meet the 450-hour requirement."
              },
              {
                icon: <BookOpen className="h-12 w-12 text-revalpro-teal" />,
                title: "CPD Management",
                description: "Record and categorize your 35 hours of CPD activities, including participatory learning."
              },
              {
                icon: <MessageSquare className="h-12 w-12 text-revalpro-purple" />,
                title: "Feedback Collection",
                description: "Gather and organize practice-related feedback from patients, colleagues, and managers."
              },
              {
                icon: <Shield className="h-12 w-12 text-revalpro-red" />,
                title: "Reflective Accounts",
                description: "Write and store your five reflective accounts with AI-assisted templates."
              },
              {
                icon: <Users className="h-12 w-12 text-revalpro-orange" />,
                title: "Reflective Discussion",
                description: "Document your reflective discussion with another NMC registrant."
              },
              {
                icon: <Award className="h-12 w-12 text-revalpro-blue" />,
                title: "NMC Verification",
                description: "Check your NMC registration status and important revalidation dates."
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Trusted by UK Nurses
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              See what healthcare professionals are saying about RevalPro.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "RevalPro has completely transformed how I manage my revalidation. No more spreadsheets or paper forms!",
                name: "Sarah Johnson",
                title: "Registered Nurse, NHS"
              },
              {
                quote: "The CPD tracking feature saves me so much time. I can easily categorize my learning and export it for submission.",
                name: "Michael Chen",
                title: "Nurse Practitioner"
              },
              {
                quote: "I love the reflective account templates. They help me structure my thoughts in a way that meets NMC requirements.",
                name: "Emma Williams",
                title: "Midwife, Private Practice"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl shadow-md p-6"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="mb-4 text-gray-600 italic">"{testimonial.quote}"</div>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-revalpro-blue to-revalpro-teal flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Choose the plan that works for you. All plans include secure data storage.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "£0",
                period: "forever",
                description: "Basic features for individual nurses",
                features: [
                  "Practice Hours Log",
                  "CPD Tracking (Limited)",
                  "NMC PIN Verification",
                  "Basic PDF Reports",
                  "Local Data Storage"
                ],
                ctaText: "Get Started",
                recommended: false
              },
              {
                name: "Standard",
                price: "£4.99",
                period: "per month",
                description: "Everything you need for revalidation",
                features: [
                  "All Free Features",
                  "Unlimited CPD Records",
                  "Reflective Accounts Templates",
                  "AI-Assisted Documentation",
                  "Priority Support",
                  "Enhanced PDF Reports"
                ],
                ctaText: "Subscribe Now",
                recommended: true
              },
              {
                name: "Premium",
                price: "£9.99",
                period: "per month",
                description: "Advanced features for professional nurses",
                features: [
                  "All Standard Features",
                  "Team Collaboration Tools",
                  "Portfolio Management",
                  "Advanced Analytics",
                  "Personalized Revalidation Coaching",
                  "Unlimited Document Storage"
                ],
                ctaText: "Go Premium",
                recommended: false
              }
            ].map((plan, index) => (
              <motion.div 
                key={index}
                className={`rounded-xl overflow-hidden border ${
                  plan.recommended 
                    ? "border-revalpro-teal shadow-xl scale-105" 
                    : "border-gray-200 shadow-md"
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                {plan.recommended && (
                  <div className="bg-gradient-to-r from-revalpro-blue to-revalpro-teal text-white text-center py-2 font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <hr className="my-6" />
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth">
                    <Button 
                      className={`w-full ${
                        plan.recommended 
                          ? "bg-gradient-to-r from-revalpro-blue to-revalpro-teal hover:from-revalpro-blue/90 hover:to-revalpro-teal/90 text-white" 
                          : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {plan.ctaText}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-revalpro-blue to-revalpro-teal text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Simplify Your Revalidation?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-3xl mx-auto opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join thousands of UK nurses who trust RevalPro to manage their revalidation requirements efficiently and securely.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/auth">
              <Button className="bg-white text-revalpro-blue hover:bg-gray-100 font-semibold px-8 py-6 text-lg">
                Create Your Free Account
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src={logo} 
                  alt="RevalPro Logo" 
                  className="h-10 w-auto mr-2" 
                />
                <h3 className="text-xl font-bold">RevalPro</h3>
              </div>
              <p className="text-gray-400">
                Simplifying NMC revalidation for UK nurses with secure, user-friendly tools.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Release Notes</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">support@revalpro.com</li>
                <li className="text-gray-400">+44 20 1234 5678</li>
                <li className="text-gray-400">London, United Kingdom</li>
              </ul>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} RevalPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Video Modal */}
      {/* Video Demo Modal */}
      <Dialog open={isVideoPlaying} onOpenChange={setIsVideoPlaying}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden p-0 gap-0">
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-revalpro-blue to-revalpro-teal">
            <DialogTitle className="text-white">RevalPro Demo Video</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsVideoPlaying(false)} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            <AppDemoPresentation />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}