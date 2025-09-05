import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { formatDateShort } from "@/lib/date-utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, PlusCircle, AlertTriangle, Clock, CheckCircle2, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { feedbackRecordsStorage } from "@/lib/storage";
import FeedbackForm from "@/components/forms/feedback-form";
import type { FeedbackRecord } from "@shared/schema";

export default function FeedbackPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FeedbackRecord | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch feedback records
  const { data: feedbackRecords, isLoading } = useQuery({
    queryKey: ['feedbackRecords'],
    queryFn: async () => {
      const records = await feedbackRecordsStorage.getAll();
      // Sort by most recent date
      return records.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    },
  });
  
  // Get record count
  const { data: feedbackCount = 0 } = useQuery({
    queryKey: ['feedbackCount'],
    queryFn: async () => {
      return feedbackRecordsStorage.getCount();
    },
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await feedbackRecordsStorage.remove(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbackRecords'] });
      queryClient.invalidateQueries({ queryKey: ['feedbackCount'] });
      toast({
        title: "Record deleted",
        description: "The feedback record has been deleted.",
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
  
  const handleEdit = (record: FeedbackRecord) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };
  
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingRecord(null);
  };
  
  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingRecord(null);
    queryClient.invalidateQueries({ queryKey: ['feedbackRecords'] });
    queryClient.invalidateQueries({ queryKey: ['feedbackCount'] });
  };
  
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-nhs-black">Practice-Related Feedback</h1>
          <p className="text-nhs-dark-grey">Record feedback you've received about your practice</p>
        </div>
        <Button 
          className="mt-4 md:mt-0" 
          onClick={() => setIsFormOpen(true)}
          disabled={isFormOpen}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Feedback
        </Button>
      </div>
      
      {/* Summary Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Feedback Summary</CardTitle>
          <CardDescription>
            You need 5 pieces of practice-related feedback for revalidation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-nhs-dark-grey mb-2">Feedback Records</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-nhs-blue">{feedbackCount}</span>
                <span className="ml-2 text-nhs-dark-grey">/5 required</span>
              </div>
              
              <div className="mt-3 progress-bar">
                <div 
                  className={`progress-fill ${feedbackCount >= 5 ? 'bg-nhs-green' : 'bg-nhs-blue'}`} 
                  style={{ width: `${Math.min(feedbackCount / 5 * 100, 100)}%` }}
                ></div>
              </div>
              
              <div className="mt-4 flex items-center">
                {feedbackCount >= 5 ? (
                  <CheckCircle2 className="text-nhs-green h-5 w-5 mr-2" />
                ) : (
                  <Clock className="text-nhs-warm-yellow h-5 w-5 mr-2" />
                )}
                <span className="text-nhs-dark-grey">
                  {feedbackCount >= 5 
                    ? "Requirement met" 
                    : `${5 - feedbackCount} more records needed`}
                </span>
              </div>
            </div>
            
            <div className="flex-shrink-0 p-4 bg-nhs-pale-grey rounded-lg max-w-sm">
              <h3 className="font-semibold text-nhs-black mb-2">Feedback Sources</h3>
              <p className="text-sm text-nhs-dark-grey">
                The NMC encourages you to collect feedback from a variety of sources including:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm text-nhs-dark-grey">
                <li>Patients or service users</li>
                <li>Colleagues (nurses, midwives, other healthcare professionals)</li>
                <li>Students</li>
                <li>Management or team leaders</li>
                <li>Annual appraisals</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Information Alert */}
      <Alert className="mb-6 bg-nhs-pale-grey border-nhs-light-blue">
        <InfoIcon className="h-4 w-4 text-nhs-light-blue" />
        <AlertTitle>NMC Requirement</AlertTitle>
        <AlertDescription>
          You must collect at least five pieces of practice-related feedback in the three-year period since your 
          last registration renewal or since joining the register.
        </AlertDescription>
      </Alert>
      
      {/* Feedback Records List */}
      <Tabs defaultValue="list" className="mb-6">
        <TabsList>
          <TabsTrigger value="list">All Records</TabsTrigger>
          <TabsTrigger value="info">Guidelines</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          {isLoading ? (
            <div className="text-center p-8">Loading feedback records...</div>
          ) : feedbackRecords && feedbackRecords.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-nhs-pale-grey">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Source</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Content</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nhs-pale-grey">
                  {feedbackRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-nhs-dark-grey">
                        {formatDateShort(record.date)}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-nhs-black">
                        {record.source}
                      </td>
                      <td className="px-4 py-4 text-sm text-nhs-dark-grey max-w-xs truncate">
                        {record.content}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(record)}
                          >
                            View/Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(record.id)}
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
                  <h3 className="text-lg font-semibold mb-2">No Feedback Records</h3>
                  <p className="text-nhs-dark-grey mb-4">
                    You haven't recorded any practice-related feedback yet. Add feedback you've received
                    to track your progress toward the 5 required pieces.
                  </p>
                  <Button onClick={() => setIsFormOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Guidelines</CardTitle>
              <CardDescription>
                Information about recording feedback for NMC revalidation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-nhs-black mb-2">What counts as feedback?</h3>
                <p className="text-nhs-dark-grey">
                  Feedback can come from patients, service users, carers, students, colleagues and managers. 
                  It can be written or verbal, formal or informal, solicited or unsolicited.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-nhs-black mb-2">Types of feedback:</h3>
                <ul className="list-disc pl-5 text-nhs-dark-grey">
                  <li>Comments or letters from patients/service users</li>
                  <li>Team performance reports</li>
                  <li>Feedback from teaching sessions or mentoring</li>
                  <li>Annual appraisal documentation</li>
                  <li>Formal or informal reviews from colleagues</li>
                  <li>Complaints or compliments</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-nhs-black mb-2">Record keeping:</h3>
                <p className="text-nhs-dark-grey">
                  For each piece of feedback, record the date received, the source of the feedback, and a brief 
                  description of the content. It's helpful to include your reflection on the feedback and how 
                  it affected your practice.
                </p>
              </div>
              
              <div className="bg-nhs-pale-grey p-4 rounded-md">
                <h3 className="font-semibold text-nhs-black mb-2">Confidentiality:</h3>
                <p className="text-nhs-dark-grey mb-2">
                  When recording feedback, ensure you maintain confidentiality and anonymise personal information 
                  about patients, service users, colleagues or others.
                </p>
              </div>
              
              <div className="bg-nhs-pale-grey p-4 rounded-md">
                <h3 className="font-semibold text-nhs-black mb-2">Official NMC Guidance:</h3>
                <p className="text-nhs-dark-grey mb-2">
                  For more detailed information about feedback requirements, refer to the 
                  official NMC revalidation guidance.
                </p>
                <a 
                  href="https://www.nmc.org.uk/revalidation/requirements/practice-related-feedback/"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-nhs-blue hover:underline"
                >
                  Visit NMC Feedback Guidance →
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      
      {/* Feedback Form Dialog */}
      {isFormOpen && (
        <FeedbackForm 
          initialData={editingRecord}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </main>
  );
}
