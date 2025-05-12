import { useAuth } from "@/hooks/use-auth";
import TesterWelcomePopup from "./tester-welcome-popup";
import { useEffect, useState } from "react";

export default function WelcomePopupWrapper() {
  const { user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  
  useEffect(() => {
    // Only show popup when user is authenticated and no welcome has been shown this session
    if (user && !sessionStorage.getItem("hasSeenTesterWelcome")) {
      // Small delay to ensure the user is fully logged in
      const timer = setTimeout(() => {
        setShowPopup(true);
        // Mark that the welcome has been shown this session
        sessionStorage.setItem("hasSeenTesterWelcome", "true");
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [user]);
  
  if (!showPopup) return null;
  
  return <TesterWelcomePopup />;
}