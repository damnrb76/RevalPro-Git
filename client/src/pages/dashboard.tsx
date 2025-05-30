import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
  XCircle,
  ListChecks
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

  // Mock data for demonstration - replace with actual data queries
  const getRevalidationProgress = () => {
    return {
      practiceHours: {
        current: 900,
        required: 1500,
        percentage: Math.round((900 / 1500) * 100),
        status: 'in-progress'
      },
      cpdRecords: {
        current: 25,
        required: 35,
        percentage: Math.round((25 / 35) * 100),
        status: 'in-progress'
      },
      feedback: {
        current: 3,
        required: 5,
        percentage: Math.round((3 / 5) * 100),
        status: 'in-progress'
      },
      reflections: {
        current: 4,
        required: 5,
        percentage: Math.round((4 / 5) * 100),
        status: 'in-progress'
      },
      declarations: {
        current: 1,
        required: 1,
        percentage: 100,
        status: 'complete'
      }
    };
  };

  const progressData = getRevalidationProgress();

  // Calculate overall completion percentage
  const getOverallProgress = () => {
    const elements = Object.values(progressData);
    const totalPercentage = elements.reduce((sum, element) => sum + element.percentage, 0);
    return Math.round(totalPercentage / elements.length);
  };

  const overallProgress = getOverallProgress();

  // Get status icon and color
  const getStatusInfo = (status: string, percentage: number) => {
    if (percentage === 100) {
      return { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    } else if (percentage >= 70) {
      return { icon: AlertCircle, color: 'text-amber-500', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' };
    } else {
      return { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
    }
  };
  
  // Define the revalidation elements with progress tracking
  const revalidationElements = [
    {
      key: 'practiceHours',
      title: "Practice Hours",
      description: "Log and track your nursing practice hours",
      icon: <Clock className="h-8 w-8" />,
      color: "from-revalpro-green/20 to-revalpro-green/10",
      borderColor: "border-revalpro-green/30",
      link: "/practice-hours",
      data: progressData.practiceHours
    },
    {
      key: 'cpdRecords',
      title: "CPD Records",
      description: "Record your continuing professional development",
      icon: <BookOpen className="h-8 w-8" />,
      color: "from-revalpro-teal/20 to-revalpro-teal/10",
      borderColor: "border-revalpro-teal/30",
      link: "/cpd",
      data: progressData.cpdRecords
    },
    {
      key: 'feedback',
      title: "Feedback",
      description: "Collect and organize feedback for revalidation",
      icon: <MessageSquare className="h-8 w-8" />,
      color: "from-revalpro-purple/20 to-revalpro-purple/10",
      borderColor: "border-revalpro-purple/30",
      link: "/feedback",
      data: progressData.feedback
    },
    {
      key: 'reflections',
      title: "Reflections",
      description: "Create and manage reflective practice accounts",
      icon: <FileText className="h-8 w-8" />,
      color: "from-revalpro-orange/20 to-revalpro-orange/10",
      borderColor: "border-revalpro-orange/30",
      link: "/reflections",
      data: progressData.reflections
    },
    {
      key: 'declarations',
      title: "Declarations",
      description: "Complete your health and character declaration",
      icon: <Heart className="h-8 w-8" />,
      color: "from-revalpro-pink/20 to-revalpro-pink/10",
      borderColor: "border-revalpro-pink/30",
      link: "/declarations",
      data: progressData.declarations
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
      
      {/* Overall Progress Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-6 w-6 text-revalpro-blue" />
              Revalidation Progress Overview
            </CardTitle>
            <CardDescription>
              Your current progress across all revalidation requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Overall Completion</span>
                <span className="text-2xl font-bold text-revalpro-blue">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
              
              {userProfile && (
                <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    {userProfile.profileImage ? (
                      <div className="rounded-full w-12 h-12 overflow-hidden border-2 border-revalpro-blue shadow-sm">
                        <img 
                          src={userProfile.profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="bg-white p-3 rounded-full shadow-sm">
                        <LayoutDashboard className="h-6 w-6 text-revalpro-blue" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold">{userProfile.name}</h3>
                      <p className="text-sm text-gray-600">
                        {userProfile.registrationNumber}
                        {userProfile.jobTitle && <span> • {userProfile.jobTitle}</span>}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Active Registration
                    </Badge>
                    <Badge className="bg-blue-500">
                      {daysUntilExpiry !== null 
                        ? `${daysUntilExpiry} days until renewal` 
                        : "Renewal date not set"}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Revalidation Elements with Progress */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          <span className="bg-gradient-to-r from-revalpro-blue to-revalpro-teal bg-clip-text text-transparent">
            Revalidation Elements
          </span>
        </h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {revalidationElements.map((element, index) => {
            const statusInfo = getStatusInfo(element.data.status, element.data.percentage);
            const StatusIcon = statusInfo.icon;
            
            return (
              <motion.div key={element.key} variants={item}>
                <Link href={element.link}>
                  <Card className={`cursor-pointer h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-gradient-to-br ${element.color} ${element.borderColor} border-2`}>
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div className={`p-3 rounded-lg ${statusInfo.bgColor} ${statusInfo.borderColor} border`}>
                          <div className={statusInfo.color}>
                            {element.icon}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
                          <span className={`text-sm font-semibold ${statusInfo.color}`}>
                            {element.data.percentage}%
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-lg mt-3">{element.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-gray-600">
                        {element.description}
                      </CardDescription>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">
                            {element.data.current} / {element.data.required}
                          </span>
                        </div>
                        <Progress 
                          value={element.data.percentage} 
                          className="h-2"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <Badge 
                          variant={element.data.percentage === 100 ? "default" : "secondary"}
                          className={element.data.percentage === 100 ? "bg-green-500" : ""}
                        >
                          {element.data.percentage === 100 ? "Complete" : "In Progress"}
                        </Badge>
                        <ArrowUpRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <Link href="/ai-assistant">
              <Card className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md bg-gradient-to-br from-blue-500/20 to-purple-500/10 border-blue-200">
                <CardContent className="p-4 text-center">
                  <Bot className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold">AI Assistant</h4>
                  <p className="text-xs text-gray-600 mt-1">Get revalidation guidance</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
          
          <motion.div variants={item}>
            <Link href="/summary-infographic">
              <Card className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md bg-gradient-to-br from-orange-500/20 to-red-500/10 border-orange-200">
                <CardContent className="p-4 text-center">
                  <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h4 className="font-semibold">Export Summary</h4>
                  <p className="text-xs text-gray-600 mt-1">Generate progress report</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
          
          <motion.div variants={item}>
            <Link href="/revalidation-dates">
              <Card className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md bg-gradient-to-br from-teal-500/20 to-green-500/10 border-teal-200">
                <CardContent className="p-4 text-center">
                  <CalendarDays className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                  <h4 className="font-semibold">Important Dates</h4>
                  <p className="text-xs text-gray-600 mt-1">View key deadlines</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
          
          <motion.div variants={item}>
            <Link href="/settings">
              <Card className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md bg-gradient-to-br from-gray-400/20 to-gray-500/10 border-gray-300">
                <CardContent className="p-4 text-center">
                  <Settings className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <h4 className="font-semibold">Settings</h4>
                  <p className="text-xs text-gray-600 mt-1">Manage your profile</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}