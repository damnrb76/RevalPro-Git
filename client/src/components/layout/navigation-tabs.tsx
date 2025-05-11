import { Link } from "wouter";
import { cn } from "@/lib/utils";
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
  Download,
  BarChart3
} from 'lucide-react';

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
  const links: NavigationLink[] = [
    { 
      href: "/", 
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
      label: "Feedback Form", 
      icon: <MessageCircle size={16} />,
      color: "bg-amber-200 text-amber-700",
      hoverColor: "hover:bg-amber-300"
    },
    { 
      href: "/settings", 
      label: "Settings", 
      icon: <SettingsIcon size={16} />,
      color: "bg-gray-200 text-gray-700",
      hoverColor: "hover:bg-gray-300"
    },
  ];
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto whitespace-nowrap py-2 hide-scrollbar">
          {links.map((link) => {
            const isActive = currentPath === link.href;
            return (
              <div key={link.href} className="mr-2">
                <Link href={link.href}>
                  <div 
                    className={cn(
                      "px-3 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer inline-flex items-center gap-1.5",
                      isActive
                        ? `${link.color} ring-2 ring-offset-1 shadow-sm`
                        : `text-gray-600 hover:${link.color.split(' ')[0]} ${link.hoverColor}`
                    )}
                  >
                    {link.icon}
                    <span className="text-sm">{link.label}</span>
                    {isActive && (
                      <span className="absolute inset-0 rounded-full animate-pulse opacity-30 bg-white pointer-events-none"></span>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
