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
  const { user } = useAuth();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

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
        </div>
      </div>
    </nav>
  );
}