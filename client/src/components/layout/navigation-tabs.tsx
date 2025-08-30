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
import logo from "@assets/Leonardo_Phoenix_10_design_a_vibrant_and_professional_logo_for_3.jpg";
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
          href: "/nmc-registration-check", 
          label: "Check NMC PIN", 
          icon: <Heart size={16} />,
          color: "bg-revalpro-pink/20 text-revalpro-pink",
          hoverColor: "hover:bg-revalpro-pink/30"
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



  // Render collapsible vertical navigation
  return (
    <nav className={`bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto transition-all duration-300 ease-in-out z-50 ${
      sidebarExpanded ? 'w-64' : 'w-16'
    }`}>
      <div className="p-4">
        {/* Logo and Toggle Section */}
        <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-revalpro-dark-blue to-revalpro-blue">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <div className={cn("transition-all duration-300", sidebarExpanded ? "h-8 w-8 mr-2" : "h-8 w-8")}>
                  <img 
                    src={logo} 
                    alt="RevalPro Logo" 
                    className="h-full w-full object-contain"
                  />
                </div>
                {sidebarExpanded && (
                  <div className="text-white font-bold text-sm leading-tight">
                    RevalPro
                  </div>
                )}
              </div>
            </Link>
            
            {/* Toggle Button */}
            <motion.button
              onClick={() => {
                const newState = !sidebarExpanded;
                setSidebarExpanded(newState);
                onSidebarToggle?.(newState);
              }}
              className="p-1 rounded-md bg-white/20 hover:bg-white/30 transition-colors duration-200 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: sidebarExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={16} className="text-white transform rotate-90" />
              </motion.div>
            </motion.button>
          </div>
        </div>
        {/* Dashboard Link */}
        <motion.div 
          className="mb-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20
          }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Link href={dashboardLink.href}>
            <div 
              className={cn(
                "px-4 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer flex items-center w-full relative overflow-hidden",
                sidebarExpanded ? "gap-3" : "justify-center",
                currentPath === dashboardLink.href
                  ? `${dashboardLink.color} ring-2 ring-offset-1 shadow-sm`
                  : `${dashboardLink.color} ${dashboardLink.hoverColor}`
              )}
            >
              <motion.span
                animate={{ 
                  rotate: currentPath === dashboardLink.href ? [0, 10, -10, 0] : 0,
                  scale: currentPath === dashboardLink.href ? [1, 1.2, 1] : 1
                }}
                transition={{ 
                  duration: 0.5, 
                  ease: "easeInOut", 
                  delay: 0.1 
                }}
                className="inline-flex"
              >
                {dashboardLink.icon}
              </motion.span>
              {sidebarExpanded && <span className="text-sm">{dashboardLink.label}</span>}
            </div>
          </Link>
        </motion.div>

        {/* Navigation Groups */}
        {navigationGroups.map((group, groupIndex) => {
          const hasActiveItem = group.items.some(item => currentPath === item.href);
          
          return (
            <motion.div 
              key={group.label}
              className="mb-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20, 
                delay: (groupIndex + 1) * 0.1
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div 
                    className={cn(
                      "px-4 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer flex items-center w-full relative overflow-hidden",
                      sidebarExpanded ? "gap-3 justify-between" : "justify-center",
                      hasActiveItem
                        ? `${group.color} ring-2 ring-offset-1 shadow-sm`
                        : `${group.color} ${group.hoverColor}`
                    )}
                  >
                    <div className={cn("flex items-center", sidebarExpanded ? "gap-3" : "")}>
                      <motion.span
                        animate={{ 
                          rotate: hasActiveItem ? [0, 10, -10, 0] : 0,
                          scale: hasActiveItem ? [1, 1.2, 1] : 1
                        }}
                        transition={{ 
                          duration: 0.5, 
                          ease: "easeInOut"
                        }}
                        className="inline-flex"
                      >
                        {group.icon}
                      </motion.span>
                      {sidebarExpanded && <span className="text-sm">{group.label}</span>}
                    </div>
                    {sidebarExpanded && <ChevronDown size={12} className="transform rotate-[-90deg]" />}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side={sidebarExpanded ? "right" : "right"} align="start" className={cn("w-56", sidebarExpanded ? "ml-2" : "ml-4")}>
                  <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {group.items.map((item) => {
                    const isActive = currentPath === item.href;
                    return (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href}>
                          <div className={cn(
                            "flex items-center gap-2 w-full",
                            isActive ? "font-semibold" : ""
                          )}>
                            <motion.span
                              animate={{ 
                                rotate: isActive ? [0, 10, -10, 0] : 0,
                                scale: isActive ? [1, 1.1, 1] : 1
                              }}
                              transition={{ 
                                duration: 0.5, 
                                ease: "easeInOut"
                              }}
                              className="inline-flex"
                            >
                              {item.icon}
                            </motion.span>
                            <span>{item.label}</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
}