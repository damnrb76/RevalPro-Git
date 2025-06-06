import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";

interface BetaApplication {
  id: number;
  name: string;
  email: string;
  nmcPin: string;
  nursingSpecialty: string;
  workLocation: string;
  experience: string;
  currentChallenges: string;
  expectations: string;
  testingAvailability: string;
  agreeToTerms: boolean;
  allowContact: boolean;
  submittedAt: string;
}

export default function BetaApplicationsPage() {
  // Fetch beta applications without authentication requirement
  const { data: betaApplications, isLoading } = useQuery<BetaApplication[]>({
    queryKey: ["/api/beta-applications"],
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <Eye className="h-8 w-8 text-revalpro-blue" />
        <div>
          <h1 className="text-3xl font-bold text-revalpro-blue">Beta Applications</h1>
          <p className="text-muted-foreground">
            View all submitted beta tester applications ({betaApplications?.length || 0} total)
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Beta Applications ({betaApplications?.length || 0})
          </CardTitle>
          <CardDescription>
            All submitted beta tester applications from your Facebook advertising campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : betaApplications && betaApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>NMC PIN</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Work Location</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Challenges</TableHead>
                    <TableHead>Expectations</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {betaApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">
                        {application.name}
                      </TableCell>
                      <TableCell>
                        <a href={`mailto:${application.email}`} className="text-blue-600 hover:underline">
                          {application.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        {application.nmcPin || "Not provided"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {application.nursingSpecialty}
                        </Badge>
                      </TableCell>
                      <TableCell>{application.workLocation}</TableCell>
                      <TableCell>{application.experience}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {application.currentChallenges}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {application.expectations}
                      </TableCell>
                      <TableCell>{application.testingAvailability}</TableCell>
                      <TableCell>
                        {new Date(application.submittedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-500">
                Beta tester applications will appear here once submitted through your beta signup form.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Share your beta signup link: <code className="bg-gray-100 px-2 py-1 rounded">/beta-signup</code>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}