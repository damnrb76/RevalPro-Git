import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Heart, 
  FileCheck, 
  CalendarDays,
  BarChart3,
  LayoutDashboard,
  Settings,
  Bot,
  ArrowUpRight
} from "lucide-react";
import { userProfileStorage } from "@/lib/storage";

export default function DashboardPage() {
  const [_, setLocation] = useLocation();
  
  // Fetch user profile
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      return userProfileStorage.getCurrent();
    },
  });
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Calculate days until expiry
  const getDaysUntilExpiry = () => {
    if (!userProfile?.expiryDate) return null;
    
    const today = new Date();
    const expiryDate = new Date(userProfile.expiryDate);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const daysUntilExpiry = getDaysUntilExpiry();
  
  // Define the navigation cards with their details
  const navCards = [
    {
      title: "Practice Hours",
      description: "Log and track your nursing practice hours",
      icon: <Clock className="h-10 w-10 text-blue-500" />,
      color: "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-200",
      link: "/practice-hours"
    },
    {
      title: "CPD Records",
      description: "Record your continuing professional development",
      icon: <BookOpen className="h-10 w-10 text-emerald-500" />,
      color: "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-200",
      link: "/cpd"
    },
    {
      title: "Reflective Accounts",
      description: "Create and manage reflective practice accounts",
      icon: <FileText className="h-10 w-10 text-purple-500" />,
      color: "bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-200",
      link: "/reflections"
    },
    {
      title: "Feedback",
      description: "Collect and organize feedback for revalidation",
      icon: <MessageSquare className="h-10 w-10 text-pink-500" />,
      color: "bg-gradient-to-br from-pink-500/20 to-pink-600/10 border-pink-200",
      link: "/feedback"
    },
    {
      title: "Health Declaration",
      description: "Complete your health and character declaration",
      icon: <Heart className="h-10 w-10 text-red-500" />,
      color: "bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-200",
      link: "/declarations"
    },
    {
      title: "Confirmation",
      description: "Manage your confirmer details and confirmation",
      icon: <FileCheck className="h-10 w-10 text-amber-500" />,
      color: "bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-200",
      link: "/declarations?tab=confirmation"
    },
    {
      title: "Revalidation Dates",
      description: "View and track important revalidation deadlines",
      icon: <CalendarDays className="h-10 w-10 text-teal-500" />,
      color: "bg-gradient-to-br from-teal-500/20 to-teal-600/10 border-teal-200",
      link: "/revalidation-dates"
    },
    {
      title: "Summary & Export",
      description: "Generate infographics and export your records",
      icon: <BarChart3 className="h-10 w-10 text-indigo-500" />,
      color: "bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border-indigo-200",
      link: "/summary-infographic"
    },
    {
      title: "AI Assistant",
      description: "Get guidance with our AI revalidation assistant",
      icon: <Bot className="h-10 w-10 text-blue-600" />,
      color: "bg-gradient-to-br from-blue-600/20 to-indigo-500/10 border-blue-300",
      link: "/ai-assistant"
    },
    {
      title: "Settings",
      description: "Manage your profile and application settings",
      icon: <Settings className="h-10 w-10 text-gray-600" />,
      color: "bg-gradient-to-br from-gray-300/20 to-gray-400/10 border-gray-300",
      link: "/settings"
    }
  ];
  
  // Define card animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          Welcome to <span className="bg-gradient-to-r from-revalpro-blue to-revalpro-teal bg-clip-text text-transparent">RevalPro</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mt-2"
        >
          Your nursing revalidation management dashboard
        </motion.p>
      </div>
      
      {/* Registration status card */}
      {userProfile && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  {userProfile.profileImage ? (
                    <div className="rounded-full w-16 h-16 overflow-hidden border-2 border-revalpro-blue shadow-sm">
                      <img 
                        src={userProfile.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="bg-white p-4 rounded-full shadow-sm">
                      <LayoutDashboard className="h-10 w-10 text-revalpro-blue" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold">{userProfile.name}</h2>
                    <p className="text-gray-600">
                      {userProfile.registrationNumber}
                      {userProfile.jobTitle && <span> • {userProfile.jobTitle}</span>}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center md:items-end">
                  <div className="flex flex-wrap items-center gap-2 justify-center md:justify-end">
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                      Active Registration
                    </Badge>
                    <Badge className="bg-blue-500">
                      {daysUntilExpiry !== null 
                        ? `${daysUntilExpiry} days until renewal` 
                        : "Renewal date not set"}
                    </Badge>
                    {/* Subscription Badge */}
                    <Badge 
                      className={`
                        ${userProfile?.currentPlan === 'premium' 
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold' 
                          : userProfile?.currentPlan === 'standard'
                            ? 'bg-gradient-to-r from-indigo-400 to-indigo-600' 
                            : 'bg-gradient-to-r from-gray-400 to-gray-600'
                        } 
                        shadow-sm border-0 px-3 flex gap-1 items-center
                      `}
                    >
                      {userProfile?.currentPlan === 'premium' && <span className="text-xs">⭐</span>}
                      {userProfile?.currentPlan === 'premium' 
                        ? 'Premium Plan' 
                        : userProfile?.currentPlan === 'standard'
                          ? 'Standard Plan' 
                          : 'Free Plan'
                      }
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Expiry: {userProfile.expiryDate 
                      ? new Date(userProfile.expiryDate).toLocaleDateString() 
                      : "Not set"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Navigation cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {navCards.map((card, index) => (
          <motion.div key={index} variants={item}>
            <Link href={card.link}>
              <Card className={`cursor-pointer h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${card.color}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    {card.icon}
                    <ArrowUpRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <CardTitle className="text-xl mt-2">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}