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
// Import the logo
import logo from "@assets/Leonardo_Phoenix_10_design_a_vibrant_and_professional_logo_for_3.jpg";

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
              <Progress value={overallProgress} max={100} className="h-3" />
              
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

      {/* Hexagonal Honeycomb Dashboard */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-revalpro-blue to-revalpro-teal bg-clip-text text-transparent">
            Revalidation Progress Hub
          </span>
        </h2>
        
        <motion.div 
          className="flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="relative max-w-5xl mx-auto">
            {/* Hexagonal arrangement with Feedback in center */}
            <div className="relative">
              {/* Top row - Practice Hours and CPD */}
              <div className="flex justify-center gap-8 mb-4">
                {revalidationElements.filter(el => el.key === 'practiceHours' || el.key === 'cpdRecords').map((element, index) => {
                  const getProgressColor = (percentage: number) => {
                    if (percentage === 100) return '#0ea5e9';
                    if (percentage >= 81) return '#10b981';
                    if (percentage >= 51) return '#eab308';
                    if (percentage >= 21) return '#f97316';
                    return '#ef4444';
                  };

                  const progressColor = getProgressColor(element.data.percentage);
                  
                  return (
                    <motion.div
                      key={element.key}
                      className="flex justify-center"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    >
                      <Link href={element.link}>
                        <div className="relative cursor-pointer group">
                          <svg width="160" height="138" viewBox="0 0 160 138" className="drop-shadow-lg">
                            <defs>
                              <linearGradient id={`hexGradient-${element.key}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                                <stop offset={`${Math.max(20, element.data.percentage)}%`} stopColor={progressColor} stopOpacity="0.7" />
                                <stop offset="100%" stopColor={progressColor} stopOpacity="0.9" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M40 0 L120 0 L160 69.3 L120 138.6 L40 138.6 L0 69.3 Z"
                              fill={`url(#hexGradient-${element.key})`}
                              stroke="white"
                              strokeWidth="3"
                              className="transition-all duration-300 group-hover:brightness-110"
                            />
                          </svg>
                          
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <div style={{ color: progressColor }} className="mb-2">
                              {element.icon}
                            </div>
                            <div className="text-sm font-semibold text-center leading-tight mb-1">
                              {element.title}
                            </div>
                            <div className="text-xl font-bold mb-1" style={{ color: progressColor }}>
                              {element.data.percentage}%
                            </div>
                            <div className="text-xs text-gray-600">
                              {element.data.current}/{element.data.required}
                            </div>
                          </div>
                          
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg width="160" height="138" viewBox="0 0 160 138">
                              <path
                                d="M40 0 L120 0 L160 69.3 L120 138.6 L40 138.6 L0 69.3 Z"
                                fill="none"
                                stroke={progressColor}
                                strokeWidth="2"
                                className="animate-pulse"
                              />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Middle row - Feedback (center) with Reflections and Declarations on sides */}
              <div className="flex justify-center items-center gap-8">
                {/* Reflections */}
                {revalidationElements.filter(el => el.key === 'reflections').map((element) => {
                  const getProgressColor = (percentage: number) => {
                    if (percentage === 100) return '#0ea5e9';
                    if (percentage >= 81) return '#10b981';
                    if (percentage >= 51) return '#eab308';
                    if (percentage >= 21) return '#f97316';
                    return '#ef4444';
                  };

                  const progressColor = getProgressColor(element.data.percentage);
                  
                  return (
                    <motion.div
                      key={element.key}
                      className="flex justify-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    >
                      <Link href={element.link}>
                        <div className="relative cursor-pointer group">
                          <svg width="160" height="138" viewBox="0 0 160 138" className="drop-shadow-lg">
                            <defs>
                              <linearGradient id={`hexGradient-${element.key}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                                <stop offset={`${Math.max(20, element.data.percentage)}%`} stopColor={progressColor} stopOpacity="0.7" />
                                <stop offset="100%" stopColor={progressColor} stopOpacity="0.9" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M40 0 L120 0 L160 69.3 L120 138.6 L40 138.6 L0 69.3 Z"
                              fill={`url(#hexGradient-${element.key})`}
                              stroke="white"
                              strokeWidth="3"
                              className="transition-all duration-300 group-hover:brightness-110"
                            />
                          </svg>
                          
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <div style={{ color: progressColor }} className="mb-2">
                              {element.icon}
                            </div>
                            <div className="text-sm font-semibold text-center leading-tight mb-1">
                              {element.title}
                            </div>
                            <div className="text-xl font-bold mb-1" style={{ color: progressColor }}>
                              {element.data.percentage}%
                            </div>
                            <div className="text-xs text-gray-600">
                              {element.data.current}/{element.data.required}
                            </div>
                          </div>
                          
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg width="160" height="138" viewBox="0 0 160 138">
                              <path
                                d="M40 0 L120 0 L160 69.3 L120 138.6 L40 138.6 L0 69.3 Z"
                                fill="none"
                                stroke={progressColor}
                                strokeWidth="2"
                                className="animate-pulse"
                              />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Feedback (center) */}
                {revalidationElements.filter(el => el.key === 'feedback').map((element) => {
                  const getProgressColor = (percentage: number) => {
                    if (percentage === 100) return '#0ea5e9';
                    if (percentage >= 81) return '#10b981';
                    if (percentage >= 51) return '#eab308';
                    if (percentage >= 21) return '#f97316';
                    return '#ef4444';
                  };

                  const progressColor = getProgressColor(element.data.percentage);
                  
                  return (
                    <motion.div
                      key={element.key}
                      className="flex justify-center"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.0, duration: 0.5 }}
                    >
                      <Link href={element.link}>
                        <div className="relative cursor-pointer group">
                          <svg width="180" height="155" viewBox="0 0 180 155" className="drop-shadow-xl">
                            <defs>
                              <linearGradient id={`hexGradient-${element.key}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                                <stop offset={`${Math.max(20, element.data.percentage)}%`} stopColor={progressColor} stopOpacity="0.7" />
                                <stop offset="100%" stopColor={progressColor} stopOpacity="0.9" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M45 0 L135 0 L180 77.5 L135 155 L45 155 L0 77.5 Z"
                              fill={`url(#hexGradient-${element.key})`}
                              stroke="white"
                              strokeWidth="4"
                              className="transition-all duration-300 group-hover:brightness-110"
                            />
                          </svg>
                          
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <div style={{ color: progressColor }} className="mb-2 text-lg">
                              {element.icon}
                            </div>
                            <div className="text-base font-semibold text-center leading-tight mb-1">
                              {element.title}
                            </div>
                            <div className="text-2xl font-bold mb-1" style={{ color: progressColor }}>
                              {element.data.percentage}%
                            </div>
                            <div className="text-sm text-gray-600">
                              {element.data.current}/{element.data.required}
                            </div>
                          </div>
                          
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg width="180" height="155" viewBox="0 0 180 155">
                              <path
                                d="M45 0 L135 0 L180 77.5 L135 155 L45 155 L0 77.5 Z"
                                fill="none"
                                stroke={progressColor}
                                strokeWidth="3"
                                className="animate-pulse"
                              />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Declarations */}
                {revalidationElements.filter(el => el.key === 'declarations').map((element) => {
                  const getProgressColor = (percentage: number) => {
                    if (percentage === 100) return '#0ea5e9';
                    if (percentage >= 81) return '#10b981';
                    if (percentage >= 51) return '#eab308';
                    if (percentage >= 21) return '#f97316';
                    return '#ef4444';
                  };

                  const progressColor = getProgressColor(element.data.percentage);
                  
                  return (
                    <motion.div
                      key={element.key}
                      className="flex justify-center"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                    >
                      <Link href={element.link}>
                        <div className="relative cursor-pointer group">
                          <svg width="160" height="138" viewBox="0 0 160 138" className="drop-shadow-lg">
                            <defs>
                              <linearGradient id={`hexGradient-${element.key}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                                <stop offset={`${Math.max(20, element.data.percentage)}%`} stopColor={progressColor} stopOpacity="0.7" />
                                <stop offset="100%" stopColor={progressColor} stopOpacity="0.9" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M40 0 L120 0 L160 69.3 L120 138.6 L40 138.6 L0 69.3 Z"
                              fill={`url(#hexGradient-${element.key})`}
                              stroke="white"
                              strokeWidth="3"
                              className="transition-all duration-300 group-hover:brightness-110"
                            />
                          </svg>
                          
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <div style={{ color: progressColor }} className="mb-2">
                              {element.icon}
                            </div>
                            <div className="text-sm font-semibold text-center leading-tight mb-1">
                              {element.title}
                            </div>
                            <div className="text-xl font-bold mb-1" style={{ color: progressColor }}>
                              {element.data.percentage}%
                            </div>
                            <div className="text-xs text-gray-600">
                              {element.data.current}/{element.data.required}
                            </div>
                          </div>
                          
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg width="160" height="138" viewBox="0 0 160 138">
                              <path
                                d="M40 0 L120 0 L160 69.3 L120 138.6 L40 138.6 L0 69.3 Z"
                                fill="none"
                                stroke={progressColor}
                                strokeWidth="2"
                                className="animate-pulse"
                              />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Legend */}
        <motion.div 
          className="mt-8 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-sm text-blue-700">Complete (100%)</span>
          </div>
          <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm text-green-700">Excellent (81%+)</span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-yellow-700">Good (51-80%)</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span className="text-sm text-orange-700">In Progress (21-50%)</span>
          </div>
          <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm text-red-700">Needs Attention (0-20%)</span>
          </div>
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