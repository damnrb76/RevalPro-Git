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
import { reflectiveAccountsStorage } from "@/lib/storage";
import ReflectionForm from "@/components/forms/reflection-form";
import ReflectiveDiscussionForm from "@/components/forms/reflective-discussion-form";
import DocumentManager from "@/components/documents/document-manager";
import { CodeSectionsEnum } from "@shared/schema";
import type { ReflectiveAccount, ReflectiveDiscussion } from "@shared/schema";

export default function ReflectionsPage() {
  const [isReflectionFormOpen, setIsReflectionFormOpen] = useState(false);
  const [isDiscussionFormOpen, setIsDiscussionFormOpen] = useState(false);
  const [editingReflection, setEditingReflection] = useState<ReflectiveAccount | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch reflective accounts
  const { data: reflections, isLoading } = useQuery({
    queryKey: ['reflections'],
    queryFn: async () => {
      const records = await reflectiveAccountsStorage.getAll();
      // Sort by most recent date
      return records.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    },
  });
  
  // Fetch reflective discussion
  const { data: reflectiveDiscussion } = useQuery({
    queryKey: ['reflectiveDiscussion'],
    queryFn: async () => {
      return reflectiveAccountsStorage.getCurrent();
    },
  });
  
  // Get reflection count
  const { data: reflectionsCount = 0 } = useQuery({
    queryKey: ['reflectionsCount'],
    queryFn: async () => {
      return reflectiveAccountsStorage.getCount();
    },
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await reflectiveAccountsStorage.remove(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
      queryClient.invalidateQueries({ queryKey: ['reflectionsCount'] });
      toast({
        title: "Record deleted",
        description: "The reflective account has been deleted.",
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
    if (window.confirm("Are you sure you want to delete this reflective account?")) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleEdit = (reflection: ReflectiveAccount) => {
    setEditingReflection(reflection);
    setIsReflectionFormOpen(true);
  };
  
  const handleFormClose = () => {
    setIsReflectionFormOpen(false);
    setEditingReflection(null);
  };
  
  const handleFormSuccess = () => {
    setIsReflectionFormOpen(false);
    setEditingReflection(null);
    queryClient.invalidateQueries({ queryKey: ['reflections'] });
    queryClient.invalidateQueries({ queryKey: ['reflectionsCount'] });
  };
  
  const handleDiscussionFormClose = () => {
    setIsDiscussionFormOpen(false);
  };
  
  const handleDiscussionFormSuccess = () => {
    setIsDiscussionFormOpen(false);
    queryClient.invalidateQueries({ queryKey: ['reflectiveDiscussion'] });
  };
  
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-nhs-black">Reflective Practice</h1>
          <p className="text-nhs-dark-grey">Record your reflective accounts and discussion for revalidation</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={() => setIsReflectionFormOpen(true)}
            disabled={isReflectionFormOpen}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Reflection
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsDiscussionFormOpen(true)}
            disabled={isDiscussionFormOpen}
          >
            Record Discussion
          </Button>
        </div>
      </div>
      
      {/* Summary Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Reflections Summary</CardTitle>
          <CardDescription>
            You need 5 reflective accounts and 1 reflective discussion for revalidation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-nhs-dark-grey mb-2">Reflective Accounts</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-nhs-blue">{reflectionsCount}</span>
                <span className="ml-2 text-nhs-dark-grey">/5 required</span>
              </div>
              
              <div className="mt-3 progress-bar">
                <div 
                  className={`progress-fill ${reflectionsCount >= 5 ? 'bg-nhs-green' : 'bg-nhs-blue'}`} 
                  style={{ width: `${Math.min(reflectionsCount / 5 * 100, 100)}%` }}
                ></div>
              </div>
              
              <div className="mt-4 flex items-center">
                {reflectionsCount >= 5 ? (
                  <CheckCircle2 className="text-nhs-green h-5 w-5 mr-2" />
                ) : (
                  <Clock className="text-nhs-warm-yellow h-5 w-5 mr-2" />
                )}
                <span className="text-nhs-dark-grey">
                  {reflectionsCount >= 5 
                    ? "Requirement met" 
                    : `${5 - reflectionsCount} more reflections needed`}
                </span>
              </div>
            </div>
            
            <div>
              <h3 className="text-nhs-dark-grey mb-2">Reflective Discussion</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-nhs-blue">
                  {reflectiveDiscussion?.completed ? "1" : "0"}
                </span>
                <span className="ml-2 text-nhs-dark-grey">/1 required</span>
              </div>
              
              <div className="mt-3 progress-bar">
                <div 
                  className={`progress-fill ${reflectiveDiscussion?.completed ? 'bg-nhs-green' : 'bg-nhs-red'}`} 
                  style={{ width: `${reflectiveDiscussion?.completed ? 100 : 0}%` }}
                ></div>
              </div>
              
              <div className="mt-4 flex items-center">
                {reflectiveDiscussion?.completed ? (
                  <CheckCircle2 className="text-nhs-green h-5 w-5 mr-2" />
                ) : (
                  <Clock className="text-nhs-red h-5 w-5 mr-2" />
                )}
                <span className="text-nhs-dark-grey">
                  {reflectiveDiscussion?.completed 
                    ? "Requirement met" 
                    : "Discussion record needed"}
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
          You must record at least five written reflective accounts that explain what you learnt from your CPD activity 
          and/or feedback and/or an event or experience in your practice, and how this has changed or improved your practice. 
          You must also have a reflective discussion with another NMC registrant about these accounts.
        </AlertDescription>
      </Alert>
      
      {/* Reflections List */}
      <Tabs defaultValue="accounts" className="mb-6">
        <TabsList>
          <TabsTrigger value="accounts">Reflective Accounts</TabsTrigger>
          <TabsTrigger value="discussion">Reflective Discussion</TabsTrigger>
          <TabsTrigger value="info">Guidelines</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts">
          {isLoading ? (
            <div className="text-center p-8">Loading reflective accounts...</div>
          ) : reflections && reflections.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-nhs-pale-grey">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Code Section</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-nhs-dark-grey uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nhs-pale-grey">
                  {reflections.map((reflection) => (
                    <tr key={reflection.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-nhs-dark-grey">
                        {formatDateShort(reflection.date)}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-nhs-black">
                        {reflection.title}
                      </td>
                      <td className="px-4 py-4 text-sm text-nhs-dark-grey">
                        {reflection.codeRelation}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(reflection)}
                          >
                            View/Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(reflection.id)}
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
                  <h3 className="text-lg font-semibold mb-2">No Reflective Accounts</h3>
                  <p className="text-nhs-dark-grey mb-4">
                    You haven't recorded any reflective accounts yet. Add your reflections to track 
                    your progress toward the 5 required reflections.
                  </p>
                  <Button onClick={() => setIsReflectionFormOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Reflection
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="discussion">
          <Card>
            <CardHeader>
              <CardTitle>Reflective Discussion</CardTitle>
              <CardDescription>
                Record details of your reflective discussion with another NMC registrant
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reflectiveDiscussion ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-nhs-black">Discussion Details</h3>
                      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="text-nhs-dark-grey">Date:</div>
                        <div>{formatDateShort(reflectiveDiscussion.date)}</div>
                        
                        <div className="text-nhs-dark-grey">Partner Name:</div>
                        <div>{reflectiveDiscussion.partnerName}</div>
                        
                        <div className="text-nhs-dark-grey">Partner NMC PIN:</div>
                        <div>{reflectiveDiscussion.partnerNmcPin}</div>
                        
                        {reflectiveDiscussion.email && (
                          <>
                            <div className="text-nhs-dark-grey">Email:</div>
                            <div>{reflectiveDiscussion.email}</div>
                          </>
                        )}
                        
                        <div className="text-nhs-dark-grey">Status:</div>
                        <div>
                          <Badge variant={reflectiveDiscussion.completed ? "completed" : "not-started"}>
                            {reflectiveDiscussion.completed ? "Completed" : "Not Completed"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDiscussionFormOpen(true)}
                    >
                      Edit Discussion
                    </Button>
                  </div>
                  
                  {reflectiveDiscussion.notes && (
                    <div>
                      <h3 className="font-semibold text-nhs-black mb-2">Notes</h3>
                      <p className="text-nhs-dark-grey bg-nhs-pale-grey p-3 rounded">{reflectiveDiscussion.notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-6">
                  <AlertTriangle className="mx-auto h-12 w-12 text-nhs-warm-yellow mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Reflective Discussion Recorded</h3>
                  <p className="text-nhs-dark-grey mb-4">
                    You haven't recorded your reflective discussion yet. This is a required element of revalidation.
                  </p>
                  <Button onClick={() => setIsDiscussionFormOpen(true)}>
                    Record Reflective Discussion
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Reflection Guidelines</CardTitle>
              <CardDescription>
                Information about recording reflective accounts and discussion for NMC revalidation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-nhs-black mb-2">Reflective Accounts</h3>
                <p className="text-nhs-dark-grey">
                  You must write five reflective accounts that explain what you learnt from your CPD activity, 
                  feedback, or an event or experience in your practice, and how this has changed or improved 
                  your work. Each account should be linked to at least one of the four themes of The Code.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-nhs-black mb-2">The Four Themes of The Code:</h3>
                <ul className="list-disc pl-5 text-nhs-dark-grey">
                  {Object.values(CodeSectionsEnum).map((section, index) => (
                    <li key={index}>{section}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-nhs-black mb-2">Reflective Discussion</h3>
                <p className="text-nhs-dark-grey">
                  You must have a reflective discussion with another NMC registrant about your five reflective accounts. 
                  This discussion should help you to consider your practice in greater depth and identify improvements.
                </p>
              </div>
              
              <div className="bg-nhs-pale-grey p-4 rounded-md">
                <h3 className="font-semibold text-nhs-black mb-2">Confidentiality:</h3>
                <p className="text-nhs-dark-grey mb-2">
                  When writing your reflective accounts, make sure you maintain confidentiality and do not record any
                  information that could identify a specific patient, service user, colleague or others.
                </p>
              </div>
              
              <div className="bg-nhs-pale-grey p-4 rounded-md">
                <h3 className="font-semibold text-nhs-black mb-2">Official NMC Guidance:</h3>
                <p className="text-nhs-dark-grey mb-2">
                  For more detailed information about reflection requirements, refer to the 
                  official NMC revalidation guidance.
                </p>
                <a 
                  href="https://www.nmc.org.uk/revalidation/requirements/reflective-practice/"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-nhs-blue hover:underline"
                >
                  Visit NMC Reflection Guidance →
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Reflection Form Dialog */}
      {isReflectionFormOpen && (
        <ReflectionForm 
          initialData={editingReflection}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
      
      {/* Reflective Discussion Form Dialog */}
      {isDiscussionFormOpen && (
        <ReflectiveDiscussionForm 
          initialData={reflectiveDiscussion as ReflectiveDiscussion}
          onClose={handleDiscussionFormClose}
          onSuccess={handleDiscussionFormSuccess}
        />
      )}
    </main>
  );
}
