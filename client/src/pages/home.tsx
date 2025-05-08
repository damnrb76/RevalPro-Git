import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AlertBanner from "@/components/dashboard/alert-banner";
import RevalidationSummary from "@/components/dashboard/revalidation-summary";
import RequirementsSection from "@/components/dashboard/requirements-section";
import RecentActivity from "@/components/dashboard/recent-activity";
import NmcGuidance from "@/components/dashboard/nmc-guidance";
import FaqSection from "@/components/dashboard/faq-section";
import { 
  userProfileStorage, 
  practiceHoursStorage, 
  cpdRecordsStorage, 
  feedbackRecordsStorage, 
  reflectiveAccountsStorage 
} from "@/lib/storage";
import { getDaysUntil } from "@/lib/date-utils";
import type { UserProfile } from "@shared/schema";

export default function Home() {
  const [daysUntil, setDaysUntil] = useState<number | null>(null);
  
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      return userProfileStorage.getCurrent();
    },
  });
  
  const { data: practiceHoursTotal } = useQuery({
    queryKey: ['practiceHoursTotal'],
    queryFn: async () => {
      return practiceHoursStorage.getTotalHours();
    },
  });
  
  const { data: cpdHoursTotal } = useQuery({
    queryKey: ['cpdHoursTotal'],
    queryFn: async () => {
      return cpdRecordsStorage.getTotalHours();
    },
  });
  
  const { data: cpdParticipatory } = useQuery({
    queryKey: ['cpdParticipatory'],
    queryFn: async () => {
      return cpdRecordsStorage.getParticipatoryHours();
    },
  });
  
  const { data: feedbackCount } = useQuery({
    queryKey: ['feedbackCount'],
    queryFn: async () => {
      return feedbackRecordsStorage.getCount();
    },
  });
  
  const { data: reflectionsCount } = useQuery({
    queryKey: ['reflectionsCount'],
    queryFn: async () => {
      return reflectiveAccountsStorage.getCount();
    },
  });

  // Calculate days until revalidation when profile changes
  useEffect(() => {
    if (userProfile && userProfile.expiryDate) {
      const expiryDate = new Date(userProfile.expiryDate);
      setDaysUntil(getDaysUntil(expiryDate));
    }
  }, [userProfile]);

  return (
    <main className="container mx-auto px-4 py-6">
      {/* Alert Banner - show only if expiry date is available */}
      {userProfile && daysUntil !== null && daysUntil > 0 && (
        <AlertBanner 
          expiryDate={new Date(userProfile.expiryDate)} 
          daysRemaining={daysUntil} 
        />
      )}
      
      {/* Revalidation Summary */}
      <RevalidationSummary 
        userProfile={userProfile}
        practiceHours={practiceHoursTotal || 0}
        cpdHours={cpdHoursTotal || 0}
        participatoryHours={cpdParticipatory || 0}
        feedbackCount={feedbackCount || 0}
        reflectionsCount={reflectionsCount || 0}
      />
      
      {/* Requirements Cards */}
      <RequirementsSection 
        practiceHours={practiceHoursTotal || 0}
        cpdHours={cpdHoursTotal || 0}
        participatoryHours={cpdParticipatory || 0}
        feedbackCount={feedbackCount || 0}
        reflectionsCount={reflectionsCount || 0}
      />
      
      {/* Recent Activity */}
      <RecentActivity />
      
      {/* NMC Guidance */}
      <NmcGuidance />
      
      {/* FAQ Section */}
      <FaqSection />
    </main>
  );
}
