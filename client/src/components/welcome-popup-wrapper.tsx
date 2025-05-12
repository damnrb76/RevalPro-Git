import { useAuth } from "@/hooks/use-auth";
import TesterWelcomePopup from "./tester-welcome-popup";

export default function WelcomePopupWrapper() {
  const { user } = useAuth();
  
  // Only render the popup component when user is logged in
  if (!user) return null;
  
  return <TesterWelcomePopup />;
}