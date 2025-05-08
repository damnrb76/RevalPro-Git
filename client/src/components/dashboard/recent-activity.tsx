import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { formatDateShort } from "@/lib/date-utils";
import { 
  practiceHoursStorage, 
  cpdRecordsStorage, 
  feedbackRecordsStorage, 
  reflectiveAccountsStorage 
} from "@/lib/storage";

type ActivityRecord = {
  id: number;
  date: Date | string;
  category: string;
  activity: string;
  status: "Completed" | "In Progress";
};

export default function RecentActivity() {
  const [recentActivities, setRecentActivities] = useState<ActivityRecord[]>([]);
  
  // Fetch practice hours
  const { data: practiceHours } = useQuery({
    queryKey: ['practiceHours'],
    queryFn: async () => {
      const hours = await practiceHoursStorage.getAll();
      return hours.map(record => ({
        id: record.id,
        date: record.endDate, // Use end date for practice hours
        category: "Practice Hours",
        activity: `${record.workSetting} - ${record.scope}`,
        status: "Completed" as const,
      }));
    },
  });
  
  // Fetch CPD records
  const { data: cpdRecords } = useQuery({
    queryKey: ['cpdRecords'],
    queryFn: async () => {
      const records = await cpdRecordsStorage.getAll();
      return records.map(record => ({
        id: record.id,
        date: record.date,
        category: "CPD",
        activity: record.title,
        status: "Completed" as const,
      }));
    },
  });
  
  // Fetch feedback records
  const { data: feedbackRecords } = useQuery({
    queryKey: ['feedbackRecords'],
    queryFn: async () => {
      const records = await feedbackRecordsStorage.getAll();
      return records.map(record => ({
        id: record.id,
        date: record.date,
        category: "Feedback",
        activity: `${record.source}`,
        status: "Completed" as const,
      }));
    },
  });
  
  // Fetch reflective accounts
  const { data: reflections } = useQuery({
    queryKey: ['reflections'],
    queryFn: async () => {
      const records = await reflectiveAccountsStorage.getAll();
      return records.map(record => ({
        id: record.id,
        date: record.date,
        category: "Reflection",
        activity: record.title,
        status: "Completed" as const,
      }));
    },
  });
  
  // Combine and sort all activities
  useEffect(() => {
    const allActivities = [
      ...(practiceHours || []),
      ...(cpdRecords || []),
      ...(feedbackRecords || []),
      ...(reflections || []),
    ];
    
    // Sort by date (most recent first)
    const sortedActivities = allActivities.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    
    // Take only the 5 most recent activities
    setRecentActivities(sortedActivities.slice(0, 5));
  }, [practiceHours, cpdRecords, feedbackRecords, reflections]);
  
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-nhs-black">Recent Activity</h2>
        <Link href="/">
          <a className="text-nhs-blue text-sm hover:underline">View All</a>
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {recentActivities.length > 0 ? (
          <table className="min-w-full">
            <thead className="bg-nhs-pale-grey">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nhs-pale-grey">
              {recentActivities.map((activity, index) => (
                <tr key={`${activity.category}-${activity.id}-${index}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-nhs-dark-grey">
                    {formatDateShort(activity.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-nhs-dark-grey">
                    {activity.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-nhs-dark-grey">
                    {activity.activity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      variant={activity.status === "Completed" ? "completed" : "in-progress"}
                    >
                      {activity.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center">
            <p className="text-nhs-dark-grey">No recent activity found.</p>
            <p className="text-sm text-nhs-dark-grey mt-1">
              Start recording your revalidation activities to see them here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
