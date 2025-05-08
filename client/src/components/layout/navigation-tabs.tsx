import { Link } from "wouter";
import { cn } from "@/lib/utils";

type NavigationTabsProps = {
  currentPath: string;
};

export default function NavigationTabs({ currentPath }: NavigationTabsProps) {
  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/practice-hours", label: "Practice Hours" },
    { href: "/cpd", label: "CPD" },
    { href: "/feedback", label: "Feedback" },
    { href: "/reflections", label: "Reflections" },
    { href: "/declarations", label: "Declarations" },
    { href: "/settings", label: "Settings" },
  ];
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto whitespace-nowrap py-2 hide-scrollbar">
          {links.map((link) => (
            <div key={link.href} className="mr-2">
              <Link href={link.href}>
                <span 
                  className={cn(
                    "px-4 py-2 font-medium transition-colors cursor-pointer inline-block",
                    currentPath === link.href
                      ? "text-revalpro-dark-blue border-b-2 border-revalpro-dark-blue"
                      : "text-revalpro-black/70 hover:text-revalpro-dark-blue hover:border-b-2 hover:border-revalpro-dark-blue/50"
                  )}
                >
                  {link.label}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
