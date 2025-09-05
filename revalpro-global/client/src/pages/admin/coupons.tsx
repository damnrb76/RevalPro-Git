import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Tag, Trash2, Edit, Copy } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

interface CouponCode {
  id: number;
  code: string;
  description: string;
  planId: string;
  period: "monthly" | "annual";
  maxRedemptions: number | null;
  currentRedemptions: number;
  isActive: boolean;
  validFrom: Date | null;
  validUntil: Date | null;
  createdBy: number | null;
  created: Date;
}

export default function CouponsAdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    planId: "standard",
    period: "monthly" as "monthly" | "annual",
    maxRedemptions: "",
    isActive: true,
    validFrom: "",
    validUntil: "",
  });

  // Fetch existing coupons
  const { data: coupons, isLoading, error } = useQuery({
    queryKey: ["/api/admin/coupons"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/coupons");
      if (!response.ok) {
        throw new Error("Failed to fetch coupons");
      }
      return response.json() as Promise<CouponCode[]>;
    },
    enabled: !!user,
  });

  // Create coupon mutation
  const createCouponMutation = useMutation({
    mutationFn: async (couponData: any) => {
      const response = await apiRequest("POST", "/api/admin/coupons", couponData);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create coupon");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Coupon Created",
        description: "The coupon has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
      setIsCreateFormOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      planId: "standard",
      period: "monthly",
      maxRedemptions: "",
      isActive: true,
      validFrom: "",
      validUntil: "",
    });
  };

  const generateTestCoupons = () => {
    const testCoupons = [
      {
        code: `TEST${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        description: "Test Standard Monthly Plan",
        planId: "standard",
        period: "monthly",
        maxRedemptions: 5,
        isActive: true,
      },
      {
        code: `PREM${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        description: "Test Premium Annual Plan", 
        planId: "premium",
        period: "annual",
        maxRedemptions: 3,
        isActive: true,
      },
    ];
    
    testCoupons.forEach(coupon => {
      createCouponMutation.mutate(coupon);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const couponData = {
      ...formData,
      code: formData.code.toUpperCase(),
      maxRedemptions: formData.maxRedemptions ? parseInt(formData.maxRedemptions) : null,
      validFrom: formData.validFrom || null,
      validUntil: formData.validUntil || null,
    };

    createCouponMutation.mutate(couponData);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `Coupon code "${text}" copied to clipboard.`,
    });
  };

  const formatDate = (dateString: Date | string | null) => {
    if (!dateString) return "No limit";
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Coupon Management</h1>
        <p className="text-gray-600">Create and manage subscription coupon codes.</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load coupons"}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Create Coupon Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Coupon
              </CardTitle>
              <CardDescription>
                Generate coupon codes for subscription access.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button
                  onClick={generateTestCoupons}
                  variant="outline"
                  disabled={createCouponMutation.isPending}
                  className="w-full"
                >
                  {createCouponMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Tag className="h-4 w-4 mr-2" />
                  )}
                  Quick: Generate Test Coupons
                </Button>
                
                <Separator />
                
                <Button
                  onClick={() => setIsCreateFormOpen(!isCreateFormOpen)}
                  variant={isCreateFormOpen ? "outline" : "default"}
                  className="w-full"
                >
                  {isCreateFormOpen ? "Cancel" : "Create Custom Coupon"}
                </Button>
              </div>

              {isCreateFormOpen && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="code">Coupon Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="SUMMER2024"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Description of what this coupon provides"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="planId">Plan</Label>
                      <Select
                        value={formData.planId}
                        onValueChange={(value) => setFormData({ ...formData, planId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="period">Period</Label>
                      <Select
                        value={formData.period}
                        onValueChange={(value: "monthly" | "annual") => setFormData({ ...formData, period: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="maxRedemptions">Max Redemptions (optional)</Label>
                    <Input
                      id="maxRedemptions"
                      type="number"
                      value={formData.maxRedemptions}
                      onChange={(e) => setFormData({ ...formData, maxRedemptions: e.target.value })}
                      placeholder="Leave empty for unlimited"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="validFrom">Valid From (optional)</Label>
                      <Input
                        id="validFrom"
                        type="date"
                        value={formData.validFrom}
                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="validUntil">Valid Until (optional)</Label>
                      <Input
                        id="validUntil"
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={createCouponMutation.isPending}
                    className="w-full"
                  >
                    {createCouponMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      "Create Coupon"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coupons List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Existing Coupons</CardTitle>
              <CardDescription>
                {coupons?.length || 0} coupon(s) created
              </CardDescription>
            </CardHeader>
            <CardContent>
              {coupons && coupons.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coupons.map((coupon) => (
                        <TableRow key={coupon.id}>
                          <TableCell className="font-mono font-semibold">
                            {coupon.code}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium capitalize">{coupon.planId}</div>
                              <div className="text-sm text-gray-500 capitalize">{coupon.period}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{coupon.currentRedemptions} used</div>
                              <div className="text-gray-500">
                                {coupon.maxRedemptions ? `of ${coupon.maxRedemptions}` : "unlimited"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={coupon.isActive ? "default" : "secondary"}>
                              {coupon.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(coupon.validUntil)}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(coupon.code)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No coupons yet</h3>
                  <p className="text-gray-600 mb-4">
                    Create your first coupon code to get started.
                  </p>
                  <Button onClick={generateTestCoupons} disabled={createCouponMutation.isPending}>
                    Generate Test Coupons
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}