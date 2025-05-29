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
  Shield
} from 'lucide-react';
import { useMenuLayout } from "@/hooks/use-menu-layout";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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

export default function NavigationTabs({ currentPath }: NavigationTabsProps) {
  const { layout, toggleLayout } = useMenuLayout();
  const { user } = useAuth();
  const isVertical = layout === "vertical";
  
  // Base navigation links
  const baseLinks: NavigationLink[] = [
    { 
      href: "/dashboard", 
      label: "Dashboard", 
      icon: <LayoutDashboard size={16} />,
      color: "bg-revalpro-blue/20 text-revalpro-blue",
      hoverColor: "hover:bg-revalpro-blue/30" 
    },
    { 
      href: "/ai-assistant", 
      label: "AI Assistant", 
      icon: <HelpCircle size={16} />,
      color: "bg-gradient-to-r from-revalpro-purple/30 to-revalpro-blue/30 text-revalpro-blue font-semibold",
      hoverColor: "hover:from-revalpro-purple/40 hover:to-revalpro-blue/40"
    },
    { 
      href: "/practice-hours", 
      label: "Hours", 
      icon: <Clock size={16} />,
      color: "bg-revalpro-green/20 text-revalpro-green",
      hoverColor: "hover:bg-revalpro-green/30"
    },
    { 
      href: "/cpd", 
      label: "CPD", 
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
    { 
      href: "/nmc-registration-check", 
      label: "Check NMC PIN", 
      icon: <Heart size={16} />,
      color: "bg-revalpro-red/20 text-revalpro-red",
      hoverColor: "hover:bg-revalpro-red/30"
    },
    { 
      href: "/revalidation-dates", 
      label: "Reval Dates", 
      icon: <Calendar size={16} />,
      color: "bg-revalpro-orange/20 text-revalpro-orange",
      hoverColor: "hover:bg-revalpro-orange/30"
    },
    { 
      href: "/nmc-resources", 
      label: "NMC Links", 
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
    { 
      href: "/subscription", 
      label: "Subscription", 
      icon: <CreditCard size={16} />,
      color: "bg-revalpro-fuchsia/20 text-revalpro-fuchsia",
      hoverColor: "hover:bg-revalpro-fuchsia/30"
    },
    { 
      href: "/summary-infographic", 
      label: "Export Infographic", 
      icon: <BarChart3 size={16} />,
      color: "bg-revalpro-orange/20 text-revalpro-orange",
      hoverColor: "hover:bg-revalpro-orange/30"
    },
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
    },
    { 
      href: "/settings", 
      label: "Settings", 
      icon: <SettingsIcon size={16} />,
      color: "bg-gray-200 text-gray-700",
      hoverColor: "hover:bg-gray-300"
    },
  ];

  // Add admin panel link for super admins
  const links = [...baseLinks];
  if (user?.isSuperAdmin || user?.isAdmin) {
    links.push({
      href: "/admin",
      label: "Admin Panel",
      icon: <Shield size={16} />,
      color: "bg-red-200 text-red-700",
      hoverColor: "hover:bg-red-300"
    });
  }

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
              {links.map((link) => {
                const isActive = currentPath === link.href;
                return (
                  <motion.div 
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20, 
                      delay: Math.random() * 0.2 // Staggered appearance
                    }}
                    whileHover={{ 
                      scale: 1.03,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link href={link.href}>
                      <div 
                        className={cn(
                          "px-4 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer flex items-center gap-3 relative overflow-hidden",
                          isActive
                            ? `${link.color} ring-2 ring-offset-1 shadow-sm`
                            : `text-gray-600 hover:${link.color.split(' ')[0]} ${link.hoverColor}`
                        )}
                      >
                        <motion.span
                          animate={{ 
                            rotate: isActive ? [0, 10, -10, 0] : 0,
                            scale: isActive ? [1, 1.2, 1] : 1
                          }}
                          transition={{ 
                            duration: 0.5, 
                            ease: "easeInOut", 
                            delay: 0.1 
                          }}
                          className="inline-flex"
                        >
                          {link.icon}
                        </motion.span>
                        <span className="text-sm">{link.label}</span>
                        
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 bg-white pointer-events-none rounded-lg"
                            initial={{ opacity: 0 }}
                            animate={{ 
                              opacity: [0, 0.2, 0],
                              scale: [0.8, 1.2, 1] 
                            }}
                            transition={{ 
                              duration: 2, 
                              ease: "easeInOut", 
                              repeat: Infinity,
                              repeatType: "reverse" 
                            }}
                          />
                        )}
                      </div>
                    </Link>
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

  // Render horizontal navigation (original implementation)
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex overflow-x-auto whitespace-nowrap hide-scrollbar">
            {links.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <motion.div 
                  key={link.href} 
                  className="mr-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20, 
                    delay: Math.random() * 0.2 // Staggered appearance
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={link.href}>
                    <div 
                      className={cn(
                        "px-3 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer inline-flex items-center gap-1.5 relative overflow-hidden",
                        isActive
                          ? `${link.color} ring-2 ring-offset-1 shadow-sm`
                          : `text-gray-600 hover:${link.color.split(' ')[0]} ${link.hoverColor}`
                      )}
                    >
                      <motion.span
                        animate={{ 
                          rotate: isActive ? [0, 10, -10, 0] : 0,
                          scale: isActive ? [1, 1.2, 1] : 1
                        }}
                        transition={{ 
                          duration: 0.5, 
                          ease: "easeInOut", 
                          delay: 0.1 
                        }}
                        className="inline-flex"
                      >
                        {link.icon}
                      </motion.span>
                      <span className="text-sm">{link.label}</span>
                      
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-white pointer-events-none rounded-full"
                          initial={{ opacity: 0 }}
                          animate={{ 
                            opacity: [0, 0.2, 0],
                            scale: [0.8, 1.2, 1] 
                          }}
                          transition={{ 
                            duration: 2, 
                            ease: "easeInOut", 
                            repeat: Infinity,
                            repeatType: "reverse" 
                          }}
                        />
                      )}
                    </div>
                  </Link>
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
