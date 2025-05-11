import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define service status response type
interface ServiceStatusResponse {
  status: 'Available' | 'Unavailable' | 'Maintenance';
  lastChecked: string;
}
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateFull } from "@/lib/date-utils";

export default function NmcServiceStatus() {
  // Service status query
  const statusQuery = useQuery<ServiceStatusResponse>({
    queryKey: ["/api/nmc/status"],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const refreshStatus = () => {
    statusQuery.refetch();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return (
          <div className="flex items-center">
            <Badge variant="completed" className="mr-2">Available</Badge>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        );
      case 'Maintenance':
        return (
          <div className="flex items-center">
            <Badge variant="attention-needed" className="mr-2">Maintenance</Badge>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
        );
      case 'Unavailable':
      default:
        return (
          <div className="flex items-center">
            <Badge variant="destructive" className="mr-2">Unavailable</Badge>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-revalpro-blue">NMC Service Status</h1>
      <p className="text-muted-foreground mb-8">
        Check the current operational status of NMC online services
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>NMC Services Status</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshStatus}
                disabled={statusQuery.isFetching}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${statusQuery.isFetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <CardDescription>
              Current status of NMC online systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statusQuery.isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-revalpro-blue"></div>
              </div>
            ) : statusQuery.isError ? (
              <div className="p-4 border border-red-200 rounded-md bg-red-50">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700">
                    Unable to fetch NMC service status. Please try again later.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">NMC Online Portal</h3>
                    <p className="text-sm text-muted-foreground">
                      Main website and user account services
                    </p>
                  </div>
                  {getStatusBadge(statusQuery.data?.status || 'Unavailable')}
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    Last checked: {statusQuery.data?.lastChecked 
                      ? formatDateFull(new Date(statusQuery.data.lastChecked)) 
                      : "Unknown"}
                  </p>
                </div>
                
                {statusQuery.data?.status === 'Maintenance' && (
                  <div className="p-4 border border-amber-200 rounded-md bg-amber-50">
                    <p className="text-amber-800">
                      NMC Online is currently undergoing scheduled maintenance. 
                      Please try again later or visit the NMC website for more information.
                    </p>
                  </div>
                )}
                
                {statusQuery.data?.status === 'Unavailable' && (
                  <div className="p-4 border border-red-200 rounded-md bg-red-50">
                    <p className="text-red-700">
                      NMC Online services appear to be unavailable at the moment.
                      This could be due to technical issues or unscheduled maintenance.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>What This Means</CardTitle>
            <CardDescription>
              Understanding NMC service status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium flex items-center">
                <Badge variant="completed" className="mr-2">Available</Badge>
                <span>Available</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                All NMC online services are operational. You can access your account,
                check registration status, and submit revalidation applications.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium flex items-center">
                <Badge variant="attention-needed" className="mr-2">Maintenance</Badge>
                <span>Maintenance</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                NMC is performing scheduled maintenance on their systems. Some or all
                online services may be unavailable during this time. Please check back later.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium flex items-center">
                <Badge variant="destructive" className="mr-2">Unavailable</Badge>
                <span>Unavailable</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                NMC online services are currently unavailable. This may be due to
                technical issues or unscheduled maintenance. If this persists,
                please contact the NMC directly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}