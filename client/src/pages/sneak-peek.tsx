import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Download, 
  BarChart3, 
  Clock, 
  BookOpen, 
  MessageSquare, 
  FileText,
  Calendar,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Import app screenshots
import practiceHoursImg from "@assets/Screenshot_20250512_165421_Replit.jpg";
import cpdRecordsImg from "@assets/Screenshot_20250512_182025_Replit.jpg";
import reflectionImg from "@assets/Screenshot_20250512_213835_Replit.jpg";
import dashboardImg from "@assets/Screenshot_20250516_003058_Samsung Internet.jpg";
import logo from "@assets/Leonardo_Phoenix_10_design_a_vibrant_and_professional_logo_for_3.jpg";

interface FeatureCardProps {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  color: string;
  index: number;
}

function FeatureCard({ title, description, image, icon, color, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="w-full"
    >
      <Card className="border-2 h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-blue-300">
        <CardHeader className={`p-4 ${color}`}>
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="bg-white/90 text-gray-800 font-medium">
              {title}
            </Badge>
            <div className="bg-white p-2 rounded-full">
              {icon}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-grow">
          <img
            src={image}
            alt={title}
            className="w-full h-64 object-cover object-top group-hover:object-center transition-all duration-1000 ease-in-out"
          />
        </CardContent>
        <CardFooter className="p-4 bg-white">
          <p className="text-sm text-gray-600">{description}</p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default function SneakPeekPage() {
  const features = [
    {
      title: "Dashboard Overview",
      description: "Track your revalidation progress with visual indicators and notifications for upcoming deadlines.",
      image: dashboardImg,
      icon: <BarChart3 className="h-5 w-5 text-blue-600" />,
      color: "bg-gradient-to-r from-blue-50 to-blue-100",
    },
    {
      title: "Practice Hours Tracker",
      description: "Easily record and categorize your nursing practice hours with our intuitive interface.",
      image: practiceHoursImg,
      icon: <Clock className="h-5 w-5 text-teal-600" />,
      color: "bg-gradient-to-r from-teal-50 to-teal-100",
    },
    {
      title: "CPD Activities",
      description: "Log your continuing professional development activities and mark participatory learning.",
      image: cpdRecordsImg,
      icon: <BookOpen className="h-5 w-5 text-emerald-600" />,
      color: "bg-gradient-to-r from-emerald-50 to-emerald-100",
    },
    {
      title: "Reflective Accounts",
      description: "Create reflective accounts using popular models like Gibbs, tied to The Code sections.",
      image: reflectionImg,
      icon: <FileText className="h-5 w-5 text-purple-600" />,
      color: "bg-gradient-to-r from-purple-50 to-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 pb-12">
      <header className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <img
                src={logo}
                alt="RevalPro Logo"
                className="h-14 w-auto"
              />
            </div>
          </Link>
          
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-revalpro-blue to-revalpro-teal bg-clip-text text-transparent">
              Sneak Peek at RevalPro
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Get a glimpse of our intuitive interface and powerful features designed specifically for UK nurses to
            streamline the NMC revalidation process.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mb-12"
        >
          <Carousel className="w-full">
            <CarouselContent>
              {features.map((feature, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-2">
                  <FeatureCard 
                    title={feature.title}
                    description={feature.description}
                    image={feature.image}
                    icon={feature.icon}
                    color={feature.color}
                    index={index}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4 gap-2">
              <CarouselPrevious className="relative static transform-none" />
              <CarouselNext className="relative static transform-none" />
            </div>
          </Carousel>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">See it in action:</h2>
            <p className="mb-6 text-gray-600">
              Want to explore more features without creating an account? Check out our interactive preview:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/summary-infographic">
                <Button className="w-full bg-gradient-to-r from-revalpro-blue to-revalpro-teal hover:from-revalpro-blue/90 hover:to-revalpro-teal/90 text-white gap-2">
                  <BarChart3 size={16} />
                  <span>Try Infographic Generator</span>
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="outline" className="w-full border-revalpro-blue text-revalpro-blue hover:bg-revalpro-blue/10 gap-2">
                  <Download size={16} />
                  <span>Create Free Account</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-2xl font-bold mb-6 text-gray-800"
          >
            Key Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="bg-revalpro-purple/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-revalpro-purple h-6 w-6" />
              </div>
              <h3 className="font-bold mb-2 text-gray-800">Feedback Collection</h3>
              <p className="text-gray-600 text-sm">
                Easily gather and organize feedback from patients, colleagues, and supervisors with our templates.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="bg-revalpro-orange/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-revalpro-orange h-6 w-6" />
              </div>
              <h3 className="font-bold mb-2 text-gray-800">Revalidation Dates</h3>
              <p className="text-gray-600 text-sm">
                Automated notifications and reminders keep you on track to meet all your NMC deadlines.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="bg-revalpro-red/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Heart className="text-revalpro-red h-6 w-6" />
              </div>
              <h3 className="font-bold mb-2 text-gray-800">NMC PIN Verification</h3>
              <p className="text-gray-600 text-sm">
                Check your NMC registration status and get updates on expiration dates directly in the app.
              </p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}