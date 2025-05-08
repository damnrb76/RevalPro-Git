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

export default function Header() {
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
    <header className="bg-nhs-blue shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <div className="text-white font-bold text-xl mr-2">NurseValidate UK</div>
            <span className="bg-white text-nhs-blue text-xs px-2 py-1 rounded">NMC</span>
          </div>
        </Link>
        
        <div className="flex items-center">
          <div className="text-white mr-4 hidden md:block">
            {userProfile?.name || "Welcome"}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-2 rounded-full bg-nhs-dark-blue text-white hover:bg-nhs-dark-blue/90">
                <Avatar className="h-8 w-8 bg-nhs-dark-blue text-white border-2 border-white">
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
