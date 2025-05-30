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
  LayoutPanelTop,
  PanelLeft,
  Shield,
  ChevronDown,
  Bot,
  User,
  TrendingUp,
  ListChecks
} from 'lucide-react';
import { useMenuLayout } from "@/hooks/use-menu-layout";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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

export default function NavigationTabs({ currentPath }: NavigationTabsProps) {
  const { layout, toggleLayout } = useMenuLayout();
  const { user } = useAuth();
  const isVertical = layout === "vertical";
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (groupLabel: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupLabel) 
        ? prev.filter(g => g !== groupLabel)
        : [...prev, groupLabel]
    );
  };

  // Grouped navigation structure
  const navigationGroups: NavigationGroup[] = [
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
          color: "bg-revalpro-teal/20 text-revalpro-teal",
          hoverColor: "hover:bg-revalpro-teal/30"
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
          href: "/declarations", 
          label: "Declarations", 
          icon: <ClipboardCheck size={16} />,
          color: "bg-revalpro-pink/20 text-revalpro-pink",
          hoverColor: "hover:bg-revalpro-pink/30"
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
          color: "bg-revalpro-blue/20 text-revalpro-blue",
          hoverColor: "hover:bg-revalpro-blue/30"
        },
        { 
          href: "/nmc-registration-check", 
          label: "Check NMC PIN", 
          icon: <Heart size={16} />,
          color: "bg-revalpro-red/20 text-revalpro-red",
          hoverColor: "hover:bg-revalpro-red/30"
        },
        { 
          href: "/nmc-resources", 
          label: "NMC Resources", 
          icon: <Link2 size={16} />,
          color: "bg-revalpro-teal/20 text-revalpro-teal",
          hoverColor: "hover:bg-revalpro-teal/30"
        },
        { 
          href: "/nmc-service-status", 
          label: "NMC Status", 
          icon: <ActivitySquare size={16} />,
          color: "bg-revalpro-purple/20 text-revalpro-purple",
          hoverColor: "hover:bg-revalpro-purple/30"
        },
      ]
    },
    {
      label: "AI Assistant",
      icon: <Bot size={16} />,
      color: "bg-gradient-to-r from-revalpro-purple/30 to-revalpro-blue/30 text-revalpro-blue",
      hoverColor: "hover:from-revalpro-purple/40 hover:to-revalpro-blue/40",
      items: [
        { 
          href: "/ai-assistant", 
          label: "AI Helper", 
          icon: <HelpCircle size={16} />,
          color: "bg-gradient-to-r from-revalpro-purple/30 to-revalpro-blue/30 text-revalpro-blue font-semibold",
          hoverColor: "hover:from-revalpro-purple/40 hover:to-revalpro-blue/40"
        },
      ]
    },
    {
      label: "Profile & Settings",
      icon: <User size={16} />,
      color: "bg-gray-200 text-gray-700",
      hoverColor: "hover:bg-gray-300",
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
          color: "bg-gray-200 text-gray-700",
          hoverColor: "hover:bg-gray-300"
        },
      ]
    },
  ];

  // Add testing and admin items if applicable
  const testingItems: NavigationLink[] = [];
  testingItems.push(
    { 
      href: "/tester-feedback", 
      label: "Tester Feedback", 
      icon: <MessageCircle size={16} />,
      color: "bg-amber-200 text-amber-700",
      hoverColor: "hover:bg-amber-300"
    },
    { 
      href: "/feasibility-questionnaire", 
      label: "Feasibility Test", 
      icon: <ClipboardCheck size={16} />,
      color: "bg-emerald-200 text-emerald-700",
      hoverColor: "hover:bg-emerald-300"
    }
  );

  if (user?.isSuperAdmin || user?.isAdmin) {
    testingItems.push({
      href: "/admin",
      label: "Admin Panel",
      icon: <Shield size={16} />,
      color: "bg-red-200 text-red-700",
      hoverColor: "hover:bg-red-300"
    });
  }

  if (testingItems.length > 0) {
    navigationGroups.push({
      label: "Testing & Admin",
      icon: <Shield size={16} />,
      color: "bg-amber-200 text-amber-700",
      hoverColor: "hover:bg-amber-300",
      items: testingItems
    });
  }

  // Dashboard as standalone item
  const dashboardLink: NavigationLink = { 
    href: "/dashboard", 
    label: "Dashboard", 
    icon: <LayoutDashboard size={16} />,
    color: "bg-revalpro-blue/20 text-revalpro-blue",
    hoverColor: "hover:bg-revalpro-blue/30" 
  };

  // Render the vertical sidebar navigation
  if (isVertical) {
    return (
      <div className="flex h-screen">
        <nav className="bg-white shadow-md w-64 flex-shrink-0 h-full fixed left-0 top-0 pt-16 z-10">
          <div className="h-full overflow-y-auto hide-scrollbar">
            <div className="flex justify-end py-2 px-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleLayout} 
                    className="h-8 w-8"
                  >
                    <LayoutPanelTop size={18} className="text-gray-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Switch to Horizontal Menu</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="flex flex-col space-y-2 p-3">
              {/* Dashboard Link */}
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20
                }}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Link href={dashboardLink.href}>
                  <div 
                    className={cn(
                      "px-4 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer flex items-center gap-3 relative overflow-hidden",
                      currentPath === dashboardLink.href
                        ? `${dashboardLink.color} ring-2 ring-offset-1 shadow-sm`
                        : `text-gray-600 hover:${dashboardLink.color.split(' ')[0]} ${dashboardLink.hoverColor}`
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
                    <span className="text-sm">{dashboardLink.label}</span>
                  </div>
                </Link>
              </motion.div>

              {/* Navigation Groups */}
              {navigationGroups.map((group, groupIndex) => {
                const isGroupExpanded = expandedGroups.includes(group.label);
                const hasActiveItem = group.items.some(item => currentPath === item.href);
                
                return (
                  <motion.div 
                    key={group.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20, 
                      delay: (groupIndex + 1) * 0.1
                    }}
                    className="space-y-1"
                  >
                    {/* Group Header */}
                    <div 
                      onClick={() => toggleGroup(group.label)}
                      className={cn(
                        "px-4 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer flex items-center gap-3 justify-between",
                        hasActiveItem
                          ? `${group.color} ring-1 ring-offset-1 shadow-sm`
                          : `text-gray-600 ${group.hoverColor}`
                      )}
                    >
                      <div className="flex items-center gap-3">
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
                        <span className="text-sm">{group.label}</span>
                      </div>
                      <motion.span
                        animate={{ rotate: isGroupExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex"
                      >
                        <ChevronDown size={14} />
                      </motion.span>
                    </div>

                    {/* Group Items */}
                    {isGroupExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 space-y-1"
                      >
                        {group.items.map((item, itemIndex) => {
                          const isActive = currentPath === item.href;
                          return (
                            <motion.div
                              key={item.href}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                delay: itemIndex * 0.05
                              }}
                              whileHover={{ 
                                scale: 1.02,
                                transition: { duration: 0.2 }
                              }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Link href={item.href}>
                                <div 
                                  className={cn(
                                    "px-3 py-2 rounded-md font-medium transition-all duration-300 cursor-pointer flex items-center gap-2 relative overflow-hidden",
                                    isActive
                                      ? `${item.color} ring-1 ring-offset-1 shadow-sm`
                                      : `text-gray-500 hover:${item.color.split(' ')[0]} ${item.hoverColor}`
                                  )}
                                >
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
                                  <span className="text-xs">{item.label}</span>
                                </div>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </nav>
        <div className="ml-64 w-full pt-16"></div>
      </div>
    );
  }

  // Render horizontal navigation with grouped dropdowns
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex overflow-x-auto whitespace-nowrap hide-scrollbar items-center gap-2">
            {/* Dashboard Link */}
            <motion.div 
              className="mr-2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={dashboardLink.href}>
                <div 
                  className={cn(
                    "px-3 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer inline-flex items-center gap-1.5 relative overflow-hidden",
                    currentPath === dashboardLink.href
                      ? `${dashboardLink.color} ring-2 ring-offset-1 shadow-sm`
                      : `text-gray-600 hover:${dashboardLink.color.split(' ')[0]} ${dashboardLink.hoverColor}`
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
                  <span className="text-sm">{dashboardLink.label}</span>
                </div>
              </Link>
            </motion.div>

            {/* Navigation Groups */}
            {navigationGroups.map((group, groupIndex) => {
              const hasActiveItem = group.items.some(item => currentPath === item.href);
              
              return (
                <motion.div 
                  key={group.label}
                  className="mr-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20, 
                    delay: (groupIndex + 1) * 0.1
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div 
                        className={cn(
                          "px-3 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer inline-flex items-center gap-1.5 relative overflow-hidden",
                          hasActiveItem
                            ? `${group.color} ring-2 ring-offset-1 shadow-sm`
                            : `text-gray-600 ${group.hoverColor}`
                        )}
                      >
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
                        <span className="text-sm">{group.label}</span>
                        <ChevronDown size={12} />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleLayout} 
                className="ml-3 h-8 w-8 flex-shrink-0"
              >
                <PanelLeft size={18} className="text-gray-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Switch to Vertical Menu</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </nav>
  );
}