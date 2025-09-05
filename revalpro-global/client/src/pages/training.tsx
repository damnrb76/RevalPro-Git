import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Calendar, Building, Clock, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import TrainingForm from "@/components/forms/training-form";
import { apiRequest } from "@/lib/queryClient";
import { TrainingRecord, TrainingStatus } from "@shared/schema";

export default function TrainingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TrainingRecord | null>(null);
  const queryClient = useQueryClient();

  const { data: trainingRecords = [], isLoading } = useQuery<TrainingRecord[]>({
    queryKey: ["/api/training-records"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/training-records/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/training-records"] });
      toast({
        title: "Success",
        description: "Training record deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete training record",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (record: TrainingRecord) => {
    setEditingRecord(record);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this training record?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingRecord(null);
  };

  const getStatusColor = (status: TrainingStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "due":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Mandatory":
        return "bg-purple-100 text-purple-800";
      case "Professional Development":
        return "bg-blue-100 text-blue-800";
      case "Clinical Skills":
        return "bg-green-100 text-green-800";
      case "Health & Safety":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg">Loading training records...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-revalpro-black">Training Records</h1>
          <p className="text-revalpro-gray mt-2">
            Track your mandatory training and professional development activities
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-revalpro-blue hover:bg-revalpro-dark-blue">
              <Plus className="h-4 w-4 mr-2" />
              Add Training Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRecord ? "Edit Training Record" : "Add New Training Record"}
              </DialogTitle>
            </DialogHeader>
            <TrainingForm
              record={editingRecord}
              onSuccess={handleDialogClose}
            />
          </DialogContent>
        </Dialog>
      </div>

      {trainingRecords.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Trophy className="h-12 w-12 text-revalpro-gray mx-auto mb-4" />
            <h3 className="text-lg font-medium text-revalpro-black mb-2">No training records yet</h3>
            <p className="text-revalpro-gray mb-4">
              Start tracking your training and professional development activities
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-revalpro-blue hover:bg-revalpro-dark-blue"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Training Record
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainingRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold text-revalpro-black line-clamp-2">
                    {record.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(record)}
                      className="text-revalpro-blue hover:text-revalpro-dark-blue"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(record.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge className={getStatusColor(record.status as TrainingStatus)}>
                    {record.status}
                  </Badge>
                  <Badge className={getCategoryColor(record.category)}>
                    {record.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-revalpro-gray">
                  <Building className="h-4 w-4 mr-2" />
                  {record.provider}
                </div>
                <div className="flex items-center text-sm text-revalpro-gray">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(record.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-revalpro-gray">
                  <Clock className="h-4 w-4 mr-2" />
                  {record.duration} hours
                </div>
                {record.expiryDate && (
                  <div className="flex items-center text-sm text-revalpro-gray">
                    <Calendar className="h-4 w-4 mr-2" />
                    Expires: {new Date(record.expiryDate).toLocaleDateString()}
                  </div>
                )}
                {record.certificateNumber && (
                  <div className="text-sm text-revalpro-gray">
                    Certificate: {record.certificateNumber}
                  </div>
                )}
                {record.description && (
                  <p className="text-sm text-revalpro-gray line-clamp-3">
                    {record.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}