import { useAuth } from "@/hooks/use-auth";
import TesterWelcomePopup from "./tester-welcome-popup";
import { useEffect, useState } from "react";

export default function WelcomePopupWrapper() {
  const { user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  
  useEffect(() => {
    // Show popup when user is authenticated, always show for testing
    if (user) {
      console.log("User is logged in, showing welcome popup");
      // Small delay to ensure the user is fully logged in
      const timer = setTimeout(() => {
        setShowPopup(true);
        // During development, don't set the session storage to allow testing
        // sessionStorage.setItem("hasSeenTesterWelcome", "true");
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [user]);
  
  if (!showPopup) return null;
  
  return <TesterWelcomePopup />;
}