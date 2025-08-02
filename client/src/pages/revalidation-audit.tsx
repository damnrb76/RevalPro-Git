import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Archive, 
  Calendar, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  FileText,
  Shield,
  History
} from 'lucide-react';
import { format, isAfter, addMonths, differenceInDays, differenceInMonths } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';

// Define the type locally for demo purposes
type RevalidationCycleData = {
  id?: number;
  userId: number;
  cycleNumber: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'archived';
  submissionDate?: string | null;
  nmcSubmissionReference?: string | null;
  archivedData?: any;
  coreMetrics?: any;
};

// Demo utility functions
const RevalidationUtils = {
  getCycleStatusText: (cycle: RevalidationCycleData) => {
    switch (cycle.status) {
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'archived': return 'Archived';
      default: return 'Unknown';
    }
  },
  
  formatCyclePeriod: (cycle: RevalidationCycleData) => {
    return `${format(new Date(cycle.startDate), 'MMM yyyy')} - ${format(new Date(cycle.endDate), 'MMM yyyy')}`;
  },
  
  getRemainingTime: (cycle: RevalidationCycleData) => {
    const now = new Date();
    const endDate = new Date(cycle.endDate);
    const daysRemaining = differenceInDays(endDate, now);
    const monthsRemaining = differenceInMonths(endDate, now);
    
    if (daysRemaining < 0) return 'Expired';
    if (monthsRemaining < 1) return `${daysRemaining} days`;
    if (monthsRemaining < 12) return `${monthsRemaining} months`;
    
    const years = Math.floor(monthsRemaining / 12);
    const remainingMonths = monthsRemaining % 12;
    return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years} years`;
  }
};

interface RevalidationAuditPageProps {}

// Demo data for demonstration purposes
const DEMO_CYCLES: RevalidationCycleData[] = [
  {
    id: 1,
    userId: 1,
    cycleNumber: 2,
    startDate: '2022-04-01',
    endDate: '2025-03-31',
    status: 'completed',
    submissionDate: '2025-03-15',
    nmcSubmissionReference: 'NMC-REV-2025-001234',
    archivedData: {
      practiceHours: 4500,
      cpdActivities: 35,
      reflections: 5,
      feedbackRecords: 8
    },
    coreMetrics: {
      registrationNumber: 'ABC123456',
      role: 'Registered Nurse',
      specialty: 'Critical Care',
      contractedHours: 37.5
    }
  },
  {
    id: 2,
    userId: 1,
    cycleNumber: 3,
    startDate: '2025-04-01',
    endDate: '2028-03-31',
    status: 'active',
    submissionDate: null,
    nmcSubmissionReference: null,
    archivedData: null,
    coreMetrics: {
      registrationNumber: 'ABC123456',
      role: 'Registered Nurse',
      specialty: 'Critical Care',
      contractedHours: 37.5
    }
  }
];

export default function RevalidationAuditPage({}: RevalidationAuditPageProps) {
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  const [nmcReference, setNmcReference] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [selectedCycleForExport, setSelectedCycleForExport] = useState<number | null>(null);
  
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // For demo purposes, use hardcoded data when user is available
  const cycles = user ? DEMO_CYCLES : [];
  const currentCycle = cycles.find(c => c.status === 'active') || null;
  const isLoading = false;

  
  // Submit revalidation mutation (demo version)
  const submitRevalidationMutation = {
    mutate: () => {
      // Demo simulation
      alert('Demo: Revalidation submitted successfully! New cycle automatically started.');
      setIsSubmissionDialogOpen(false);
      setNmcReference('');
      setSubmissionNotes('');
    },
    isPending: false
  };
  
  // Export archived data (demo version)
  const handleExportData = async (cycleId: number, format: 'json' | 'pdf' = 'json') => {
    // Demo simulation
    const cycle = cycles.find(c => c.id === cycleId);
    if (cycle && cycle.archivedData) {
      const data = {
        cycleInfo: cycle,
        exportDate: new Date().toISOString(),
        format: format
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revalidation-cycle-${cycle.cycleNumber}-audit.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  
  const handleSubmitRevalidation = () => {
    if (!nmcReference.trim()) {
      alert('Please enter your NMC submission reference');
      return;
    }
    submitRevalidationMutation.mutate();
  };
  
  const getCycleStatusColor = (cycle: RevalidationCycleData) => {
    switch (cycle.status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Demo versions of cycle status checks
  const isNearingExpiry = currentCycle ? isAfter(addMonths(new Date(), 6), new Date(currentCycle.endDate)) : false;
  const isExpired = currentCycle ? isAfter(new Date(), new Date(currentCycle.endDate)) : false;
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Loading revalidation history...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revalidation Audit & Management</h1>
          <p className="text-gray-600 mt-2">
            Complete audit trail of your revalidation cycles with data retrieval for compliance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">
            {cycles?.length || 0} Total Cycles
          </span>
        </div>
      </div>
      
      {/* Current Cycle Status */}
      {currentCycle && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Current Revalidation Cycle
              </CardTitle>
              <Badge className={getCycleStatusColor(currentCycle)}>
                {RevalidationUtils.getCycleStatusText(currentCycle)}
              </Badge>
            </div>
            <CardDescription>
              Cycle {currentCycle.cycleNumber} • {RevalidationUtils.formatCyclePeriod(currentCycle)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Time Remaining</Label>
                <div className="text-lg font-semibold">
                  {RevalidationUtils.getRemainingTime(currentCycle)}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">End Date</Label>
                <div className="text-lg">
                  {format(new Date(currentCycle.endDate), 'MMM d, yyyy')}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">Status</Label>
                <div className="flex items-center gap-2">
                  {isExpired ? (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  ) : isNearingExpiry ? (
                    <Clock className="h-4 w-4 text-amber-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-sm">
                    {isExpired ? 'Expired' : isNearingExpiry ? 'Due Soon' : 'On Track'}
                  </span>
                </div>
              </div>
            </div>
            
            {(isNearingExpiry || isExpired) && (
              <Alert className={isExpired ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}>
                <AlertCircle className={`h-4 w-4 ${isExpired ? 'text-red-600' : 'text-amber-600'}`} />
                <AlertDescription className={isExpired ? 'text-red-800' : 'text-amber-800'}>
                  {isExpired 
                    ? 'Your revalidation cycle has expired. Complete and submit immediately.'
                    : 'Your revalidation is due within 6 months. Start preparing your submission.'
                  }
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-end">
              <Button 
                onClick={() => setIsSubmissionDialogOpen(true)}
                disabled={currentCycle.status !== 'active'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Complete & Submit Revalidation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Revalidation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-gray-600" />
            Revalidation History & Audit Trail
          </CardTitle>
          <CardDescription>
            Complete archive of all revalidation cycles for audit and compliance purposes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!cycles || cycles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Archive className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No revalidation history found</p>
              <p className="text-sm">Your completed cycles will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cycles.map((cycle) => (
                <div key={cycle.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-semibold">
                        Cycle {cycle.cycleNumber}
                      </div>
                      <Badge className={getCycleStatusColor(cycle)}>
                        {RevalidationUtils.getCycleStatusText(cycle)}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {RevalidationUtils.formatCyclePeriod(cycle)}
                    </div>
                  </div>
                  
                  {cycle.submissionDate && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="font-medium">Submitted</Label>
                        <div className="text-gray-600">
                          {format(new Date(cycle.submissionDate), 'MMM d, yyyy \'at\' h:mm a')}
                        </div>
                      </div>
                      {cycle.nmcSubmissionReference && (
                        <div>
                          <Label className="font-medium">NMC Reference</Label>
                          <div className="text-gray-600 font-mono">
                            {cycle.nmcSubmissionReference}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {cycle.status === 'completed' && cycle.archivedData && (
                    <div className="flex justify-end pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportData(cycle.id!, 'json')}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Audit Data
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Core Metrics Carryforward Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-green-600" />
            Automatic Cycle Management
          </CardTitle>
          <CardDescription>
            How RevalPro manages your revalidation cycles and data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-800">After Submission</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Complete data archive created for audit purposes
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  All revalidation evidence preserved
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  NMC submission reference recorded
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-800">New Cycle Automatic</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <RefreshCw className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  New 3-year cycle starts immediately
                </li>
                <li className="flex items-start gap-2">
                  <RefreshCw className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  Core metrics carried forward (role, hours, etc.)
                </li>
                <li className="flex items-start gap-2">
                  <RefreshCw className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  Fresh tracking for new requirements
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Submission Dialog */}
      <Dialog open={isSubmissionDialogOpen} onOpenChange={setIsSubmissionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Revalidation Submission</DialogTitle>
            <DialogDescription>
              This will archive your current cycle data and automatically start a new revalidation period.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nmc-reference">NMC Submission Reference *</Label>
              <Input
                id="nmc-reference"
                placeholder="Enter your NMC reference number"
                value={nmcReference}
                onChange={(e) => setNmcReference(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="submission-notes">Additional Notes (Optional)</Label>
              <Textarea
                id="submission-notes"
                placeholder="Any additional notes about this submission..."
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmissionDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitRevalidation}
              disabled={submitRevalidationMutation.isPending || !nmcReference.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {submitRevalidationMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Complete Submission'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}