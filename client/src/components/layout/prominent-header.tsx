import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { ChevronDown, User, LogOut, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logoPath from "@assets/Leonardo_Phoenix_10_design_a_vibrant_and_professional_logo_for_3.jpg";

const ProminentHeader: React.FC = () => {
  const { user, logoutMutation } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-2 shadow-md bg-white' 
          : 'py-3 header-gradient text-white'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="logo-container relative h-14 w-14 bg-white p-0.5 rounded-full shadow-md">
              <img 
                src={logoPath} 
                alt="RevalPro Logo" 
                className="w-full h-full object-cover rounded-full"
              />
              {/* Animated ring */}
              <div className="absolute inset-0 rounded-full border-2 border-revalpro-blue/40 animate-pulse"></div>
            </div>
            <div>
              <h1 className={`text-2xl font-extrabold ${!scrolled ? 'text-white' : 'logo-text'}`}>
                RevalPro
              </h1>
              <p className={`text-xs ${!scrolled ? 'text-white/80' : 'text-gray-500'}`}>
                Nursing Revalidation Assistant
              </p>
            </div>
          </div>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium ${
                scrolled 
                  ? 'bg-revalpro-blue/10 text-revalpro-blue hover:bg-revalpro-blue/20' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}>
                <Avatar className="h-8 w-8 border-2 border-white/50">
                  <AvatarImage src={user.profilePicture || ""} alt={user.username} />
                  <AvatarFallback className="bg-revalpro-blue text-white">
                    {user.username ? user.username.substring(0, 2).toUpperCase() : "UK"}
                  </AvatarFallback>
                </Avatar>
                <span>{user.username}</span>
                <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/settings">
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem 
                  className="cursor-pointer text-red-500 hover:text-red-600"
                  onClick={() => logoutMutation.mutate()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
};

export default ProminentHeader;