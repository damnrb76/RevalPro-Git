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
            <Link key={link.href} href={link.href}>
              <a 
                className={cn(
                  "px-4 py-2 font-medium transition-colors",
                  currentPath === link.href
                    ? "text-nhs-blue border-b-2 border-nhs-blue"
                    : "text-nhs-dark-grey hover:text-nhs-blue hover:border-b-2 hover:border-nhs-blue/50"
                )}
              >
                {link.label}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
