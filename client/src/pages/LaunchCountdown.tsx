import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Star, Crown, Shield, ArrowRight, Sparkles, Phone, Globe, Zap, Brain, Users, FileText, Calendar, Bell, BarChart3, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
const logoPath = '/revalpro-logo-full.png';
import appScreen1 from '@assets/Screenshot_20250705_215518_Replit_1751748943729.jpg';
import appScreen2 from '@assets/Screenshot_20250712_095525_Edge_1752310537081.jpg';
import appScreen3 from '@assets/Screenshot_20250711_213746_Replit_1752266285311.jpg';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  // Launch date: Friday, August 1st, 2025 at 6:00 AM GMT
  const launchDate = new Date('2025-08-01T06:00:00.000Z');

  useEffect(() => {
    setIsClient(true);
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const launch = launchDate.getTime();
      const difference = launch - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  const features = [
    {
      icon: Clock,
      title: "Practice Hours Tracking",
      description: "Effortlessly log and categorize your 450 practice hours with intelligent work setting classification."
    },
    {
      icon: FileText,
      title: "CPD Activity Management",
      description: "Track your 35 hours of CPD with automatic participatory/non-participatory distinction."
    },
    {
      icon: Users,
      title: "Feedback Collection",
      description: "Organize and store feedback from patients and colleagues in one secure location."
    },
    {
      icon: Brain,
      title: "AI-Powered Reflections",
      description: "Create structured reflective accounts using Gibbs, Johns, and other proven models with AI assistance."
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Never miss a deadline with intelligent notifications tailored to your revalidation schedule."
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Visual dashboards showing exactly what you've completed and what remains for your revalidation."
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Your data stays on your device. Generate NMC-compliant documentation when you're ready."
    },
    {
      icon: Download,
      title: "Professional Export",
      description: "Generate official NMC-formatted documents and infographic summaries for submission."
    }
  ];

  const testimonials = [
    {
      quote: "RevalPro saved me weeks of stress and organization.",
      author: "Sarah",
      role: "ICU Nurse"
    },
    {
      quote: "I can finally track my CPD as I go instead of scrambling at the last minute.",
      author: "James",
      role: "Community Nurse"
    },
    {
      quote: "The AI guidance is like having an NMC expert on call.",
      author: "Priya",
      role: "Midwife"
    }
  ];

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Globe,
      description: 'Essential tools for NMC revalidation',
      monthlyPrice: 0,
      annualPrice: 0,
      savings: 0,
      features: [
        'Track practice hours',
        'Basic CPD logging',
        'Up to 3 reflective accounts',
        'Basic PDF export',
        'NMC revalidation guidance',
        'Local data storage'
      ],
      limitations: [
        'No AI-assisted reflection templates',
        'No unlimited reflective accounts',
        'No advanced PDF templates',
        'No reminders or notifications'
      ]
    },
    {
      id: 'standard',
      name: 'Standard',
      icon: Star,
      description: 'Everything you need for a smooth revalidation',
      monthlyPrice: 4.99,
      annualPrice: 49.99,
      savings: 9.89,
      mostPopular: true,
      features: [
        'All Free features',
        'Unlimited reflective accounts',
        'AI-assisted reflection templates',
        'Full PDF export suite',
        'Feedback collection tools',
        'Infographic summary generator',
        'Smart revalidation reminders',
        'Weekly progress notifications',
        'CPD activity reminders',
        'Browser notification alerts'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Crown,
      description: 'The ultimate revalidation companion',
      monthlyPrice: 9.99,
      annualPrice: 89.99,
      savings: 29.89,
      recommended: true,
      features: [
        'All Standard features',
        'Advanced AI revalidation assistant',
        'Advanced PDF export templates',
        'Feedback collection & analysis',
        'AI-powered adaptive reminder scheduling',
        'Personalized notifications by specialty',
        'Advanced deadline tracking',
        'Smart reflection writing prompts',
        'Progress analytics & completion alerts',
        'Rich browser notifications with actions'
      ]
    }
  ];

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `£${price.toFixed(2)}`;
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-purple-50">
      {/* Hero Section with Countdown */}
      <section className="relative overflow-hidden bg-gradient-to-br from-hsl(var(--revalpro-dark-blue)) via-hsl(var(--revalpro-blue)) to-hsl(var(--revalpro-teal)) text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-6 py-20 text-center">
          <div className="mb-8">
            <img 
              src={logoPath} 
              alt="RevalPro Logo" 
              className="h-24 mx-auto mb-6"
            />
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              RevalPro
            </h1>
            <p className="text-2xl md:text-3xl mb-2 font-light">
              Your Revalidation, Revolutionized
            </p>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              The complete NMC revalidation companion for UK nurses and midwives
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-8">
              <Sparkles className="inline-block w-8 h-8 mr-3 text-yellow-300" />
              Launching Friday, August 1st at 6:00 AM
              <Sparkles className="inline-block w-8 h-8 ml-3 text-yellow-300" />
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds }
              ].map((item, index) => (
                <div key={index} className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                  <div className="text-4xl md:text-6xl font-bold text-white mb-2">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm md:text-base text-white/80 uppercase tracking-wide">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" className="bg-white text-hsl(var(--revalpro-dark-blue)) hover:bg-revalpro-blue/10 font-semibold px-8 py-4 text-lg">
              <Bell className="w-5 h-5 mr-2" />
              Get Notified at Launch
            </Button>
            <p className="text-white/90 text-lg">
              Visit us at <span className="font-semibold">www.revalpro.co.uk</span>
            </p>
          </div>
        </div>
      </section>

      {/* App Screenshots Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              See RevalPro in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get a preview of the intuitive interface that will transform your revalidation experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-gradient-to-br from-revalpro-blue to-revalpro-purple p-2 rounded-2xl mb-4 transform rotate-1 hover:rotate-0 transition-transform">
                <img 
                  src={appScreen1} 
                  alt="Practice Hours Tracking Interface"
                  className="w-full rounded-xl shadow-xl"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Smart Practice Hours</h3>
              <p className="text-gray-600">Effortlessly track and categorize your professional practice</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500 to-teal-600 p-2 rounded-2xl mb-4 transform -rotate-1 hover:rotate-0 transition-transform">
                <img 
                  src={appScreen2} 
                  alt="Dashboard Overview"
                  className="w-full rounded-xl shadow-xl"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Progress Dashboard</h3>
              <p className="text-gray-600">Visual insights into your revalidation journey</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-500 to-pink-600 p-2 rounded-2xl mb-4 transform rotate-1 hover:rotate-0 transition-transform">
                <img 
                  src={appScreen3} 
                  alt="AI Assistant Features"
                  className="w-full rounded-xl shadow-xl"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">AI-Powered Assistance</h3>
              <p className="text-gray-600">Get personalized guidance throughout your revalidation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Everything You Need for NMC Revalidation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              RevalPro streamlines every aspect of your professional registration renewal
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-xl transition-shadow border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-hsl(var(--revalpro-blue)) to-hsl(var(--revalpro-teal)) rounded-lg flex items-center justify-center mb-4">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What Nurses Are Saying
            </h2>
            <p className="text-xl text-gray-600">
              Healthcare professionals across the UK are already discovering the difference
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 text-center bg-gradient-to-br from-blue-50 to-purple-50 border-0">
                <CardContent className="p-0">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-hsl(var(--revalpro-blue)) to-hsl(var(--revalpro-purple)) rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <blockquote className="text-lg text-gray-900 font-medium mb-4">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="text-gray-600">
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Choose Your Revalidation Plan
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Flexible pricing options designed for every healthcare professional's needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon;
              const isPopular = plan.mostPopular;
              const isRecommended = plan.recommended;
              
              return (
                <div key={plan.id} className="relative">
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  {isRecommended && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2">
                        Recommended
                      </Badge>
                    </div>
                  )}
                  
                  <Card className={`p-8 h-full ${
                    isPopular ? 'ring-2 ring-orange-500 bg-gradient-to-br from-orange-50 to-pink-50' :
                    isRecommended ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-50 to-blue-50' :
                    'bg-white'
                  } text-gray-900`}>
                    <CardContent className="p-0">
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-hsl(var(--revalpro-blue)) to-hsl(var(--revalpro-purple)) rounded-full flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <p className="text-gray-600 mb-6">{plan.description}</p>
                        
                        <div className="mb-6">
                          <div className="text-4xl font-bold mb-2">
                            {formatPrice(plan.monthlyPrice)}
                            {plan.monthlyPrice > 0 && <span className="text-lg text-gray-500">/month</span>}
                          </div>
                          {plan.annualPrice > 0 && (
                            <div className="text-sm text-gray-600">
                              or {formatPrice(plan.annualPrice)}/year
                              <div className="text-green-600 font-medium">
                                Save £{plan.savings.toFixed(2)} annually 
                                ({Math.round((plan.monthlyPrice * 12 - plan.annualPrice) / plan.monthlyPrice)} months free!)
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                        {plan.limitations && plan.limitations.map((limitation, limitIndex) => (
                          <li key={`limit-${limitIndex}`} className="flex items-center text-sm text-gray-400">
                            <div className="w-4 h-4 mr-3 flex-shrink-0 rounded-full border border-gray-300"></div>
                            {limitation}
                          </li>
                        ))}
                      </ul>

                      <Button 
                        className={`w-full ${
                          isPopular ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600' :
                          isRecommended ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600' :
                          'bg-gradient-to-r from-hsl(var(--revalpro-blue)) to-hsl(var(--revalpro-teal)) hover:from-blue-600 hover:to-teal-600'
                        } text-white`}
                        size="lg"
                      >
                        {plan.monthlyPrice === 0 ? 'Get Started Free' : 'Choose Plan'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-300 mb-4">
              All plans include secure local data storage and NMC-compliant document generation
            </p>
            <p className="text-sm text-gray-400">
              Prices shown in GBP. Cancel anytime. No hidden fees.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-hsl(var(--revalpro-dark-blue)) via-hsl(var(--revalpro-blue)) to-hsl(var(--revalpro-teal)) text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <img 
              src={logoPath} 
              alt="RevalPro Logo" 
              className="h-16 mx-auto mb-8"
            />
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Revalidation?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of UK healthcare professionals who are simplifying their NMC revalidation journey
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button size="lg" className="bg-white text-hsl(var(--revalpro-dark-blue)) hover:bg-revalpro-blue/10 font-semibold px-8 py-4 text-lg">
                <Globe className="w-5 h-5 mr-2" />
                Visit www.revalpro.co.uk
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-hsl(var(--revalpro-dark-blue)) font-semibold px-8 py-4 text-lg">
                <Download className="w-5 h-5 mr-2" />
                Download the App
              </Button>
            </div>

            <div className="text-center">
              <p className="text-white/80 mb-2">Available on iOS, Android, and Web</p>
              <p className="text-lg font-medium">
                <Sparkles className="inline-block w-5 h-5 mr-2 text-yellow-300" />
                Launching Friday, August 1st at 6:00 AM GMT
                <Sparkles className="inline-block w-5 h-5 ml-2 text-yellow-300" />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img 
                src={logoPath} 
                alt="RevalPro Logo" 
                className="h-12 mb-4"
              />
              <p className="text-gray-400 text-sm">
                Your revalidation, revolutionized. The complete NMC revalidation companion for UK nurses and midwives.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Security</li>
                <li>Compliance</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Help Center</li>
                <li>NMC Guidance</li>
                <li>Contact Us</li>
                <li>System Status</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>GDPR Compliance</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 RevalPro. All rights reserved. Not affiliated with the Nursing and Midwifery Council.
              All information stored complies with UK GDPR regulations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
