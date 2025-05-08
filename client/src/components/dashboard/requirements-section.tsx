import RequirementsCard from "./requirements-card";
import type { RevalidationStatus } from "@shared/schema";

type RequirementsSectionProps = {
  practiceHours: number;
  cpdHours: number;
  participatoryHours: number;
  feedbackCount: number;
  reflectionsCount: number;
};

export default function RequirementsSection({
  practiceHours,
  cpdHours,
  participatoryHours,
  feedbackCount,
  reflectionsCount
}: RequirementsSectionProps) {
  // Determine status for each requirement
  const getHoursStatus = (): RevalidationStatus => {
    if (practiceHours >= 450) return "completed";
    if (practiceHours > 0) return "in_progress";
    return "not_started";
  };
  
  const getCpdStatus = (): RevalidationStatus => {
    if (cpdHours >= 35) return "completed";
    if (cpdHours > 0) return "in_progress";
    return "not_started";
  };
  
  const getFeedbackStatus = (): RevalidationStatus => {
    if (feedbackCount >= 5) return "completed";
    if (feedbackCount > 0) return "in_progress";
    return "not_started";
  };
  
  const getReflectionsStatus = (): RevalidationStatus => {
    if (reflectionsCount >= 5) return "completed";
    if (reflectionsCount > 0 && reflectionsCount < 3) return "attention_needed";
    if (reflectionsCount > 0) return "in_progress";
    return "not_started";
  };
  
  const getDiscussionStatus = (): RevalidationStatus => {
    // Discussion would be fetched from the API in a real implementation
    return "not_started";
  };
  
  const getHealthCharacterStatus = (): RevalidationStatus => {
    // Health & Character would be fetched from the API in a real implementation
    return "not_started";
  };
  
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-nhs-black mb-4">Revalidation Requirements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RequirementsCard
          title="Practice Hours"
          description="Complete 450 practice hours (or 900 if dual registration)."
          completed={practiceHours}
          total={450}
          unit="hours"
          status={getHoursStatus()}
          linkHref="/practice-hours"
          linkText="Add Practice Hours"
        />
        
        <RequirementsCard
          title="CPD"
          description="Complete 35 hours of CPD including 20 participatory learning."
          completed={cpdHours}
          total={35}
          unit="hours"
          additionalInfo={`${participatoryHours} participatory`}
          status={getCpdStatus()}
          linkHref="/cpd"
          linkText="Add CPD Activity"
        />
        
        <RequirementsCard
          title="Practice Feedback"
          description="Collect 5 pieces of feedback about your practice."
          completed={feedbackCount}
          total={5}
          unit="feedback records"
          status={getFeedbackStatus()}
          linkHref="/feedback"
          linkText="Add Feedback"
        />
        
        <RequirementsCard
          title="Reflective Accounts"
          description="Write 5 reflective accounts relating to The Code."
          completed={reflectionsCount}
          total={5}
          unit="reflections"
          status={getReflectionsStatus()}
          linkHref="/reflections"
          linkText="Add Reflection"
        />
        
        <RequirementsCard
          title="Reflective Discussion"
          description="Have a reflective discussion with another NMC registrant."
          completed={0}
          total={1}
          status={getDiscussionStatus()}
          linkHref="/reflections?tab=discussion"
          linkText="Record Discussion"
        />
        
        <RequirementsCard
          title="Health & Character"
          description="Complete health and character declarations."
          completed={0}
          total={1}
          status={getHealthCharacterStatus()}
          linkHref="/declarations"
          linkText="Complete Declaration"
        />
      </div>
    </section>
  );
}
