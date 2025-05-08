import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { formatDateShort } from "@/lib/date-utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, PlusCircle, AlertTriangle, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { practiceHoursStorage } from "@/lib/storage";
import PracticeHoursForm from "@/components/forms/practice-hours-form";
import type { PracticeHours } from "@shared/schema";

export default function PracticeHoursPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHours, setEditingHours] = useState<PracticeHours | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch practice hours
  const { data: practiceHours, isLoading } = useQuery({
    queryKey: ['practiceHours'],
    queryFn: async () => {
      const hours = await practiceHoursStorage.getAll();
      // Sort by most recent end date
      return hours.sort((a, b) => 
        new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
      );
    },
  });
  
  // Calculate total hours
  const { data: totalHours } = useQuery({
    queryKey: ['practiceHoursTotal'],
    queryFn: async () => {
      return practiceHoursStorage.getTotalHours();
    },
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await practiceHoursStorage.remove(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['practiceHours'] });
      queryClient.invalidateQueries({ queryKey: ['practiceHoursTotal'] });
      toast({
        title: "Record deleted",
        description: "The practice hours record has been deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete record: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleEdit = (hours: PracticeHours) => {
    setEditingHours(hours);
    setIsFormOpen(true);
  };
  
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingHours(null);
  };
  
  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingHours(null);
    queryClient.invalidateQueries({ queryKey: ['practiceHours'] });
    queryClient.invalidateQueries({ queryKey: ['practiceHoursTotal'] });
  };
  
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-nhs-black">Practice Hours</h1>
          <p className="text-nhs-dark-grey">Record your nursing practice hours for revalidation</p>
        </div>
        <Button 
          className="mt-4 md:mt-0" 
          onClick={() => setIsFormOpen(true)}
          disabled={isFormOpen}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Practice Hours
        </Button>
      </div>
      
      {/* Summary Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Practice Hours Summary</CardTitle>
          <CardDescription>
            You need 450 practice hours for revalidation (900 hours for dual registration)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h3 className="text-nhs-dark-grey mb-2">Total Hours Recorded</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-nhs-blue">{totalHours || 0}</span>
                <span className="ml-2 text-nhs-dark-grey">/450 required</span>
              </div>
              
              <div className="mt-3 progress-bar">
                <div 
                  className={`progress-fill ${totalHours && totalHours >= 450 ? 'bg-nhs-green' : 'bg-nhs-blue'}`} 
                  style={{ width: `${Math.min((totalHours || 0) / 450 * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            {totalHours !== undefined && (
              <div className="flex-shrink-0 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  {totalHours >= 450 ? (
                    <>
                      <div className="mr-3 text-nhs-green">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-nhs-black">Requirement Met</h4>
                        <p className="text-sm text-nhs-dark-grey">You have met the required practice hours</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mr-3 text-nhs-warm-yellow">
                        <Clock className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-nhs-black">In Progress</h4>
                        <p className="text-sm text-nhs-dark-grey">
                          {450 - (totalHours || 0)} more hours needed
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Information Alert */}
      <Alert className="mb-6 bg-nhs-pale-grey border-nhs-light-blue">
        <InfoIcon className="h-4 w-4 text-nhs-light-blue" />
        <AlertTitle>NMC Requirement</AlertTitle>
        <AlertDescription>
          You must have practiced for a minimum of 450 hours (or 900 hours if you have dual registration) 
          in the three-year period since your last registration renewal or since joining the register.
        </AlertDescription>
      </Alert>
      
      {/* Practice Hours List */}
      <Tabs defaultValue="list" className="mb-6">
        <TabsList>
          <TabsTrigger value="list">All Records</TabsTrigger>
          <TabsTrigger value="info">Guidelines</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          {isLoading ? (
            <div className="text-center p-8">Loading practice hours...</div>
          ) : practiceHours && practiceHours.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-nhs-pale-grey">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Period</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Hours</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Work Setting</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Scope</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nhs-pale-grey">
                  {practiceHours.map((hours) => (
                    <tr key={hours.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-nhs-dark-grey">
                        {formatDateShort(hours.startDate)} - {formatDateShort(hours.endDate)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-nhs-black">
                        {hours.hours}
                      </td>
                      <td className="px-4 py-4 text-sm text-nhs-dark-grey">
                        {hours.workSetting}
                      </td>
                      <td className="px-4 py-4 text-sm text-nhs-dark-grey">
                        {hours.scope}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(hours)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(hours.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center p-6">
                  <AlertTriangle className="mx-auto h-12 w-12 text-nhs-warm-yellow mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Practice Hours Recorded</h3>
                  <p className="text-nhs-dark-grey mb-4">
                    You haven't recorded any practice hours yet. Add your nursing practice hours to track your progress toward the 450 required hours.
                  </p>
                  <Button onClick={() => setIsFormOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Practice Hours
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Practice Hours Guidelines</CardTitle>
              <CardDescription>
                Information about recording your practice hours for NMC revalidation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-nhs-black mb-2">What counts as practice hours?</h3>
                <p className="text-nhs-dark-grey">
                  Practice hours can be clinical or non-clinical practice. This can include roles in direct care, management, education, policy, or research.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-nhs-black mb-2">Requirements:</h3>
                <ul className="list-disc pl-5 text-nhs-dark-grey">
                  <li>450 hours of practice over the three-year period since your last registration</li>
                  <li>900 hours if you are registered as both a nurse and midwife (dual registration)</li>
                  <li>Hours must be relevant to your current scope of practice</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-nhs-black mb-2">Record keeping:</h3>
                <p className="text-nhs-dark-grey">
                  Keep a record of your practice hours including the dates, number of hours, work setting, and scope of practice.
                </p>
              </div>
              
              <div className="bg-nhs-pale-grey p-4 rounded-md">
                <h3 className="font-semibold text-nhs-black mb-2">Official NMC Guidance:</h3>
                <p className="text-nhs-dark-grey mb-2">
                  For more detailed information about practice hours requirements, refer to the 
                  official NMC revalidation guidance.
                </p>
                <a 
                  href="https://www.nmc.org.uk/revalidation/"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-nhs-blue hover:underline"
                >
                  Visit NMC Revalidation Website →
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Practice Hours Form Dialog */}
      {isFormOpen && (
        <PracticeHoursForm 
          initialData={editingHours}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </main>
  );
}
