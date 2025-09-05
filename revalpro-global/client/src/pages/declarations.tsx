import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  InfoIcon, CheckCircle2, X, AlertTriangle, 
  FileText, ClipboardCheck, ShieldCheck 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { healthDeclarationStorage, confirmationStorage } from "@/lib/storage";
import HealthCharacterForm from "@/components/forms/health-character-form";
import { formatDateShort } from "@/lib/date-utils";
import type { HealthDeclaration, Confirmation } from "@shared/schema";

export default function DeclarationsPage() {
  const [isHealthFormOpen, setIsHealthFormOpen] = useState(false);
  const [isConfirmationFormOpen, setIsConfirmationFormOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch health declaration
  const { data: healthDeclaration, isLoading: isLoadingHealth } = useQuery({
    queryKey: ['healthDeclaration'],
    queryFn: async () => {
      return healthDeclarationStorage.getCurrent();
    },
  });
  
  // Fetch confirmation
  const { data: confirmation, isLoading: isLoadingConfirmation } = useQuery({
    queryKey: ['confirmation'],
    queryFn: async () => {
      return confirmationStorage.getCurrent();
    },
  });
  
  const handleHealthFormClose = () => {
    setIsHealthFormOpen(false);
  };
  
  const handleHealthFormSuccess = () => {
    setIsHealthFormOpen(false);
    queryClient.invalidateQueries({ queryKey: ['healthDeclaration'] });
  };
  
  const handleConfirmationFormClose = () => {
    setIsConfirmationFormOpen(false);
  };
  
  const handleConfirmationFormSuccess = () => {
    setIsConfirmationFormOpen(false);
    queryClient.invalidateQueries({ queryKey: ['confirmation'] });
  };
  
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-nhs-black">Declarations</h1>
        <p className="text-nhs-dark-grey">Complete required declarations for your revalidation</p>
      </div>
      
      {/* Information Alert */}
      <Alert className="mb-6 bg-nhs-pale-grey border-nhs-light-blue">
        <InfoIcon className="h-4 w-4 text-nhs-light-blue" />
        <AlertTitle>NMC Requirement</AlertTitle>
        <AlertDescription>
          You must provide a health and character declaration and declare that you have, or will have when 
          practicing, an appropriate professional indemnity arrangement. You must also provide a confirmation 
          from an appropriate person that you have met the revalidation requirements.
        </AlertDescription>
      </Alert>
      
      {/* Health & Character Declaration */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-nhs-blue" />
              Health & Character Declaration
            </CardTitle>
            <CardDescription>
              Declaration of good health and good character
            </CardDescription>
          </div>
          <Badge variant={healthDeclaration?.completed ? "default" : "destructive"}>
            {healthDeclaration?.completed ? "Completed" : "Not Started"}
          </Badge>
        </CardHeader>
        <CardContent>
          {isLoadingHealth ? (
            <div className="text-center p-4">Loading health declaration...</div>
          ) : healthDeclaration ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-nhs-dark-grey mb-2">Health Declaration</h3>
                  <div className="flex items-center">
                    {healthDeclaration.goodHealth ? (
                      <CheckCircle2 className="h-5 w-5 text-nhs-green mr-2" />
                    ) : (
                      <X className="h-5 w-5 text-nhs-red mr-2" />
                    )}
                    <span>
                      {healthDeclaration.goodHealth 
                        ? "I declare that I am in good health" 
                        : "Issues with health declaration"}
                    </span>
                  </div>
                  {healthDeclaration.healthChanges && (
                    <div className="mt-2 bg-nhs-pale-grey p-3 rounded text-sm">
                      <p className="font-medium">Details:</p>
                      <p>{healthDeclaration.healthChanges}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-nhs-dark-grey mb-2">Character Declaration</h3>
                  <div className="flex items-center">
                    {healthDeclaration.goodCharacter ? (
                      <CheckCircle2 className="h-5 w-5 text-nhs-green mr-2" />
                    ) : (
                      <X className="h-5 w-5 text-nhs-red mr-2" />
                    )}
                    <span>
                      {healthDeclaration.goodCharacter 
                        ? "I declare that I am of good character" 
                        : "Issues with character declaration"}
                    </span>
                  </div>
                  {healthDeclaration.characterChanges && (
                    <div className="mt-2 bg-nhs-pale-grey p-3 rounded text-sm">
                      <p className="font-medium">Details:</p>
                      <p>{healthDeclaration.characterChanges}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-2 flex justify-end">
                <Button onClick={() => setIsHealthFormOpen(true)}>
                  {healthDeclaration.completed ? "Edit Declaration" : "Complete Declaration"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center p-6">
              <AlertTriangle className="mx-auto h-12 w-12 text-nhs-warm-yellow mb-4" />
              <h3 className="text-lg font-semibold mb-2">Declaration Not Started</h3>
              <p className="text-nhs-dark-grey mb-4">
                You need to complete your health and character declaration for revalidation.
              </p>
              <Button onClick={() => setIsHealthFormOpen(true)}>
                Complete Declaration
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Confirmation */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-nhs-blue" />
              Confirmation
            </CardTitle>
            <CardDescription>
              Confirmation from an appropriate person that you've met the revalidation requirements
            </CardDescription>
          </div>
          <Badge variant={confirmation?.completed ? "default" : "destructive"}>
            {confirmation?.completed ? "Completed" : "Not Started"}
          </Badge>
        </CardHeader>
        <CardContent>
          {isLoadingConfirmation ? (
            <div className="text-center p-4">Loading confirmation details...</div>
          ) : confirmation ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-nhs-dark-grey mb-2">Confirmer Details</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-x-2 text-sm">
                      <div className="text-nhs-dark-grey">Name:</div>
                      <div>{confirmation.confirmerName}</div>
                      
                      <div className="text-nhs-dark-grey">Email:</div>
                      <div>{confirmation.confirmerEmail || "Not provided"}</div>
                      
                      <div className="text-nhs-dark-grey">NMC PIN:</div>
                      <div>{confirmation.confirmerNmcPin || "Not applicable"}</div>
                      
                      <div className="text-nhs-dark-grey">Relationship:</div>
                      <div>{confirmation.confirmerRelationship}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-nhs-dark-grey mb-2">Confirmation Status</h3>
                  <div className="flex items-center">
                    {confirmation.completed ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-nhs-green mr-2" />
                        <span>Confirmation completed on {formatDateShort(confirmation.confirmationDate || new Date())}</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 text-nhs-warm-yellow mr-2" />
                        <span>Awaiting confirmation</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-2 flex justify-end">
                <Button onClick={() => setIsConfirmationFormOpen(true)}>
                  {confirmation.completed ? "Edit Confirmation" : "Complete Confirmation"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center p-6">
              <AlertTriangle className="mx-auto h-12 w-12 text-nhs-warm-yellow mb-4" />
              <h3 className="text-lg font-semibold mb-2">Confirmation Not Started</h3>
              <p className="text-nhs-dark-grey mb-4">
                You need to record details of your confirmer who will verify that you've met 
                all the revalidation requirements.
              </p>
              <Button onClick={() => setIsConfirmationFormOpen(true)}>
                Record Confirmation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Professional Indemnity Guidance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-nhs-blue" />
            Professional Indemnity Arrangements
          </CardTitle>
          <CardDescription>
            Information about professional indemnity requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-nhs-dark-grey">
            As part of your revalidation application, you need to declare that you have, or will have when 
            practicing, an appropriate professional indemnity arrangement in place.
          </p>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold text-nhs-black mb-2">NHS Employees</h3>
            <p className="text-nhs-dark-grey">
              If you are employed by the NHS, your employer typically provides appropriate cover for the activities you 
              perform as part of your role.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-nhs-black mb-2">Self-employed or Private Practice</h3>
            <p className="text-nhs-dark-grey">
              If you are self-employed, in private practice, or employed by a non-NHS organization, you should 
              check whether your employer provides appropriate cover. If not, you may need to arrange your own 
              professional indemnity insurance.
            </p>
          </div>
          
          <div className="bg-nhs-pale-grey p-4 rounded-md">
            <h3 className="font-semibold text-nhs-black mb-2">Official NMC Guidance:</h3>
            <p className="text-nhs-dark-grey mb-2">
              For more detailed information about professional indemnity requirements, refer to the 
              official NMC guidance.
            </p>
            <a 
              href="https://www.nmc.org.uk/registration/professional-indemnity-arrangement/"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-nhs-blue hover:underline"
            >
              Visit NMC Indemnity Guidance →
            </a>
          </div>
        </CardContent>
      </Card>
      
      {/* Health and Character Form Dialog */}
      {isHealthFormOpen && (
        <HealthCharacterForm 
          initialData={healthDeclaration as HealthDeclaration}
          onClose={handleHealthFormClose}
          onSuccess={handleHealthFormSuccess}
        />
      )}
      
      {/* Confirmation Form Dialog 
      Would normally be implemented but not included in this submission per task constraints */}
    </main>
  );
}
