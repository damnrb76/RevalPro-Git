import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { formatDateShort } from "@/lib/date-utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, PlusCircle, AlertTriangle, Clock, CheckCircle2, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cpdRecordsStorage } from "@/lib/storage";
import CpdForm from "@/components/forms/cpd-form";
import DocumentManager from "@/components/documents/document-manager";
import AIHelperCard from "@/components/ai/ai-helper-card";
import type { CpdRecord } from "@shared/schema";

export default function CPDPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CpdRecord | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch CPD records
  const { data: cpdRecords, isLoading } = useQuery({
    queryKey: ['cpdRecords'],
    queryFn: async () => {
      const records = await cpdRecordsStorage.getAll();
      // Sort by most recent date
      return records.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    },
  });
  
  // Calculate total hours
  const { data: totalHours = 0 } = useQuery({
    queryKey: ['cpdHoursTotal'],
    queryFn: async () => {
      return cpdRecordsStorage.getTotalHours();
    },
  });
  
  // Calculate participatory hours
  const { data: participatoryHours = 0 } = useQuery({
    queryKey: ['cpdParticipatory'],
    queryFn: async () => {
      return cpdRecordsStorage.getParticipatoryHours();
    },
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await cpdRecordsStorage.remove(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cpdRecords'] });
      queryClient.invalidateQueries({ queryKey: ['cpdHoursTotal'] });
      queryClient.invalidateQueries({ queryKey: ['cpdParticipatory'] });
      toast({
        title: "Record deleted",
        description: "The CPD record has been deleted.",
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
  
  const handleEdit = (record: CpdRecord) => {
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
    queryClient.invalidateQueries({ queryKey: ['cpdRecords'] });
    queryClient.invalidateQueries({ queryKey: ['cpdHoursTotal'] });
    queryClient.invalidateQueries({ queryKey: ['cpdParticipatory'] });
  };
  
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-nhs-black">Continuing Professional Development</h1>
          <p className="text-nhs-dark-grey">Record your CPD activities for revalidation</p>
        </div>
        <Button 
          className="mt-4 md:mt-0" 
          onClick={() => setIsFormOpen(true)}
          disabled={isFormOpen}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add CPD Activity
        </Button>
      </div>
      
      {/* Summary Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>CPD Summary</CardTitle>
          <CardDescription>
            You need 35 CPD hours including at least 20 hours of participatory learning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-nhs-dark-grey mb-2">Total CPD Hours</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-nhs-blue">{totalHours}</span>
                <span className="ml-2 text-nhs-dark-grey">/35 required</span>
              </div>
              
              <div className="mt-3 progress-bar">
                <div 
                  className={`progress-fill ${totalHours >= 35 ? 'bg-nhs-green' : 'bg-nhs-blue'}`} 
                  style={{ width: `${Math.min(totalHours / 35 * 100, 100)}%` }}
                ></div>
              </div>
              
              <div className="mt-4 flex items-center">
                {totalHours >= 35 ? (
                  <CheckCircle2 className="text-nhs-green h-5 w-5 mr-2" />
                ) : (
                  <Clock className="text-nhs-warm-yellow h-5 w-5 mr-2" />
                )}
                <span className="text-nhs-dark-grey">
                  {totalHours >= 35 
                    ? "Requirement met" 
                    : `${35 - totalHours} more hours needed`}
                </span>
              </div>
            </div>
            
            <div>
              <h3 className="text-nhs-dark-grey mb-2">Participatory Learning Hours</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-nhs-blue">{participatoryHours}</span>
                <span className="ml-2 text-nhs-dark-grey">/20 required</span>
              </div>
              
              <div className="mt-3 progress-bar">
                <div 
                  className={`progress-fill ${participatoryHours >= 20 ? 'bg-nhs-green' : 'bg-nhs-blue'}`} 
                  style={{ width: `${Math.min(participatoryHours / 20 * 100, 100)}%` }}
                ></div>
              </div>
              
              <div className="mt-4 flex items-center">
                {participatoryHours >= 20 ? (
                  <CheckCircle2 className="text-nhs-green h-5 w-5 mr-2" />
                ) : (
                  <Clock className="text-nhs-warm-yellow h-5 w-5 mr-2" />
                )}
                <span className="text-nhs-dark-grey">
                  {participatoryHours >= 20 
                    ? "Requirement met" 
                    : `${20 - participatoryHours} more participatory hours needed`}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Information Alert */}
      <Alert className="mb-6 bg-nhs-pale-grey border-nhs-light-blue">
        <InfoIcon className="h-4 w-4 text-nhs-light-blue" />
        <AlertTitle>NMC Requirement</AlertTitle>
        <AlertDescription>
          You must undertake 35 hours of continuing professional development (CPD) relevant to your scope of practice, 
          including at least 20 hours of participatory learning activities.
        </AlertDescription>
      </Alert>
      
      {/* CPD Records List */}
      <Tabs defaultValue="list" className="mb-6">
        <TabsList>
          <TabsTrigger value="list">All Records</TabsTrigger>
          <TabsTrigger value="info">Guidelines</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          {isLoading ? (
            <div className="text-center p-8">Loading CPD records...</div>
          ) : cpdRecords && cpdRecords.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-nhs-pale-grey">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Hours</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nhs-pale-grey">
                  {cpdRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-nhs-dark-grey">
                        {formatDateShort(record.date)}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-nhs-black">
                        {record.title}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-nhs-dark-grey">
                        {record.hours}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant={record.participatory ? "nhs-light-blue" : "secondary"}>
                          {record.participatory ? "Participatory" : "Individual"}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(record)}
                          >
                            Edit
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
                  <h3 className="text-lg font-semibold mb-2">No CPD Records</h3>
                  <p className="text-nhs-dark-grey mb-4">
                    You haven't recorded any CPD activities yet. Add your continuing professional development 
                    activities to track your progress toward the 35 required hours.
                  </p>
                  <Button onClick={() => setIsFormOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add CPD Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>CPD Guidelines</CardTitle>
              <CardDescription>
                Information about recording your CPD activities for NMC revalidation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-nhs-black mb-2">What is CPD?</h3>
                <p className="text-nhs-dark-grey">
                  Continuing Professional Development (CPD) is any learning activity that contributes to 
                  your professional development. It should be relevant to your scope of practice.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-nhs-black mb-2">CPD Requirements:</h3>
                <ul className="list-disc pl-5 text-nhs-dark-grey">
                  <li>35 hours of CPD in the three-year period since your last registration</li>
                  <li>Of these 35 hours, at least 20 must be participatory learning</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-nhs-black mb-2">Participatory vs Individual Learning:</h3>
                <p className="text-nhs-dark-grey mb-2">
                  <strong>Participatory learning</strong> involves interaction with one or more other professionals.
                  Examples include attending conferences, taking part in workshops, or engaging in group discussions.
                </p>
                <p className="text-nhs-dark-grey">
                  <strong>Individual learning</strong> is self-directed and completed alone.
                  Examples include reading journals, e-learning modules, or reviewing policies.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-nhs-black mb-2">Record keeping:</h3>
                <p className="text-nhs-dark-grey">
                  For each CPD activity, record the date, title, description, number of hours, 
                  whether it was participatory, and how it relates to The Code.
                </p>
              </div>
              
              <div className="bg-nhs-pale-grey p-4 rounded-md">
                <h3 className="font-semibold text-nhs-black mb-2">Official NMC Guidance:</h3>
                <p className="text-nhs-dark-grey mb-2">
                  For more detailed information about CPD requirements, refer to the 
                  official NMC revalidation guidance.
                </p>
                <a 
                  href="https://www.nmc.org.uk/revalidation/requirements/continuing-professional-development/"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-nhs-blue hover:underline"
                >
                  Visit NMC CPD Guidance →
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Document Manager Section */}
      <section className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="h-5 w-5 text-nhs-blue" />
          <h2 className="text-xl font-semibold">CPD Evidence Documents</h2>
        </div>
        <p className="text-nhs-dark-grey mb-4">
          Upload and manage supporting documents for your CPD activities. Keep evidence of your 
          participation in courses, workshops, and other learning activities.
        </p>
        
        <DocumentManager 
          category="cpd"
          title="CPD Evidence"
          description="Upload certificates, attendance records, and other evidence of your continuing professional development activities."
        />
      </section>
      
      {/* CPD Form Dialog */}
      {isFormOpen && (
        <CpdForm 
          initialData={editingRecord}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </main>
  );
}
