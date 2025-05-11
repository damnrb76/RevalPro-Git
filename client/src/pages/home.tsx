import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import AlertBanner from "@/components/dashboard/alert-banner";
import RevalidationSummary from "@/components/dashboard/revalidation-summary";
import DashboardVisualizations from "@/components/dashboard/dashboard-visualizations";
import RequirementsSection from "@/components/dashboard/requirements-section";
import RecentActivity from "@/components/dashboard/recent-activity";
import NmcGuidance from "@/components/dashboard/nmc-guidance";
import FaqSection from "@/components/dashboard/faq-section";
import NhsAiAssistant from "@/components/ai/nhs-ai-assistant";
import { AnimatedSection } from "@/components/ui/animated-card";
import { 
  userProfileStorage, 
  practiceHoursStorage, 
  cpdRecordsStorage, 
  feedbackRecordsStorage, 
  reflectiveAccountsStorage,
  reflectiveDiscussionStorage,
  healthDeclarationStorage,
  confirmationStorage
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
  
  const { data: reflectiveDiscussionCompleted } = useQuery({
    queryKey: ['reflectiveDiscussionCompleted'],
    queryFn: async () => {
      return reflectiveDiscussionStorage.isCompleted();
    },
  });
  
  const { data: healthDeclarationCompleted } = useQuery({
    queryKey: ['healthDeclarationCompleted'],
    queryFn: async () => {
      return healthDeclarationStorage.isCompleted();
    },
  });
  
  const { data: confirmationCompleted } = useQuery({
    queryKey: ['confirmationCompleted'],
    queryFn: async () => {
      return confirmationStorage.isCompleted();
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AlertBanner 
            expiryDate={new Date(userProfile.expiryDate)} 
            daysRemaining={daysUntil} 
          />
        </motion.div>
      )}
      
      {/* Revalidation Summary */}
      <AnimatedSection className="mb-6">
        <RevalidationSummary 
          userProfile={userProfile || null}
          practiceHours={practiceHoursTotal || 0}
          cpdHours={cpdHoursTotal || 0}
          participatoryHours={cpdParticipatory || 0}
          feedbackCount={feedbackCount || 0}
          reflectionsCount={reflectionsCount || 0}
          reflectiveDiscussionCompleted={reflectiveDiscussionCompleted || false}
          healthDeclarationCompleted={healthDeclarationCompleted || false}
          confirmationCompleted={confirmationCompleted || false}
        />
      </AnimatedSection>
      
      {/* Dashboard Visualizations */}
      <AnimatedSection className="mb-6">
        <DashboardVisualizations 
          userProfile={userProfile || null}
          practiceHours={practiceHoursTotal || 0}
          cpdHours={cpdHoursTotal || 0}
          participatoryHours={cpdParticipatory || 0}
          feedbackCount={feedbackCount || 0}
          reflectionsCount={reflectionsCount || 0}
          reflectiveDiscussionCompleted={reflectiveDiscussionCompleted || false}
          healthDeclarationCompleted={healthDeclarationCompleted || false}
          confirmationCompleted={confirmationCompleted || false}
        />
      </AnimatedSection>
      
      {/* Requirements Cards */}
      <AnimatedSection className="mb-6">
        <RequirementsSection 
          practiceHours={practiceHoursTotal || 0}
          cpdHours={cpdHoursTotal || 0}
          participatoryHours={cpdParticipatory || 0}
          feedbackCount={feedbackCount || 0}
          reflectionsCount={reflectionsCount || 0}
        />
      </AnimatedSection>
      
      {/* NHS AI Assistant */}
      <AnimatedSection className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <RecentActivity />
          </motion.div>
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <NhsAiAssistant />
          </motion.div>
        </div>
      </AnimatedSection>
      
      {/* NMC Guidance */}
      <AnimatedSection className="mb-6">
        <NmcGuidance />
      </AnimatedSection>
      
      {/* FAQ Section */}
      <AnimatedSection className="mb-6">
        <FaqSection />
      </AnimatedSection>
    </main>
  );
}
