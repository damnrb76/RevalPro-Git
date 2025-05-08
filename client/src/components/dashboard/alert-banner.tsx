import { useState } from "react";
import { X } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { formatDateFull } from "@/lib/date-utils";
import { getRevalidationNotificationPhase } from "@/lib/date-utils";

type AlertBannerProps = {
  expiryDate: Date;
  daysRemaining: number;
};

export default function AlertBanner({ expiryDate, daysRemaining }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed) {
    return null;
  }
  
  const phase = getRevalidationNotificationPhase(daysRemaining);
  
  // Determine banner color based on urgency
  const getBannerColor = () => {
    switch (phase) {
      case 'urgent':
        return 'bg-nhs-red';
      case 'warning':
        return 'bg-nhs-warm-yellow';
      case 'notice':
        return 'bg-nhs-light-blue';
      default:
        return 'bg-nhs-blue';
    }
  };
  
  // Determine text color based on banner color
  const getTextColor = () => {
    switch (phase) {
      case 'warning':
        return 'text-nhs-black';
      default:
        return 'text-white';
    }
  };
  
  return (
    <div className={`mb-6 ${getBannerColor()} p-4 rounded-md flex items-start ${getTextColor()}`}>
      <div className={`mr-3 mt-1 ${getTextColor()}`}>
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-bold">Revalidation deadline approaching</h3>
        <p className="text-sm">
          Your NMC revalidation is due in {daysRemaining} days on {formatDateFull(expiryDate)}. 
          Please complete all requirements.
        </p>
      </div>
      <button 
        className={`ml-auto ${getTextColor()} hover:opacity-70`}
        onClick={() => setDismissed(true)}
        aria-label="Dismiss notification"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
