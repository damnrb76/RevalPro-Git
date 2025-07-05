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
import { userProfileStorage, practiceHoursStorage, cpdRecordsStorage, feedbackRecordsStorage, reflectiveAccountsStorage, healthDeclarationStorage } from "@/lib/storage";
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

  // Fetch practice hours data
  const { data: practiceHours = [] } = useQuery({
    queryKey: ['practiceHours'],
    queryFn: async () => {
      return practiceHoursStorage.getAll();
    },
  });

  // Fetch CPD records data
  const { data: cpdRecords = [] } = useQuery({
    queryKey: ['cpdRecords'],
    queryFn: async () => {
      return cpdRecordsStorage.getAll();
    },
  });

  // Fetch feedback records data
  const { data: feedbackRecords = [] } = useQuery({
    queryKey: ['feedbackRecords'],
    queryFn: async () => {
      return feedbackRecordsStorage.getAll();
    },
  });

  // Fetch reflective accounts data
  const { data: reflectiveAccounts = [] } = useQuery({
    queryKey: ['reflectiveAccounts'],
    queryFn: async () => {
      return reflectiveAccountsStorage.getAll();
    },
  });

  // Fetch health declarations data
  const { data: healthDeclarations = [] } = useQuery({
    queryKey: ['healthDeclarations'],
    queryFn: async () => {
      return healthDeclarationStorage.getAll();
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

  // Calculate real progress based on actual data
  const getRevalidationProgress = () => {
    // Calculate total practice hours from all records
    const totalPracticeHours = practiceHours.reduce((sum, record) => sum + record.hours, 0);
    const requiredPracticeHours = 1500; // NMC requirement
    
    // Calculate CPD hours from all records
    const totalCpdHours = cpdRecords.reduce((sum, record) => sum + record.hours, 0);
    const requiredCpdHours = 35; // NMC requirement
    
    // Count feedback records
    const feedbackCount = feedbackRecords.length;
    const requiredFeedback = 5; // NMC requirement
    
    // Count reflective accounts
    const reflectionsCount = reflectiveAccounts.length;
    const requiredReflections = 5; // NMC requirement
    
    // Count health declarations
    const declarationsCount = healthDeclarations.length;
    const requiredDeclarations = 1; // NMC requirement
    
    return {
      practiceHours: {
        current: totalPracticeHours,
        required: requiredPracticeHours,
        percentage: Math.min(Math.round((totalPracticeHours / requiredPracticeHours) * 100), 100),
        status: totalPracticeHours >= requiredPracticeHours ? 'complete' : 'in-progress'
      },
      cpdRecords: {
        current: totalCpdHours,
        required: requiredCpdHours,
        percentage: Math.min(Math.round((totalCpdHours / requiredCpdHours) * 100), 100),
        status: totalCpdHours >= requiredCpdHours ? 'complete' : 'in-progress'
      },
      feedback: {
        current: feedbackCount,
        required: requiredFeedback,
        percentage: Math.min(Math.round((feedbackCount / requiredFeedback) * 100), 100),
        status: feedbackCount >= requiredFeedback ? 'complete' : 'in-progress'
      },
      reflections: {
        current: reflectionsCount,
        required: requiredReflections,
        percentage: Math.min(Math.round((reflectionsCount / requiredReflections) * 100), 100),
        status: reflectionsCount >= requiredReflections ? 'complete' : 'in-progress'
      },
      declarations: {
        current: declarationsCount,
        required: requiredDeclarations,
        percentage: Math.min(Math.round((declarationsCount / requiredDeclarations) * 100), 100),
        status: declarationsCount >= requiredDeclarations ? 'complete' : 'in-progress'
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

      {/* Modern Analytics Dashboard */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-8">
          <span className="bg-gradient-to-r from-revalpro-blue to-revalpro-teal bg-clip-text text-transparent">
            Revalidation Progress
          </span>
        </h2>
        
        {/* Main metrics grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Overall Progress Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-revalpro-blue/10 via-revalpro-blue/5 to-transparent border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-revalpro-blue/20 to-revalpro-teal/10"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">Overall Progress</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-revalpro-blue animate-pulse"></div>
                    <span className="text-xs text-gray-500">Active</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-revalpro-blue">{overallProgress}%</div>
                  <div className="text-sm text-gray-500">Complete</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-revalpro-blue to-revalpro-teal h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${overallProgress}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Individual element cards */}
          {revalidationElements.slice(0, 2).map((element, index) => {
            const getElementColors = (key: string) => {
              switch(key) {
                case 'practiceHours': return { primary: '#10b981', secondary: '#059669' }; // Green
                case 'cpdRecords': return { primary: '#f59e0b', secondary: '#d97706' }; // Amber
                case 'reflections': return { primary: '#8b5cf6', secondary: '#7c3aed' }; // Purple
                case 'feedback': return { primary: '#ef4444', secondary: '#dc2626' }; // Red
                case 'declarations': return { primary: '#0ea5e9', secondary: '#0284c7' }; // Blue
                default: return { primary: '#6b7280', secondary: '#4b5563' }; // Gray
              }
            };

            const colors = getElementColors(element.key);
            
            return (
              <motion.div
                key={element.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              >
                <Link href={element.link}>
                  <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                    <div className="absolute inset-0 bg-gradient-to-br" style={{
                      background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}10, transparent)`
                    }}></div>
                    <CardContent className="relative p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div style={{ color: colors.primary }} className="text-lg">
                          {element.icon}
                        </div>
                        <div className="text-xs text-gray-400">
                          {element.data.current}/{element.data.required}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-700">{element.title}</h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold" style={{ color: colors.primary }}>
                            {element.data.percentage}%
                          </span>
                          <span className="text-xs text-gray-500">complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="h-1.5 rounded-full transition-all duration-1000"
                            style={{ 
                              width: `${element.data.percentage}%`,
                              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`
                            }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Remaining elements grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {revalidationElements.slice(2).map((element, index) => {
            const getElementColors = (key: string) => {
              switch(key) {
                case 'practiceHours': return { primary: '#10b981', secondary: '#059669' }; // Green
                case 'cpdRecords': return { primary: '#f59e0b', secondary: '#d97706' }; // Amber
                case 'reflections': return { primary: '#8b5cf6', secondary: '#7c3aed' }; // Purple
                case 'feedback': return { primary: '#ef4444', secondary: '#dc2626' }; // Red
                case 'declarations': return { primary: '#0ea5e9', secondary: '#0284c7' }; // Blue
                default: return { primary: '#6b7280', secondary: '#4b5563' }; // Gray
              }
            };

            const colors = getElementColors(element.key);
            
            return (
              <motion.div
                key={element.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              >
                <Link href={element.link}>
                  <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
                    <div className="absolute inset-0 bg-gradient-to-br" style={{
                      background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}10, transparent)`
                    }}></div>
                    <CardContent className="relative p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div style={{ color: colors.primary }} className="text-lg">
                          {element.icon}
                        </div>
                        <div className="text-xs text-gray-400">
                          {element.data.current}/{element.data.required}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-700">{element.title}</h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold" style={{ color: colors.primary }}>
                            {element.data.percentage}%
                          </span>
                          <span className="text-xs text-gray-500">complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="h-1.5 rounded-full transition-all duration-1000"
                            style={{ 
                              width: `${element.data.percentage}%`,
                              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`
                            }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
        

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