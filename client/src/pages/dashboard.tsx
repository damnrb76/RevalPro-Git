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

      {/* Circular Revalidation Wheel */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-revalpro-blue to-revalpro-teal bg-clip-text text-transparent">
            Revalidation Progress Wheel
          </span>
        </h2>
        
        <motion.div 
          className="flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="relative w-80 h-80 md:w-96 md:h-96">
            {/* Center circle with logo and overall progress */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full shadow-lg border-4 border-revalpro-blue/20 flex flex-col items-center justify-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden mb-2 border-2 border-revalpro-blue/30">
                  <img 
                    src={logo} 
                    alt="RevalPro Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-lg md:text-xl font-bold text-revalpro-blue">
                  {overallProgress}%
                </div>
                <div className="text-xs text-gray-600 text-center px-1">
                  Complete
                </div>
              </div>
            </div>
            
            {/* Circular segments for each element */}
            {revalidationElements.map((element, index) => {
              const angle = (360 / revalidationElements.length) * index;
              const rotation = angle - 90; // Start from top
              const statusInfo = getStatusInfo(element.data.status, element.data.percentage);
              const StatusIcon = statusInfo.icon;
              
              // Calculate position for the segment label
              const labelRadius = 180; // Distance from center for labels
              const labelAngle = (angle * Math.PI) / 180;
              const labelX = Math.cos(labelAngle) * labelRadius;
              const labelY = Math.sin(labelAngle) * labelRadius;
              
              return (
                <motion.div
                  key={element.key}
                  className="absolute inset-0"
                  initial={{ opacity: 0, rotate: rotation - 20 }}
                  animate={{ opacity: 1, rotate: rotation }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                >
                  {/* Segment slice */}
                  <div className="relative w-full h-full">
                    <svg
                      className="w-full h-full absolute inset-0"
                      viewBox="0 0 400 400"
                      style={{ transform: `rotate(${rotation}deg)` }}
                    >
                      <defs>
                        <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" className={element.color.includes('green') ? 'text-revalpro-green' : 
                                                     element.color.includes('teal') ? 'text-revalpro-teal' :
                                                     element.color.includes('purple') ? 'text-revalpro-purple' :
                                                     element.color.includes('orange') ? 'text-revalpro-orange' :
                                                     'text-revalpro-pink'} stopOpacity="0.8" />
                          <stop offset="100%" className={element.color.includes('green') ? 'text-revalpro-green' : 
                                                       element.color.includes('teal') ? 'text-revalpro-teal' :
                                                       element.color.includes('purple') ? 'text-revalpro-purple' :
                                                       element.color.includes('orange') ? 'text-revalpro-orange' :
                                                       'text-revalpro-pink'} stopOpacity="0.4" />
                        </linearGradient>
                      </defs>
                      
                      {/* Outer ring segment */}
                      <path
                        d={`M 200 200 L 200 80 A 120 120 0 0 1 ${200 + 120 * Math.cos((72 * Math.PI) / 180)} ${200 + 120 * Math.sin((72 * Math.PI) / 180)} Z`}
                        fill={`url(#gradient-${index})`}
                        stroke="white"
                        strokeWidth="3"
                        className="cursor-pointer transition-all duration-300 hover:opacity-80"
                        onClick={() => setLocation(element.link)}
                      />
                      
                      {/* Progress indicator ring */}
                      <path
                        d={`M 200 200 L 200 80 A 120 120 0 0 1 ${200 + 120 * Math.cos(((72 * element.data.percentage) / 100 * Math.PI) / 180)} ${200 + 120 * Math.sin(((72 * element.data.percentage) / 100 * Math.PI) / 180)} Z`}
                        fill={element.data.percentage === 100 ? '#10b981' : element.data.percentage >= 70 ? '#f59e0b' : '#ef4444'}
                        stroke="white"
                        strokeWidth="2"
                        opacity="0.9"
                      />
                    </svg>
                  </div>
                  
                  {/* Label positioned around the circle */}
                  <Link href={element.link}>
                    <div
                      className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `calc(50% + ${labelX}px)`,
                        top: `calc(50% + ${labelY}px)`,
                      }}
                    >
                      <motion.div
                        className="bg-white rounded-lg shadow-lg border-2 p-3 min-w-24 text-center hover:scale-105 transition-transform duration-200"
                        style={{ borderColor: element.color.includes('green') ? '#10b981' : 
                                              element.color.includes('teal') ? '#14b8a6' :
                                              element.color.includes('purple') ? '#8b5cf6' :
                                              element.color.includes('orange') ? '#f97316' :
                                              '#ec4899' }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className={statusInfo.color}>
                          {element.icon}
                        </div>
                        <div className="text-xs font-semibold mt-1 leading-tight">
                          {element.title}
                        </div>
                        <div className={`text-xs font-bold ${statusInfo.color}`}>
                          {element.data.percentage}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {element.data.current}/{element.data.required}
                        </div>
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
        
        {/* Legend */}
        <motion.div 
          className="mt-8 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-700">Complete (100%)</span>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-amber-700">In Progress (70%+)</span>
          </div>
          <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">Needs Attention (&lt;70%)</span>
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