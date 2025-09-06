import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Clock, 
  BookOpen, 
  MessageSquare, 
  FileText, 
  ClipboardCheck, 
  HelpCircle,
  Settings as SettingsIcon,
  CreditCard,
  Heart,
  Calendar,
  Link2,
  ActivitySquare,
  MessageCircle,
  BarChart3,
  Shield,
  ChevronDown,
  Bot,
  User,
  TrendingUp,
  ListChecks,
  GraduationCap,
  Archive
} from 'lucide-react';
import { useAuth } from "@/hooks/use-auth";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

type NavigationTabsProps = {
  currentPath: string;
  onSidebarToggle?: (expanded: boolean) => void;
};

type NavigationLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
};

type NavigationGroup = {
  label: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  items: NavigationLink[];
};

export default function NavigationTabs({ currentPath, onSidebarToggle }: NavigationTabsProps) {
  const { user } = useAuth();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Don't render navigation if user is not authenticated
  if (!user) {
    return null;
  }

  const toggleGroup = (groupLabel: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupLabel) 
        ? prev.filter(g => g !== groupLabel)
        : [...prev, groupLabel]
    );
  };

  // Grouped navigation structure with logo petal colors
  const navigationGroups: NavigationGroup[] = [
    {
      label: "Guides",
      icon: <BookOpen size={16} />,
      color: "bg-revalpro-purple/20 text-revalpro-purple",
      hoverColor: "hover:bg-revalpro-purple/30",
      items: [
        { 
          href: "/user-guide", 
          label: "User Guides", 
          icon: <BookOpen size={16} />,
          color: "bg-revalpro-purple/20 text-revalpro-purple",
          hoverColor: "hover:bg-revalpro-purple/30"
        },
        { 
          href: "/help-guide.html", 
          label: "Quick Start", 
          icon: <FileText size={16} />,
          color: "bg-revalpro-green/20 text-revalpro-green",
          hoverColor: "hover:bg-revalpro-green/30"
        },
      ]
    },
    {
      label: "Profile & Settings",
      icon: <User size={16} />,
      color: "bg-revalpro-teal/20 text-revalpro-teal",
      hoverColor: "hover:bg-revalpro-teal/30",
      items: [
        { 
          href: "/subscription", 
          label: "Subscription", 
          icon: <CreditCard size={16} />,
          color: "bg-revalpro-fuchsia/20 text-revalpro-fuchsia",
          hoverColor: "hover:bg-revalpro-fuchsia/30"
        },
        { 
          href: "/settings", 
          label: "Settings", 
          icon: <SettingsIcon size={16} />,
          color: "bg-revalpro-teal/20 text-revalpro-teal",
          hoverColor: "hover:bg-revalpro-teal/30"
        },
      ]
    },
    {
      label: "Revalidation Elements",
      icon: <ListChecks size={16} />,
      color: "bg-revalpro-blue/20 text-revalpro-blue",
      hoverColor: "hover:bg-revalpro-blue/30",
      items: [
        { 
          href: "/practice-hours", 
          label: "Practice Hours", 
          icon: <Clock size={16} />,
          color: "bg-revalpro-green/20 text-revalpro-green",
          hoverColor: "hover:bg-revalpro-green/30"
        },
        { 
          href: "/cpd", 
          label: "CPD Records", 
          icon: <BookOpen size={16} />,
          color: "bg-revalpro-blue/20 text-revalpro-blue",
          hoverColor: "hover:bg-revalpro-blue/30"
        },
        { 
          href: "/feedback", 
          label: "Feedback", 
          icon: <MessageSquare size={16} />,
          color: "bg-revalpro-purple/20 text-revalpro-purple",
          hoverColor: "hover:bg-revalpro-purple/30"
        },
        { 
          href: "/reflections", 
          label: "Reflections", 
          icon: <FileText size={16} />,
          color: "bg-revalpro-orange/20 text-revalpro-orange",
          hoverColor: "hover:bg-revalpro-orange/30"
        },
        { 
          href: "/training", 
          label: "Training Records", 
          icon: <GraduationCap size={16} />,
          color: "bg-revalpro-teal/20 text-revalpro-teal",
          hoverColor: "hover:bg-revalpro-teal/30"
        },
        { 
          href: "/declarations", 
          label: "Declarations", 
          icon: <ClipboardCheck size={16} />,
          color: "bg-revalpro-fuchsia/20 text-revalpro-fuchsia",
          hoverColor: "hover:bg-revalpro-fuchsia/30"
        },
      ]
    },
    {
      label: "Analytics & Visuals",
      icon: <TrendingUp size={16} />,
      color: "bg-revalpro-orange/20 text-revalpro-orange",
      hoverColor: "hover:bg-revalpro-orange/30",
      items: [
        { 
          href: "/summary-infographic", 
          label: "Export Infographic", 
          icon: <BarChart3 size={16} />,
          color: "bg-revalpro-orange/20 text-revalpro-orange",
          hoverColor: "hover:bg-revalpro-orange/30"
        },
        { 
          href: "/revalidation-dates", 
          label: "Important Dates", 
          icon: <Calendar size={16} />,
          color: "bg-revalpro-purple/20 text-revalpro-purple",
          hoverColor: "hover:bg-revalpro-purple/30"
        },
        { 
          href: "/nmc-resources", 
          label: "NMC Resources", 
          icon: <Link2 size={16} />,
          color: "bg-revalpro-blue/20 text-revalpro-blue",
          hoverColor: "hover:bg-revalpro-blue/30"
        },
        { 
          href: "/revalidation-audit", 
          label: "Audit & Archive", 
          icon: <Archive size={16} />,
          color: "bg-revalpro-teal/20 text-revalpro-teal",
          hoverColor: "hover:bg-revalpro-teal/30"
        },

      ]
    },
    {
      label: "AI Assistant",
      icon: <Bot size={16} />,
      color: "bg-gradient-to-r from-revalpro-purple/30 to-revalpro-fuchsia/30 text-revalpro-purple",
      hoverColor: "hover:from-revalpro-purple/40 hover:to-revalpro-fuchsia/40",
      items: [
        { 
          href: "/ai-assistant", 
          label: "AI Helper", 
          icon: <HelpCircle size={16} />,
          color: "bg-gradient-to-r from-revalpro-purple/30 to-revalpro-fuchsia/30 text-revalpro-purple font-semibold",
          hoverColor: "hover:from-revalpro-purple/40 hover:to-revalpro-fuchsia/40"
        },
      ]
    },
  ];

  // Add admin items if applicable
  const adminItems: NavigationLink[] = [];

  if (user?.isSuperAdmin || user?.isAdmin) {
    adminItems.push({
      href: "/admin",
      label: "Admin Panel",
      icon: <Shield size={16} />,
      color: "bg-red-200 text-red-700",
      hoverColor: "hover:bg-red-300"
    });
  }

  if (adminItems.length > 0) {
    navigationGroups.push({
      label: "Admin",
      icon: <Shield size={16} />,
      color: "bg-red-200 text-red-700",
      hoverColor: "hover:bg-red-300",
      items: adminItems
    });
  }

  // Dashboard as standalone item (keeping the pink you love!)
  const dashboardLink: NavigationLink = { 
    href: "/dashboard", 
    label: "Dashboard", 
    icon: <LayoutDashboard size={16} />,
    color: "bg-revalpro-pink/20 text-revalpro-pink",
    hoverColor: "hover:bg-revalpro-pink/30" 
  };



  // Render horizontal navigation with colored menu options using images
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-2 py-3 overflow-x-auto">
          {/* Dashboard - Pink */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={dashboardLink.href}>
              <div 
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-300 cursor-pointer group relative",
                  currentPath === dashboardLink.href
                    ? "bg-revalpro-pink/30 text-revalpro-pink shadow-lg ring-2 ring-revalpro-pink/50"
                    : "bg-revalpro-pink/20 text-revalpro-pink hover:bg-revalpro-pink/30 hover:shadow-md"
                )}
              >
                <motion.div
                  animate={{ 
                    rotate: currentPath === dashboardLink.href ? [0, 10, -10, 0] : 0,
                    scale: currentPath === dashboardLink.href ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-2xl"
                >
                  {dashboardLink.icon}
                </motion.div>
              </div>
            </Link>
          </motion.div>

          {/* Practice Hours - Green */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/practice-hours">
              <div 
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-300 cursor-pointer group relative",
                  currentPath === "/practice-hours"
                    ? "bg-revalpro-green/30 text-revalpro-green shadow-lg ring-2 ring-revalpro-green/50"
                    : "bg-revalpro-green/20 text-revalpro-green hover:bg-revalpro-green/30 hover:shadow-md"
                )}
              >
                <motion.div
                  animate={{ 
                    rotate: currentPath === "/practice-hours" ? [0, 10, -10, 0] : 0,
                    scale: currentPath === "/practice-hours" ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-2xl"
                >
                  <Clock size={24} />
                </motion.div>
              </div>
            </Link>
          </motion.div>

          {/* CPD Records - Blue */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/cpd">
              <div 
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-300 cursor-pointer group relative",
                  currentPath === "/cpd"
                    ? "bg-revalpro-blue/30 text-revalpro-blue shadow-lg ring-2 ring-revalpro-blue/50"
                    : "bg-revalpro-blue/20 text-revalpro-blue hover:bg-revalpro-blue/30 hover:shadow-md"
                )}
              >
                <motion.div
                  animate={{ 
                    rotate: currentPath === "/cpd" ? [0, 10, -10, 0] : 0,
                    scale: currentPath === "/cpd" ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-2xl"
                >
                  <BookOpen size={24} />
                </motion.div>
              </div>
            </Link>
          </motion.div>

          {/* Feedback - Purple */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/feedback">
              <div 
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-300 cursor-pointer group relative",
                  currentPath === "/feedback"
                    ? "bg-revalpro-purple/30 text-revalpro-purple shadow-lg ring-2 ring-revalpro-purple/50"
                    : "bg-revalpro-purple/20 text-revalpro-purple hover:bg-revalpro-purple/30 hover:shadow-md"
                )}
              >
                <motion.div
                  animate={{ 
                    rotate: currentPath === "/feedback" ? [0, 10, -10, 0] : 0,
                    scale: currentPath === "/feedback" ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-2xl"
                >
                  <MessageSquare size={24} />
                </motion.div>
              </div>
            </Link>
          </motion.div>

          {/* Reflections - Orange */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/reflections">
              <div 
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-300 cursor-pointer group relative",
                  currentPath === "/reflections"
                    ? "bg-revalpro-orange/30 text-revalpro-orange shadow-lg ring-2 ring-revalpro-orange/50"
                    : "bg-revalpro-orange/20 text-revalpro-orange hover:bg-revalpro-orange/30 hover:shadow-md"
                )}
              >
                <motion.div
                  animate={{ 
                    rotate: currentPath === "/reflections" ? [0, 10, -10, 0] : 0,
                    scale: currentPath === "/reflections" ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-2xl"
                >
                  <FileText size={24} />
                </motion.div>
              </div>
            </Link>
          </motion.div>

          {/* Training - Teal */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/training">
              <div 
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-300 cursor-pointer group relative",
                  currentPath === "/training"
                    ? "bg-revalpro-teal/30 text-revalpro-teal shadow-lg ring-2 ring-revalpro-teal/50"
                    : "bg-revalpro-teal/20 text-revalpro-teal hover:bg-revalpro-teal/30 hover:shadow-md"
                )}
              >
                <motion.div
                  animate={{ 
                    rotate: currentPath === "/training" ? [0, 10, -10, 0] : 0,
                    scale: currentPath === "/training" ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-2xl"
                >
                  <GraduationCap size={24} />
                </motion.div>
              </div>
            </Link>
          </motion.div>

          {/* Declarations - Fuchsia */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/declarations">
              <div 
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-300 cursor-pointer group relative",
                  currentPath === "/declarations"
                    ? "bg-revalpro-fuchsia/30 text-revalpro-fuchsia shadow-lg ring-2 ring-revalpro-fuchsia/50"
                    : "bg-revalpro-fuchsia/20 text-revalpro-fuchsia hover:bg-revalpro-fuchsia/30 hover:shadow-md"
                )}
              >
                <motion.div
                  animate={{ 
                    rotate: currentPath === "/declarations" ? [0, 10, -10, 0] : 0,
                    scale: currentPath === "/declarations" ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-2xl"
                >
                  <ClipboardCheck size={24} />
                </motion.div>
              </div>
            </Link>
          </motion.div>

          {/* AI Assistant - Gradient Purple/Fuchsia */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/ai-assistant">
              <div 
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-300 cursor-pointer group relative bg-gradient-to-br",
                  currentPath === "/ai-assistant"
                    ? "from-revalpro-purple/40 to-revalpro-fuchsia/40 text-revalpro-purple shadow-lg ring-2 ring-revalpro-purple/50"
                    : "from-revalpro-purple/20 to-revalpro-fuchsia/20 text-revalpro-purple hover:from-revalpro-purple/30 hover:to-revalpro-fuchsia/30 hover:shadow-md"
                )}
              >
                <motion.div
                  animate={{ 
                    rotate: currentPath === "/ai-assistant" ? [0, 10, -10, 0] : 0,
                    scale: currentPath === "/ai-assistant" ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-2xl"
                >
                  <Bot size={24} />
                </motion.div>
              </div>
            </Link>
          </motion.div>

          {/* Settings Menu - Dropdown for less frequently used items */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div 
                  className={cn(
                    "flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-300 cursor-pointer group relative",
                    ["/settings", "/subscription", "/user-guide", "/summary-infographic", "/revalidation-dates", "/nmc-resources", "/revalidation-audit"].includes(currentPath)
                      ? "bg-gray-300 text-gray-700 shadow-lg ring-2 ring-gray-400/50"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300 hover:shadow-md"
                  )}
                >
                  <motion.div
                    animate={{ 
                      rotate: ["/settings", "/subscription", "/user-guide", "/summary-infographic", "/revalidation-dates", "/nmc-resources", "/revalidation-audit"].includes(currentPath) ? [0, 10, -10, 0] : 0,
                      scale: ["/settings", "/subscription", "/user-guide", "/summary-infographic", "/revalidation-dates", "/nmc-resources", "/revalidation-audit"].includes(currentPath) ? [1, 1.2, 1] : 1
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-2xl"
                  >
                    <SettingsIcon size={24} />
                  </motion.div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Settings & More</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <div className="flex items-center gap-2">
                      <SettingsIcon size={16} />
                      <span>Settings</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/subscription">
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} />
                      <span>Subscription</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/user-guide">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <span>User Guide</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/summary-infographic">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={16} />
                      <span>Export Summary</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/revalidation-dates">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>Important Dates</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/nmc-resources">
                    <div className="flex items-center gap-2">
                      <Link2 size={16} />
                      <span>Resources</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/revalidation-audit">
                    <div className="flex items-center gap-2">
                      <Archive size={16} />
                      <span>Audit & Archive</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                {adminItems.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    {adminItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href}>
                          <div className="flex items-center gap-2">
                            {item.icon}
                            <span>{item.label}</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </div>
    </nav>
  );
}