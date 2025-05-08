import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, HelpCircle, MoonStar, Sun } from "lucide-react";
import { userProfileStorage } from "@/lib/storage";
import { useTheme } from "@/components/ui/theme-provider";
import AssistantButton from "@/components/ai/assistant-button";

type HeaderProps = {
  logo: string;
};

export default function Header({ logo }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [initials, setInitials] = useState("NU");
  
  // Fetch user profile
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      return userProfileStorage.getCurrent();
    },
  });
  
  useEffect(() => {
    if (userProfile?.name) {
      // Get initials from name
      const nameParts = userProfile.name.split(' ');
      if (nameParts.length >= 2) {
        setInitials(`${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`);
      } else if (nameParts.length === 1) {
        setInitials(nameParts[0].substring(0, 2));
      }
    }
  }, [userProfile]);
  
  return (
    <header className="bg-gradient-to-r from-revalpro-dark-blue to-revalpro-blue shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <div className="h-12 w-12 mr-3 rounded-full overflow-hidden shadow-md">
              <img 
                src={logo} 
                alt="RevalPro Logo" 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="text-white font-bold text-2xl leading-tight">
                RevalPro
              </div>
              <div className="text-revalpro-white/80 text-xs">
                Nursing Revalidation Assistance App
              </div>
            </div>
          </div>
        </Link>
        
        <div className="flex items-center">
          <div className="text-white mr-4 hidden md:block">
            {userProfile?.name || "Welcome"}
          </div>
          
          <div className="mr-3 hidden sm:block">
            <AssistantButton variant="secondary" size="sm" />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-2 rounded-full bg-revalpro-purple text-white hover:bg-revalpro-purple/90">
                <Avatar className="h-8 w-8 bg-revalpro-purple text-white border-2 border-white">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <Link href="/settings?tab=profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <MoonStar className="mr-2 h-4 w-4" />
                    <span>Dark Mode</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="sm:hidden block">
                <AssistantButton variant="ghost" className="w-full justify-start p-0 hover:bg-transparent" />
              </DropdownMenuItem>
              <a 
                href="https://www.nmc.org.uk/revalidation/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>NMC Help</span>
                </DropdownMenuItem>
              </a>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
